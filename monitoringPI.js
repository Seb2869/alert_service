import { swapPrice } from "./strategy_list/priceImpact.js";
import { ethers } from "ethers";
import { ETH_NODE, ARB_NODE } from "./utils/utils.js";
import { getAlertsTS, writeAlertTs } from "./utils/database.js";
import { sendMessageToDiscord , sendPIToDiscord } from "./utils/alert.js";
import { queryDataFromPG } from "./utils/postgres.js";

const BASE_URL = "https://api.1inch.dev/swap/v5.2/";
const apiKey = "JEp4qoSseECYg575GwDDjLfHJJ4h9Ogz";

const calculatePriceImpact = (
  smallAmountPrice,
  largeAmountPrice,
  smallAmount,
  largeAmount
) => {
  if (
    smallAmountPrice &&
    smallAmountPrice > 0 &&
    largeAmountPrice &&
    largeAmountPrice > 0
  ) {
    const price0 = smallAmountPrice / parseInt(smallAmount);
    const price1 = largeAmountPrice / parseInt(largeAmount);
    // console.log(smallAmountPrice, parseInt(smallAmount),price0 )
    // console.log(largeAmountPrice, parseInt(largeAmount),price1 )
    const impact = ((price1 - price0) / price0) * 100;
    return impact;
  } else {
    return 0;
  }
};

const fetchPrice = async (fromToken, toToken, amount, chain) => {
  try {
    const response = await fetch(
      `${BASE_URL}${chain}/quote?src=${fromToken}&dst=${toToken}&amount=${amount}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const data = await response.json();
    // console.log(fromToken, toToken,data.toAmount, data );
    return parseFloat(data.toAmount);
  } catch (error) {
    console.log(error);
    return 0;
  }
};

const checkImpact = async (impact, name, pgClient) => {
  try {
    const query = `SELECT AVG(price_impact) AS avg_price_impact
  FROM public.alerts_price_impact
  WHERE swap = '${name}' AND "timestamp" >= EXTRACT(EPOCH FROM NOW() - INTERVAL '1 week')`;
    const insertQuery = `INSERT INTO public.alerts_price_impact ("timestamp", swap, price_impact) VALUES (EXTRACT(EPOCH FROM NOW()), 
  '${name}', ${impact});`;
    const row = await queryDataFromPG(query, pgClient);
    let avg_price_impact = impact;
    if (row && row.length) {
      if (row[0].avg_price_impact && row[0].avg_price_impact != 0) {
        avg_price_impact = row[0].avg_price_impact;
      }
    }
    await pgClient.query(insertQuery);
    // console.log(impact, avg_price_impact, impact / avg_price_impact);
    /* if (impact>4 && impact / avg_price_impact > 3) return true;
    else */ 
      return false;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const checkPI = async (token, pgClient, provider, alertsTS) => {
  try {
    const {
      tokenAName,
      fromToken,
      tokenBName,
      toToken,
      chain,
      amount1,
      amount0,
    } = token;

    const smallAmountPrice = await fetchPrice(
      fromToken,
      toToken,
      amount0,
      chain
    );
    
    await sleep(2000);
    const largeAmountPrice = await fetchPrice(
      fromToken,
      toToken,
      amount1,
      chain
    );
    // console.log(tokenAName, tokenBName, smallAmountPrice,largeAmountPrice );
    const impact = calculatePriceImpact(
      smallAmountPrice,
      largeAmountPrice,
      amount0,
      amount1
    );
    const alert = await checkImpact(impact, tokenAName + tokenBName, pgClient); // проверить и сохранить

    if (alert) {
     await sendMessageToDiscord(
       //console.log(
        `Warning: Price Impact for swapping ${tokenAName} to ${tokenBName} is more than x2 of average. Actual impact: ${impact.toFixed(4)}%`
      );
      return false; // Indicate that this token pair has high price impact
    } else {
      const strategy_id = tokenAName + tokenBName;
      const lastAlertTS = alertsTS[strategy_id]
        ? alertsTS[strategy_id]["pi"]
          ? alertsTS[strategy_id]["pi"]
          : 0
        : 0;
      const now = Math.floor(Date.now() / 1000);
      const diff = now - lastAlertTS;
      const timeDiff = 3600 * 4;
      if (diff > timeDiff) {
        const newRow = lastAlertTS === 0 ? true : false;
        await writeAlertTs(pgClient, strategy_id, "pi", now, newRow);
        const message = `Price Impact for swapping ${tokenAName} to ${tokenBName} is ${impact.toFixed(
          4
        )}%`;
        await sendPIToDiscord(message);
        // console.log(message);
      }
      return true; // Indicate that this token pair has acceptable price impact
    }
  } catch (error) {
    console.log(error);
  }
};

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const loadAllPI = async (provider, pgClient, alertsTS) => {
  if (swapPrice?.length) {
    for (const item of swapPrice) {
      await checkPI(item, pgClient, provider, alertsTS);
      await sleep(2000);
    }
  } else {
    return false;
  }
};

export const piCheck = async (pgClient) => {
  try {
    const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
    const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
    const provider = {
      1: ethProvider,
      42161: arbProvider,
    };
    const alertsTS = await getAlertsTS(pgClient);
    const resultCheck = await loadAllPI(provider, pgClient, alertsTS);
    return resultCheck;
  } catch (error) {
    console.log(error);
    return false;
  }
};
