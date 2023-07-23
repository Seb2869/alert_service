import fetch from "node-fetch";

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