import { apyLoadCheck } from "./monitoringApyTvl.js";
import { poolCheck } from "./monitoringPools.js";
import { eventCheck } from "./monitoringVaults.js";
import { getPgPool } from "./utils/postgres.js";
import { piCheck } from "./monitoringPI.js";

const execute = async (fn, params, interval) => {
    try {
        const result = await fn(...params);
        if (!result) {
            throw new Error(`Data load failed`);
        }
    } catch (error) {
       // console.error(error);
    } finally {
        setTimeout(() => execute(fn, params, interval), interval);
    }
}

const interval1Hour = 3600000;
const interval10Min = 600000;
const interval5Min = 300000;
const interval2Min = 120000;

setTimeout(() => {}, 30000); 

const pgClient = getPgPool();


(async () => {

    await execute(eventCheck, [pgClient], interval2Min);
    await execute(poolCheck, [pgClient], interval10Min);
    await execute(apyLoadCheck, [pgClient], interval5Min);
    await execute(piCheck, [pgClient], interval10Min);


})();

