import { dbName } from "./utils.js";
import { openDatabase, runQuery, closeDatabase, getRows } from "./sqlite.js";

const buildQuery = (value, table, date1, date2) => {
    const query = `SELECT
                        strategy_id,
                        (SELECT ${value} FROM ${table} AS as2 WHERE as2.strategy_id = ${table}.strategy_id ORDER BY "timestamp" DESC LIMIT 1) AS last_value,
                        AVG(CASE WHEN timestamp >= ${date1} THEN ${value} END) AS avg_value_daily,
                        AVG(CASE WHEN timestamp >= ${date2} THEN ${value} END) AS avg_value_7_days
                        FROM ${table}
                        GROUP BY strategy_id;`;
    return query
}

const executeQuery = async (db, date1, date2, value, table) => {
    const query = buildQuery(value, table, date1, date2);
    const rows = await getRows(db, query);
    const result = {};
    result[value] = rows;
    return result;
};

export const getLastData = async (date1, date2) => {
    let result = [];
    const db = openDatabase(dbName);
    try {
        const data = [
            ['apy', 'apy_stats'],
            ['tvl', 'tvl_stats'],
        ];
        result = await Promise.all(data.map((row) => {
            return executeQuery(db, date1, date2, ...row)
        }))

    } catch (err) {
        console.error(err.message);
        throw err;
    }
    finally {
        closeDatabase(db);
        return result;
    }

}

export const getAlertsTS = async () => {
    const db = openDatabase(dbName);
    const alertsDictionary = {};
    try {
        const query = `SELECT strategy_id, alert_ts FROM alerts`;
        const rows = await getRows(db, query);
        for (const row of rows) {
            alertsDictionary[row.strategy_id] = row.alert_ts;
        }
    } catch (err) {
        console.error('Error fetching alerts:', err.message);
        throw err;
    }
    finally {
        closeDatabase(db);
        return alertsDictionary;
    }
};


export const getLastBlock = async () => {
    const db = openDatabase(dbName);
    const lastBlockDictionary = {};
    try {
        const query = `SELECT vault, last_block FROM last_blocks`;
        const rows = await getRows(db, query);
        for (const row of rows) {
            lastBlockDictionary[row.vault] = row.last_block;
        }
    } catch (err) {
        // console.error('Error fetching alerts:', err.message);
        throw err;
    }
    finally {
        closeDatabase(db);
        return lastBlockDictionary;
    }
};

export const writeLastBlock = async (vault, lastBlock, newRow) => {
    const db = openDatabase(dbName);
    try {
        const query = newRow
            ?
            `INSERT INTO last_blocks (last_block, vault) VALUES (?, ?)`
            :
            `UPDATE last_blocks SET last_block = ? WHERE vault = ?`
            ;
        await runQuery(
            db,
            query,
            [lastBlock, vault]
        );
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return false;
    }
    finally {
        closeDatabase(db);
    }
};


export const getThreshold = async () => {
    const db = openDatabase(dbName);
    const thresholdDictionary = {};
    try {
        const query = `SELECT strategy_id, threshold FROM thresholds`;
        const rows = await getRows(db, query);
        for (const row of rows) {
            thresholdDictionary[row.strategy_id] = row.threshold;
        }
    } catch (err) {
        console.error('Error fetching alerts:', err.message);
        throw err;
    }
    finally {
        closeDatabase(db);
        return thresholdDictionary;
    }
};


export const writeAlertTs = async (strategy_id, newTS, newRow) => {
    const db = openDatabase(dbName);
    try {
        const query = newRow
            ?
            `INSERT INTO alerts (alert_ts, strategy_id) VALUES (?, ?)`
            :
            `UPDATE alerts SET alert_ts = ? WHERE strategy_id = ?`
            ;
        await runQuery(
            db,
            query,
            [newTS, strategy_id]
        );
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return false;
    }
    finally {
        closeDatabase(db);
    }
};





