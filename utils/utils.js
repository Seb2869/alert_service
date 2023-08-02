import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";
import { openDatabase, runQuery, closeDatabase, getRows } from "./sqlite.js";


const envPath = "../.env";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: path.join(__dirname, envPath),
});

export const ETH_NODE = process.env.ETHEREUM_NODE;
export const ARB_NODE = process.env.ARBITRUM_NODE;
export const dbName = process.env.DB_NAME;
export const messagebirdUrl = process.env.MESSAGEBIRD_URL;
export const discordUrl = process.env.DISCORD_URL;

export const idMaksim = process.env.MAKSIM_ID;
export const idMatvey = process.env.MATVEY_ID;

export const threshold1 = process.env.THRESHOLD1;
export const threshold2 = process.env.THRESHOLD2;


export const getDataFromSG = async (graph, qs, table) => {

  const headers = {
    'authority': 'api.thegraph.com',
    'content-type': 'application/json',
    'accept': '*/*',
    'origin': 'https://thegraph.com',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://thegraph.com/',
  };
  try {
    const response = await fetch('https://api.thegraph.com/subgraphs/name/' + graph, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify({ query: qs })
    });
    const resp = await response.json();
    const answer = resp["data"][table];
    return answer;
  } catch (error) {
    console.error('Error:', error);
    return false;
  }
}

export const fetchData = async (url) => {
  const response = await fetch(url);
  return await response.json();
}


export const getConvexPoolList = async () => {
  const poolsRegistry = ['factory', 'main', 'crypto', 'factory-crypto', 'factory-crvusd', 'factory-tricrypto'];
  const poolDataPromises = poolsRegistry.map((registry) =>
    fetchData(`https://api.curve.fi/api/getPools/ethereum/${registry}`)
  );

  const poolDataResponses = await Promise.all(poolDataPromises);
  const poolsList = poolDataResponses.map(({ data }) => data.poolData).flat();
  return poolsList;
}

export const getConvexGauges = async () => {
  const gaugesUrl = 'https://api.curve.fi/api/getAllGauges';
  const { data: gauges } = await fetchData(gaugesUrl);
  const mappedGauges = Object.entries(gauges).reduce(
    (acc, [name, gauge]) => ({
      ...acc,
      ...([
        'fantom',
        'optimism',
        'xdai',
        'polygon',
        'avalanche',
        'arbitrum',
      ].some((chain) => gauge.name.includes(chain))
        ? {}
        : { [gauge.swap_token.toLowerCase()]: { ...gauge } }),
    }),
    {}
  );
  return mappedGauges;
};


export const getCurveApy = async () => {

  const headers = {
    'authority': 'www.convexfinance.com/api/',
    'content-type': 'application/json',
    'accept': '*/*',
    'origin': 'https://www.convexfinance.com/',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    'referer': 'https://www.convexfinance.com/',
  };

  const response = await fetch('https://www.convexfinance.com/api/curve-apys', {
    method: 'GET',
    headers: headers,
  });
  const responseText = await response.text();
  const result = JSON.parse(responseText);
  const { apys: curveApys } = result;
  return curveApys
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
    result = await Promise.all(data.map((row)=> {
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

export const calculateDeviationPercent = (value1, value2) => {
  return ((value2-value1) / value1) * 100;
}

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