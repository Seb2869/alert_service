import { queryDataFromPG } from "./postgres.js";

const buildQuery = (value, table, date1, date2) => {
    const query = `SELECT
                        strategy_id,
                        (SELECT ${value} FROM alerts_${table} AS as2 WHERE as2.strategy_id = alerts_${table}.strategy_id ORDER BY "timestamp" DESC LIMIT 1) AS last_value,
                        AVG(CASE WHEN timestamp >= ${date1} THEN ${value} END) AS avg_value_daily,
                        AVG(CASE WHEN timestamp >= ${date2} THEN ${value} END) AS avg_value_7_days
                        FROM alerts_${table}
                        GROUP BY strategy_id;`;
    return query
}


const executeQuery = async (pgClient, date1, date2, value, table) => {
    const query = buildQuery(value, table, date1, date2);
    const dataset = await queryDataFromPG(query, pgClient);
    const result = {};
    result[value] = dataset;
    return result;
};

export const getLastData = async (pgClient, date1, date2) => {
    let result = [];
    try {
        const data = [
            ['apy', 'apy_stats'],
            ['tvl', 'tvl_stats'],
        ];
        result = await Promise.all(data.map((row) => {
            return executeQuery(pgClient, date1, date2, ...row)
        }))

    } catch (err) {
        console.error(err.message);
        throw err;
    }
    finally {
        return result;
    }

}

export const getAlertsTS = async (pgClient) => {
    const alertsDictionary = {};

    try {
        const query = `SELECT strategy_id, atype, alert_ts FROM alerts_ts`;
        const rows = await queryDataFromPG(query, pgClient);
        
        for (const row of rows) {
            if (!alertsDictionary[row.strategy_id]) {
                alertsDictionary[row.strategy_id] = {};
            }
            
            alertsDictionary[row.strategy_id][row.atype] = row.alert_ts;
        }
    } catch (err) {
        console.error('Error fetching alerts:', err.message);
        throw err;
    } finally {
        return alertsDictionary;
    }
};


export const getLastBlock = async (pgClient) => {
    
    const lastBlockDictionary = {};
    try {
        const query = `SELECT vault, last_block FROM alerts_last_blocks`;
        const rows = await queryDataFromPG(query, pgClient);
        for (const row of rows) {
            lastBlockDictionary[row.vault] = row.last_block;
        }
    } catch (err) {
        console.error('Error fetching alerts:', err.message);
       //  throw err;
    }
    finally {
        return lastBlockDictionary;
    }
};


export const writeLastBlock = async (pgClient, vault, lastBlock, newRow) => {
    try {
        const queryText = newRow
            ?
            `INSERT INTO alerts_last_blocks (last_block, vault) VALUES (${lastBlock}, '${vault}')`
            :
            `UPDATE alerts_last_blocks SET last_block = ${lastBlock} WHERE vault = '${vault}'`
            ;
        await pgClient.query(queryText);
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return false;
    }
};

export const writeAlertTs = async (pgClient, strategy_id, type, newTS, newRow) => {
    try {
        const queryText = newRow
            ?
            `INSERT INTO alerts_ts (alert_ts, atype, strategy_id) VALUES (${newTS}, '${type}', '${strategy_id}')`
            :
            `UPDATE alerts_ts SET alert_ts = ${newTS} WHERE strategy_id = '${strategy_id}' and atype = '${type}'`
            ;
        await pgClient.query(queryText);
    
    } catch (error) {
        console.error('Ошибка при выполнении запроса:', error);
        return false;
    }
};




/* export const getThreshold = async () => {
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
        return thresholdDictionary;
    }
}; */






