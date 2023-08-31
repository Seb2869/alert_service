import { swapPrice } from './strategy_list/priceImpact.js'
import { ethers } from 'ethers';
import { ETH_NODE, ARB_NODE } from "./utils/utils.js";

const BASE_URL = 'https://api.1inch.dev/swap/v5.2/'
const apiKey = 'JEp4qoSseECYg575GwDDjLfHJJ4h9Ogz'

const calculatePriceImpact = (smallAmountPrice, largeAmountPrice, smallAmount, largeAmount) => {
  const price0 = smallAmountPrice/smallAmount; 
  const price1 = largeAmountPrice/largeAmount;
  const impact = ((price1 - price0) / price0) * 100;
  return impact;
};

const fetchPrice = async (fromToken, toToken, amount, chain) => {
  const response = await fetch(
    `${BASE_URL}${chain}/quote?src=${fromToken}&dst=${toToken}&amount=${amount}`,
    {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${apiKey}`
      }
    }
  );
  const data = await response.json();
  return parseFloat(data.toAmount);
  
};


const checkPI = async (token, provider) => {
  const { tokenAName, fromToken, tokenBName, toToken, chain, amount1, amount0 } = token

  const smallAmountPrice = await fetchPrice(fromToken, toToken, amount0, chain);
  await sleep(2000);
  const largeAmountPrice = await fetchPrice(fromToken, toToken, amount1, chain);
  const impact = calculatePriceImpact(smallAmountPrice, largeAmountPrice, amount0, amount1);
  
  if (impact > 3) {
    console.log(`Warning: Price Impact for swapping ${tokenAName} to ${tokenBName} is more than 3%. Actual impact: ${impact.toFixed(4)}%`);
    return false;  // Indicate that this token pair has high price impact
  } else {
    console.log(`Price Impact for swapping ${tokenAName} to ${tokenBName} is ${impact.toFixed(4)}%`);
    return true;  // Indicate that this token pair has acceptable price impact
  }
}


async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


const loadAllPI = async (provider) => {

  if (swapPrice?.length) {
    for (const item of swapPrice) {
      await checkPI(item, provider);
      await sleep(2000);
    }
    
    
  } else {
    return false
  }
}

export const piCheck = async () => {
  try {
    const ethProvider = new ethers.JsonRpcProvider(ETH_NODE)
    const arbProvider = new ethers.JsonRpcProvider(ARB_NODE)
    const provider = {
      1: ethProvider,
      42161: arbProvider
    }
    const resultCheck = await loadAllPI(provider)
    return resultCheck
  } catch (error) {
    console.log(error);
    return false
  }
}
