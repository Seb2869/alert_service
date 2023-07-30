import fetch from "node-fetch";
import { getDataFromSG } from "./utils.js";

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple';

export const getPrice = async (tokens) => {
    try {
        const tokenId = tokens.join(',');
        const response = await fetch(`${COINGECKO_API}/price?ids=${tokenId}&vs_currencies=usd`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if ("status" in data) {
            const status = data.status;
            if ("error_code" in status) {
                throw new Error('Network response was not ok.');
            }
        }
        
        return data;
    }
    catch {
        return null;
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

export const getPriceForContract = async (address, chain = 'ethereum') => {
    try {
        const response = await fetch(`${COINGECKO_API}/token_price/${chain}?contract_addresses=${address}&vs_currencies=usd`);
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if ("status" in data) {
            const status = data.status;
            if ("error_code" in status) {
                throw new Error('Network response was not ok.');
            }
        }
        const key = address.toLowerCase();
        const price = data[key]['usd']?? null;
        return price;
    }
    catch (error) {
        console.log(error);
        return null;
    }
  
}

