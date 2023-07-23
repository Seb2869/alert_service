import { ethers } from "ethers";
import { ETH_NODE, ARB_NODE, dbName } from "./utils.js";
import { strategies } from "./strategy.js";
import { getPrice } from "./price.js";
import { openDatabase, runQuery, getRows, closeDatabase } from './sqlite.js';


const getApy = async (strategy, provider, prices) => {
    const { strategy_id, method, params, chain } = strategy;
    const strat_provider = provider[chain];
    const [apy, tvl] = await method(strat_provider, ...params, prices);
    return {
        strategy_id,
        apy,
        tvl,
        timestamp: Math.floor(Date.now() / 1000)
    }
}

const saveToDB = async (data) => {
    const db = openDatabase(dbName);
    try {
        for (const record of data) {
            const { strategy_id, tvl, apy, timestamp } = record;
            const insertResult = await runQuery(
                db,
                `INSERT INTO stats (strategy_id, tvl, apy, timestamp) VALUES (?, ?, ?, ?)`,
                [strategy_id, tvl, apy, timestamp]
            );
            console.log(insertResult);
        }
    }
    catch (err) {
        console.error('Error:', err.message);
    }
    finally {
        closeDatabase(db);
    }
}

const loadAPY = async () => {
    console.log(5);
    const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
    const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
    const provider = {
        1: ethProvider,
        42161: arbProvider, 
    }
    const prices = await getPrice(['balancer', 
    'aura-finance', 
    'aura-bal',
    'gmd-protocol', 
    'weth',
    'gmx',
    'rocket-pool-eth']);

    if (prices) {
        const data = await Promise.all(strategies.map(strategy => getApy(strategy, provider, prices)));
        const filteredData = data.filter(elem => elem != undefined);
        console.log(filteredData);
       // const result = await saveToDB(filteredData);
    }
    else {
        console.log("price error");
        return false;
    }
    //const result = await loadToPg(data);
    return true;
}

const checkAPY = async () => {

}


export const newStep = async () => {

    const resultLoad = await loadAPY();
    const resultCheck = await checkAPY();

}

