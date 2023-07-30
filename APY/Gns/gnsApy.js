import { ethers } from "ethers";
import { getBalanceTVL } from "../apyTvlMethods.js";


const aprToApy = (apr, compoundFrequency = 365) => {
    return (
        ((1 + (apr * 0.01) / compoundFrequency) ** compoundFrequency - 1) * 100
    );
}

/* export const getGnsApy = async (provider, GAINS_GNS, userAddress, GNS_TVL, prices) => {
    const gnstakingContactABI = [
        `function users(address) external view returns 
        (uint256 stakedTokens, uint256 debtDai, uint256 stakedNftsCount, 
        uint256 totalBoostTokens, uint256 harvestedRewardsDai)`,
    ];
    const gnstakingContact = new ethers.Contract(GAINS_GNS, gnstakingContactABI, provider);

    const info = await gnstakingContact.users(userAddress);
    const { harvestedRewardsDai } = info;
    const tvl = await getBalanceTVL(provider, GNS_TVL, GAINS_GNS);
    const apy = 0;
    return [apy, tvl]

    // APY_GNS_GAINS = (harvestedRewardsDai - previousWeekHarvestedRewardsDai) / TVL#29_GAINS_GNS_USD * 52 *100
    // APY_GNS_GAINS = 
    // (harvestedRewardsDai - previousWeekHarvestedRewardsDai) /
    // TVL#29_GAINS_GNS_USD * 52 *100
}
 */
/*
users[0x4da9fb66734f9d7936232bcf64dacc24406595c1]
функцию и адрес из колонки functions,
у нас на этом адресе есть тестовая позиция и я предлагаю по ней считать доходность.
 напрямую через контракт не нашел как считать, так понял что там нет единого ревард рейта,
 т.к. они при наличии определенной нфт увеличивают доходность индивидуально */

// 3%

export const getGnsApy = async (provider, STAKING, GNS_TVL, prices) => {
    const gnsPrice = prices['gains-network'] ? prices['gains-network']['usd'] : 0;
    const tvlContract = new ethers.Contract(
        GNS_TVL,
        [`function balanceOf(address) external view returns (uint256)`],
        provider);
    const balance = ethers.formatEther(await tvlContract.balanceOf(STAKING));
    const tvl = +balance * gnsPrice;
    const response = await fetch(`https://backend-arbitrum.gains.trade/apr`);
    const responseText = await response.text();
    const aprData = JSON.parse(responseText);
    const apr =  aprData.sssBaseApr;
    const apy = aprToApy(apr);
    return [apy, tvl]
}



