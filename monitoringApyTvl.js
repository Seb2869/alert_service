import { ethers } from "ethers";
import { ETH_NODE, ARB_NODE, dbName } from "./utils/utils.js";
import { strategies } from "./Strategy/apyStrategy.js";
import { strategiesTVL } from "./Strategy/tvlStrategy.js";
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
    console.log(5);
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
        console.log(filteredData);
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

const checkAPY = async () => {

}

const checkTVL = async () => {

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
    console.log(filteredData);
    if (filteredData.length > 0) {
        result = await saveToDB(filteredData, insertTvl);
    }
    return result;
}


export const newStep = async () => {
    const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
    const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
    const provider = {
        1: ethProvider,
        42161: arbProvider,
    };
    const resultLoad = await loadAPY(provider);
    const resultCheck = await checkAPY();
    const resultLoadTvl = await loadTVL(provider);
    const resultCheckTvl = await checkTVL();
    return resultLoad;
}

