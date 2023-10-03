import { ethers } from "ethers";
import { ETH_NODE, ARB_NODE, POLYGON_NODE } from "./utils/utils.js";
import { getAlertsTS, writeAlertTs } from "./utils/database.js";
import { pools } from "./strategy_list/pools.js";
import { getPriceForDefiLama } from "./utils/price.js";
import { sendMessageToDiscord } from "./utils/alert.js";

const checkBalance = async (pool, provider, pgClient, alertsTS) => {
    try {
        const { poolId, chain, contractAddress, method, threshold, params, needPrice, message, decimals } = pool;
        const stratProvider = provider[chain];
        if (needPrice) {
            const tokens = params[0];
            const price = [];
            for (let i = 0; i < tokens.length; i++) {
                const tokenAddress = tokens[i].toLowerCase() === '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'
                    ? '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'
                    : tokens[i]
                const priceToken = await getPriceForDefiLama(tokenAddress);
                price.push(priceToken)
            }
            params.push(price);
        }
        const resultArr = await method(stratProvider, contractAddress, threshold, decimals, ...params);
        const [result, percent] = resultArr;
        let replacedString = message.replace("{threshold}", threshold);

        if (replacedString.includes("{percent}")) {
            replacedString = replacedString.replace("{percent}", percent[0].toFixed(2));
        }
        if (result) {
            const now = Math.floor(Date.now() / 1000);
            const lastAlertTS = alertsTS[poolId]? alertsTS[poolId]['pool'] : 0;
            const diff = now - lastAlertTS;
            if (diff > (3600 * 24)) {
                const newRow = lastAlertTS === 0 ? true : false;
                await writeAlertTs(pgClient, poolId, 'pool', now, newRow);
                let replacedString = message.replace("{threshold}", threshold);
                if (replacedString.includes("{percent}")) {
                    replacedString = replacedString.replace("{percent}", percent[0].toFixed(2));
                }
                await sendMessageToDiscord(replacedString);
                // console.log(replacedString);
            }
        }
        return true
    }
    catch (error) {
        console.log(error);
        return false
    }
}

const loadAllPools = async (provider, pgClient) => {
    try {
        const alertsTS = await getAlertsTS(pgClient);
        let result = false;
        const filterPools = pools.filter(pool => pool.status);
        if (filterPools?.length) {
            const data = await Promise.all(filterPools.map(pool => checkBalance(pool, provider,pgClient, alertsTS)));
            result = data.reduce((acc, value) => acc && value, true);
        }
        else {
            console.log("price error");
            return false;
        }
        return result;
    }
    catch (error) {
        console.log(error)
        return false;
    }
}

export const poolCheck = async (pgClient) => {
    try {
        const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
        const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
        const plgProvider = new ethers.JsonRpcProvider(POLYGON_NODE);
        const provider = {
            1: ethProvider,
            42161: arbProvider,
            137: plgProvider,
        };
        const resultCheck = await loadAllPools(provider, pgClient);
        return resultCheck;
    }
    catch {
        return false;
    }
}

