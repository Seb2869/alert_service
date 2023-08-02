import { ethers } from "ethers";
import { getSupplyTVL } from "../apyTvlMethods.js";

export const getGmxApy = async (provider, GMX_GMX, prices) => {
    const gmxContactABI = [
        `function tokensPerInterval() external view returns (uint256)`,
    ];
    const gmxRewardContract = new ethers.Contract(GMX_GMX, gmxContactABI, provider);
    const tokensPerIntervalRaw = await gmxRewardContract.tokensPerInterval();
    const tokensPerInterval = parseFloat(ethers.formatEther(tokensPerIntervalRaw));
    const priceWEth = prices['weth'] ? prices['weth']['usd'] : 0;
    const priceGmx = prices['gmx'] ? prices['gmx']['usd'] : 0;
    const tvlUsd = await getSupplyTVL(provider, GMX_GMX, priceGmx);
    const apy = tokensPerInterval * 3600 * 24 * 365 * priceWEth / tvlUsd * 100;
    return [apy, tvlUsd]
}