import { apyLoadCheck } from "./monitoringApyTvl.js";
import { poolCheck } from "./monitoringPools.js";
import { eventCheck } from "./monitoringVaults.js";
import { openDatabase, closeDatabase } from "./utils/sqlite.js";
import { dbName } from "./utils/utils.js";

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

const db = openDatabase(dbName);

db.serialize(function() {

  db.run(`CREATE TABLE IF NOT EXISTS alerts (
    strategy_id TEXT,
    alert_ts INTEGER
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS "apy_stats" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strategy_id TEXT,
    tvl NUMERIC,
    apy NUMERIC,
    "timestamp" INTEGER
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS "last_blocks" (
    "vault" TEXT,
    last_block INTEGER
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS thresholds (
    strategy_id TEXT,
    threshold INTEGER
  );`);

  db.run(`CREATE TABLE IF NOT EXISTS "tvl_stats" (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    strategy_id TEXT,
    tvl NUMERIC,
    "timestamp" INTEGER
  );`);

});

closeDatabase(db);
setTimeout(() => {}, 30000); 

(async () => {

    await execute(eventCheck, interval2Min);
    await execute(poolCheck, interval10Min);
    await execute(apyLoadCheck, interval1Hour);

})();

