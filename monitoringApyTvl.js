import { ethers } from "ethers";
import {
    ETH_NODE,
    ARB_NODE,
    dbName,
    threshold1,
    threshold2,
    getLastData,
    calculateDeviationPercent,
    writeAlertTs,
    getAlertsTS,
} from "./utils/utils.js";
import { sendMessageToDiscord, sendMessageToMessageBird } from "./utils/alert.js";
import { strategies } from "./strategy_list/apyStrategy.js";
import { strategiesTVL } from "./strategy_list/tvlStrategy.js";
import { getPrice } from "./utils/price.js";
import { openDatabase, runQuery, closeDatabase } from "./utils/sqlite.js";


const getApy = async (strategy, provider, prices) => {
    const { strategy_id, method, params, chain } = strategy;
    const stratProvider = provider[chain];
    const [apy, tvl] = await method(stratProvider, ...params, prices);
    return {
        strategy_id,
        apy,
        tvl,
        timestamp: Math.floor(Date.now() / 1000)
    }
}

const insertTvl = async (record, db) => {
    const { strategy_id, tvl, timestamp } = record;
    const insertResult = await runQuery(
        db,
        `INSERT INTO tvl_stats (strategy_id, tvl, timestamp) VALUES (?, ?, ?)`,
        [strategy_id, tvl, timestamp]
    );
    if (!('lastID' in insertResult)) {
        return false
    }
    else {
        return true
    }
}

const insertApy = async (record, db) => {
    const { strategy_id, tvl, apy, timestamp } = record;
    const insertResult = await runQuery(
        db,
        `INSERT INTO apy_stats (strategy_id, tvl, apy, timestamp) VALUES (?, ?, ?, ?)`,
        [strategy_id, tvl, apy, timestamp]
    );
    if (!('lastID' in insertResult)) {
        return false
    }
    else {
        return true
    }

}

const saveToDB = async (data, fn) => {
    const db = openDatabase(dbName);
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
        closeDatabase(db);
        return result;
    }
}

const loadAPY = async (provider) => {
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
            result = await saveToDB(filteredData, insertApy);
        }
    }
    else {
        console.log("price error");
        return false;
    }
    return result;
}


const checkApyTvl = async (alertsTS) => {
    const oneDay = 24 * 60 * 60;
    const oneWeek = 7 * oneDay;
    const now = Math.floor(Date.now() / 1000);
    const dateDayAgo = now - oneDay;
    const date7DayAgo = now - oneWeek;
    const lastData = await getLastData(dateDayAgo, date7DayAgo);
    await Promise.all(lastData.map(async (data) => {
        Object.entries(data).forEach(([key, valueArray]) => {
            valueArray.map(async row => {
                return await checkPercent(row, key, alertsTS)
            })
        });
    }));
}


const checkPercent = async (strategy, key, alertsTS) => {
    const { strategy_id, last_value, avg_value_daily, avg_value_7_days } = strategy;
    const deviationPercentDaily = calculateDeviationPercent(last_value, avg_value_daily);
    const deviationPercent7Days = calculateDeviationPercent(last_value, avg_value_7_days);
    if (deviationPercentDaily > threshold1) {
        const message = `Стратегия ${strategy_id}: превышен порог ${threshold1}% отклонения текущего значения ${key.toUpperCase()} 
        от среднего ${key.toUpperCase()} за день (${last_value.toFixed(2)}, ${avg_value_daily.toFixed(2)}, ${deviationPercentDaily.toFixed(2)}%)`;
        const lastAlertTS = alertsTS[strategy_id] ? alertsTS[strategy_id] : 0;
        const now = Math.floor(Date.now() / 1000);
        const diff = now - lastAlertTS;
        if (diff > 3600) {

            const newRow = lastAlertTS === 0 ? true : false;
            await writeAlertTs(strategy_id, now, newRow);
            await sendMessageToDiscord(message);
        }
    }
    if (deviationPercent7Days > threshold2) {
        const message = `Стратегия ${strategy_id}: превышен порог ${threshold2}% отклонения текущего значения ${key.toUpperCase()} 
        от среднего ${key.toUpperCase()} за неделю (${last_value.toFixed(2)}, ${avg_value_7_days.toFixed(2)}, ${deviationPercentDaily.toFixed(2)}%)`;
        const lastAlertTS = alertsTS[strategy_id] ? alertsTS[strategy_id] : 0;
        const now = Math.floor(Date.now() / 1000);
        const diff = now - lastAlertTS;
        if (diff > 3600) {
            const newRow = lastAlertTS === 0 ? true : false;
            await writeAlertTs(poolId, now, newRow);
            await sendMessageToMessageBird(message);
        }
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

const loadTVL = async (provider) => {
    let result = false;
    const data = await Promise.all(strategiesTVL.map(strategy => getTvl(strategy, provider)));
    const filteredData = data.filter(elem => elem != undefined);
    if (filteredData.length > 0) {
        result = await saveToDB(filteredData, insertTvl);
    }
    return result;
}


export const apyLoadCheck = async () => {
    const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
    const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
    const provider = {
        1: ethProvider,
        42161: arbProvider,
    };
    const resultLoad = await loadAPY(provider);
    const resultLoadTvl = await loadTVL(provider);
    const alertsTS = await getAlertsTS();
    const resultCheck = await checkApyTvl(alertsTS);
    return resultLoad;
}

