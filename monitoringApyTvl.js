import { ethers } from "ethers";
import {
    ETH_NODE,
    ARB_NODE,
    threshold1,
    threshold2,
    calculateDeviationPercent,
    getAndFormatDate,
} from "./utils/utils.js";
import { getLastData, writeAlertTs, getAlertsTS } from "./utils/database.js";
import { sendMessageToDiscord, sendMessageToMessageBird } from "./utils/alert.js";
import { strategies } from "./strategy_list/apyStrategy.js";
import { strategiesTVL } from "./strategy_list/tvlStrategy.js";
import { getPrice } from "./utils/price.js";

const getApy = async (strategy, provider, prices) => {
    const { strategy_id, strategy_addr, vault_addr, method, params, chain } = strategy;
    const network = chain === 1 ? 'ETH' : 'ARB';
    const stratProvider = provider[chain];
    const [apy, tvl] = await method(stratProvider, ...params, prices);
    return {
        strategy_id,
        strategy_addr,
        vault_addr,
        network,
        apy,
        tvl,
        timestamp: Math.floor(Date.now() / 1000),
        created_at: getAndFormatDate()
    }
}



const saveToDB = async (data, fn) => {
    let result = true;
    try {
        for (const record of data) {
            const insert = await fn(record, db);
            result = result * insert;
        }
    }
    catch (err) {
        console.error('Error_:', err.message);
        result = false;
    }
    finally {
        return result;
    }
}


const saveApyStatsToPG = async (pgClient,  data) => {
    try {
        const values = data.map(item =>
            `('${item.strategy_id}', ${item.tvl}, ${item.apy}, ${item.timestamp})`
        ).join(', ');
        const queryText = `INSERT INTO alerts_apy_stats (strategy_id, tvl, apy, timestamp) VALUES ${values}`;
        await pgClient.query(queryText);
    } catch (error) {
        console.error('Error in transaction:', error);
    }

}

const saveTvlStatsToPG = async (pgClient,  data) => {
    try {
        const values = data.map(item =>
            `('${item.strategy_id}', ${item.tvl}, ${item.timestamp})`
        ).join(', ');
        const queryText = `INSERT INTO alerts_tvl_stats (strategy_id, tvl, timestamp) VALUES ${values}`;
        await pgClient.query(queryText);
    } catch (error) {
        console.error('Error in transaction:', error);
    }

}

const saveToPG = async (pgClient, data) => {
    try {
        const values = data.map(item =>
            `('${item.strategy_addr}', '${item.vault_addr}', '${item.network}', ${item.apy}, '${item.created_at}')`
        ).join(', ');
        const queryText = `INSERT INTO strategies_apy (strategy_addr, vault_addr, network, apy, created_at ) VALUES ${values}`;
        await pgClient.query(queryText);
    } catch (error) {
        console.error('Error in transaction:', error);
    }

}


const loadAPY = async (provider, pgClient) => {
    const prices = await getPrice(['balancer',
        'aura-finance',
        'aura-bal',
        'gmd-protocol',
        'gains-network',
        'weth',
        'gmx',
        'ethereum',
        'rocket-pool-eth',
        'curve-dao-token',
        'convex-fxs',
        'convex-crv',
        'convex-finance',
        'frax-share',
    ]);
    let result = false;
    if (prices && strategies?.length) {
        const data = await Promise.all(strategies.map(strategy => getApy(strategy, provider, prices)));
        const filteredData = data.filter(elem => elem != undefined);
        if (filteredData.length > 0) {
            result = await saveApyStatsToPG(pgClient, filteredData);

            //  console.log(filteredData);
           // await saveToPG(pgClient, filteredData);
        }
    }
    else {
        console.log("price error");
        return false;
    }
    return result;
}


const checkApyTvl = async (pgClient, alertsTS) => {
    const oneDay = 24 * 60 * 60;
    const oneWeek = 7 * oneDay;
    const now = Math.floor(Date.now() / 1000);
    const dateDayAgo = now - oneDay;
    const date7DayAgo = now - oneWeek;
    const lastData = await getLastData(pgClient, dateDayAgo, date7DayAgo);
    await Promise.all(lastData.map(async (data) => {
        Object.entries(data).forEach(([key, valueArray]) => {
            valueArray.map(async row => {
                return await checkPercent(pgClient, row, key, alertsTS)
            })
        });
    }));
}

const sendAlert = async (pgClient, strategy_id, threshold, key, currValue, avgValue, alertsTS, period, call) => {
    const messageApy = `Стратегия ${strategy_id}: превышен порог ${threshold}% отклонения текущего значения ${key.toUpperCase()} от среднего ${key.toUpperCase()} за ${period}. Текущее значение: ${currValue.toFixed(2)}% (Среднее значение ${avgValue.toFixed(2)}%)`;
    const messageTvl = `Среднее значение total staked ${strategy_id} за ${period} снизилось более, чем на ${threshold}%. Текущий totalSupply LP: ${currValue.toFixed(2)}. Среднее значение: ${avgValue.toFixed(2)}`;
    const message = key.toUpperCase()==="TVL"? messageTvl : messageApy;
    const lastAlertTS = alertsTS[strategy_id][key] ? alertsTS[strategy_id][key] : 0;
    const now = Math.floor(Date.now() / 1000);
    const diff = now - lastAlertTS;
    const timeDiff = (3600 * 12);
    if (diff > timeDiff) {
        const newRow = lastAlertTS === 0 ? true : false;
        await writeAlertTs(pgClient, strategy_id, key, now, newRow);
        console.log(message);
        await sendMessageToDiscord(message);
        if (call) {
           await sendMessageToMessageBird(message);
        }
    }
}


const checkPercent = async (pgClient, strategy, key, alertsTS) => {
    const { strategy_id, last_value, avg_value_daily, avg_value_7_days } = strategy;

    const deviationPercentDaily = calculateDeviationPercent(last_value, avg_value_daily);
    const deviationPercent7Days = calculateDeviationPercent(last_value, avg_value_7_days);
    if (deviationPercentDaily > threshold1 && deviationPercentDaily < threshold2) {
        await sendAlert(pgClient, strategy_id, threshold1, key, last_value, avg_value_daily, alertsTS, 'день', false);
    }
    else 
    if (deviationPercent7Days > threshold1 && deviationPercent7Days < threshold2) {
        await sendAlert(pgClient, strategy_id, threshold1, key, last_value, avg_value_7_days, alertsTS, 'неделю', false);
    }
    if (deviationPercentDaily > threshold2) {
        await sendAlert(strategy_id, threshold2, key, last_value, avg_value_daily, alertsTS, 'день', true);
    }
    else
    if (deviationPercent7Days > threshold2) {
        await sendAlert(strategy_id, threshold2, key, last_value, avg_value_7_days, alertsTS, 'неделю', true);
    }
}


const getTvl = async (strategy, provider) => {
    const { strategy_id, contractAddress, abi, method, params, chain } = strategy;
    const stratProvider = provider[chain];
    const contract = new ethers.Contract(contractAddress, abi, stratProvider);
    let result;
    if (params && params.length > 0) {
        result = await contract[method](...params);
    } else {
        result = await contract[method]();
    }
    const tvl = ethers.formatEther(result);
    return { strategy_id, tvl, timestamp: Math.floor(Date.now() / 1000) };
}

const loadTVL = async (provider, pgClient) => {
    let result = false;
    const data = await Promise.all(strategiesTVL.map(strategy => getTvl(strategy, provider)));
    const filteredData = data.filter(elem => elem != undefined);
    if (filteredData.length > 0) {
        result = await saveTvlStatsToPG(pgClient, filteredData);
    }
    return result;
}


export const apyLoadCheck = async (pgClient) => {
    try {
        const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
        const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
        const provider = {
            1: ethProvider,
            42161: arbProvider,
        };
        const resultLoad = await loadAPY(provider, pgClient);
        const resultLoadTvl = await loadTVL(provider, pgClient);
        const alertsTS = await getAlertsTS(pgClient);
        const resultCheck = await checkApyTvl(pgClient, alertsTS);
        return resultLoad;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

