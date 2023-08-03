import { apyLoadCheck } from "./monitoringApyTvl.js";
import { poolCheck } from "./monitoringPools.js";
import { eventCheck } from "./monitoringVaults.js";

const execute = async (fn, interval) => {
    try {
        const result = await fn();
        if (!result) {
            throw new Error(`Data load failed`);
        }
    } catch (error) {
       // console.error(error);
    } finally {
        setTimeout(() => execute(fn, interval), interval);
    }
}

const interval1Hour = 3600000;
const interval10Min = 600000;
const interval2Min = 120000;

(async () => {
    await execute(eventCheck, interval2Min);
    await execute(poolCheck, interval10Min);
    await execute(apyLoadCheck, interval1Hour);

})();

