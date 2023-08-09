import { ethers } from "ethers";
import { ETH_NODE, ARB_NODE } from "./utils/utils.js";
import { getAlertsTS, writeAlertTs } from "./utils/database.js";
import { pools } from "./strategy_list/pools.js";
import { getPriceForDefiLama } from "./utils/price.js";
import { sendMessageToDiscord } from "./utils/alert.js";

const checkBalance = async (pool, provider, alertsTS) => {
    try {
        const { poolId, chain, contractAddress, method, threshold, params, needPrice, message } = pool;
        const stratProvider = provider[chain];
        if (needPrice) {
            const [poolId, tokens] = params;
            const price0 = await getPriceForDefiLama(tokens[0]);
            const price1 = await getPriceForDefiLama(tokens[1]);
            const price = [price0, price1];
            params.push(price);
        }
        const resultArr = await method(stratProvider, contractAddress, threshold, ...params);
        const [result, percent] = resultArr;
        let replacedString = message.replace("{threshold}", threshold);

        if (replacedString.includes("{percent}")) {
            replacedString = replacedString.replace("{percent}", percent[0].toFixed(2));
        }
        if (result) {
            const now = Math.floor(Date.now() / 1000);
            const lastAlertTS = alertsTS[poolId] ? alertsTS[poolId] : 0;
            const diff = now - lastAlertTS;
            if (diff > (3600 * 24)) {
                const newRow = lastAlertTS === 0 ? true : false;
                await writeAlertTs(poolId, now, newRow);
                let replacedString = message.replace("{threshold}", threshold);
                if (replacedString.includes("{percent}")) {
                    replacedString = replacedString.replace("{percent}", percent[0].toFixed(2));
                }
                await sendMessageToDiscord(replacedString);
                console.log(replacedString);
            }
        }
        return true
    }
    catch {
        return false
    }
}

const loadAllPools = async (provider) => {
    try {
        const alertsTS = await getAlertsTS();
        let result = false;
        const filterPools = pools.filter(pool => pool.status);
        if (filterPools?.length) {
            const data = await Promise.all(filterPools.map(pool => checkBalance(pool, provider, alertsTS)));
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

export const poolCheck = async () => {
    try {
        const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
        const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
        const provider = {
            1: ethProvider,
            42161: arbProvider,
        };
        const resultCheck = await loadAllPools(provider);
        return resultCheck;
    }
    catch {
        return false;
    }
}

