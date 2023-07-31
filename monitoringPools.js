import { ethers } from "ethers";
import { ETH_NODE, ARB_NODE, getAlertsTS, writeAlertTs } from "./utils/utils.js";
import { pools } from "./Strategy/pools.js";
import { getPriceForDefiLama } from "./utils/price.js";


const checkBalance = async (pool, provider, alertsTS) => {
    try {
        const { poolId, chain, contractAddress, method, threshold, params, needPrice } = pool;
        const stratProvider = provider[chain];
        if (needPrice) {
            const [poolId, tokens] = params;
            const price0 = await getPriceForDefiLama(tokens[0]);
            const price1 = await getPriceForDefiLama(tokens[1]);
            const price = [price0, price1];
            params.push(price);
        }
        const resultArr = await method(stratProvider, contractAddress, threshold, ...params);
        const [result,] = resultArr;
        if (result) {
            const now = Math.floor(Date.now() / 1000);
            const lastAlertTS = alertsTS[poolId] ? alertsTS[poolId] : 0;
            const diff = now - lastAlertTS;
            if (diff > 3600) {
                const newRow = lastAlertTS === 0 ? true : false;
                await writeAlertTs(poolId, now, newRow);
                // отправка уведомления
            }
        }
        return true
    }
    catch {
        return false
    }
}

const loadAllPools = async (provider) => {
    const alertsTS = await getAlertsTS();
    let result = false;
    if (pools?.length) {
        const data = await Promise.all(pools.map(pool => checkBalance(pool, provider, alertsTS)));
        result = data.reduce((acc, value) => acc && value, true);
    }
    else {
        console.log("price error");
        return false;
    }
    return result;
}


export const poolCheck = async () => {
    const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
    const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
    const provider = {
        1: ethProvider,
        42161: arbProvider,
    };
    const resultCheck = await loadAllPools(provider);
    return resultCheck;
}

