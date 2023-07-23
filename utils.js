import path, { dirname } from "path";
import { fileURLToPath } from "url";
import * as dotenv from "dotenv";

const envPath = ".env";

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

export const getLpBalancerPrice = async (pool) => {
  const graph = `balancer-labs/balancer-v2`;
  const qs = `{\n pools(where: {address: "${pool}"}) \n {\n address \n  totalLiquidity \n  totalShares } \n}`;
  const table = `pools`;
  const data = await getDataFromSG(graph, qs, table);
  const {totalLiquidity,totalShares} = data[0];
  const price = totalLiquidity / totalShares;
  return price;
}


    