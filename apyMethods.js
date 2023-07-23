import { ethers } from "ethers";
import {getSupplyBalTVL, 
    getTokensBalTVL, 
    getStakedTVL, 
    getBalanceTVL,
    getTotalAssetsTVL} from "./tvlMethods.js";

export const getAuraApyLp = async (
    provider,
    BAL_REWARD_CONTRACT,
    AURA_REWARD_CONTRACT,
    ASSET,
    prices
) => {

    const balContactABI = [
        `function rewardRate() external view returns (uint256)`,
        `function asset() external view returns (address)`,
    ];
    const auraContractABI = [
        `function convertCrvToCvx(uint256 _amount) external view returns (uint256 amount)`,
    ];

    const price_AURA = prices['aura-finance'] ? prices['aura-finance']['usd'] : 0;
    const price_BAL = prices['balancer'] ? prices['balancer']['usd'] : 0;


    const balRewardContract = new ethers.Contract(BAL_REWARD_CONTRACT, balContactABI, provider);
    const auraRewardRate = new ethers.Contract(AURA_REWARD_CONTRACT, auraContractABI, provider);

    const rewardRateRaw = await balRewardContract.rewardRate();
    const rewardRate = ethers.formatEther(rewardRateRaw);

    const lpAddress = ASSET? ASSET : await balRewardContract.asset();
    const tvl = await getSupplyBalTVL(provider, BAL_REWARD_CONTRACT, lpAddress);
    
    const rewardBal = 100 * (parseFloat(rewardRate) * (86400 * 365) * price_BAL) / tvl;
    const rewardRateAuraRaw = await auraRewardRate.convertCrvToCvx(rewardRateRaw.toString());
    const rewardRateAura = ethers.formatEther(rewardRateAuraRaw);
    const rewardAura = 100 * (parseFloat(rewardRateAura) * (86400 * 365) * price_AURA) / tvl;
   
    const apy = rewardBal + rewardAura;
    return [apy, tvl]
}

export const getAuraApyTokens = async (
    provider,
    BAL_REWARD_CONTRACT,
    AURA_REWARD_CONTRACT,
    VAULT,
    ID,
    prices
) => {

    const balContactABI = [
        `function rewardRate() external view returns (uint256)`,
        `function asset() external view returns (address)`,
    ];
    const auraContractABI = [
        `function convertCrvToCvx(uint256 _amount) external view returns (uint256 amount)`,
    ];

    const price_WETH = prices['weth'] ? prices['weth']['usd'] : 0;
    const price_AURA = prices['aura-finance'] ? prices['aura-finance']['usd'] : 0;
    const price_BAL = prices['balancer'] ? prices['balancer']['usd'] : 0;

    const balRewardContract = new ethers.Contract(BAL_REWARD_CONTRACT, balContactABI, provider);
    const auraRewardRate = new ethers.Contract(AURA_REWARD_CONTRACT, auraContractABI, provider);

    const rewardRateRaw = await balRewardContract.rewardRate();
    const rewardRate = ethers.formatEther(rewardRateRaw);

    const tvl = await getTokensBalTVL(provider, VAULT, ID, [price_WETH, price_AURA]);
    

    const rewardBal = 100 * (parseFloat(rewardRate) * (86400 * 365) * price_BAL) / tvl;
    const rewardRateAuraRaw = await auraRewardRate.convertCrvToCvx(rewardRateRaw.toString());
    const rewardRateAura = ethers.formatEther(rewardRateAuraRaw);
    const rewardAura = 100 * (parseFloat(rewardRateAura) * (86400 * 365) * price_AURA) / tvl;
   
    const apy = rewardBal + rewardAura;
    return [apy, tvl]
}

export const getAuraApyStaked = async (
    provider,
    BAL_REWARD_CONTRACT,
    AURA_REWARD_CONTRACT,
    STAKED_CONTRACT,
    prices
) => {

    const balContactABI = [
        `function rewardRate() external view returns (uint256)`,
    ];
    const auraContractABI = [
        `function convertCrvToCvx(uint256 _amount) external view returns (uint256 amount)`,
    ];

    const priceAuraBal = prices['aura-bal'] ? prices['aura-bal']['usd'] : 0;
    const price_AURA = prices['aura-finance'] ? prices['aura-finance']['usd'] : 0;
    const price_BAL = prices['balancer'] ? prices['balancer']['usd'] : 0;

    const balRewardContract = new ethers.Contract(BAL_REWARD_CONTRACT, balContactABI, provider);
    const auraRewardRate = new ethers.Contract(AURA_REWARD_CONTRACT, auraContractABI, provider);

    const rewardRateRaw = await balRewardContract.rewardRate();
    const rewardRate = ethers.formatEther(rewardRateRaw);

    const tvl = await getStakedTVL(provider, STAKED_CONTRACT, priceAuraBal);
    
    const rewardBal = 100 * (parseFloat(rewardRate) * (86400 * 365) * price_BAL) / tvl;
    const rewardRateAuraRaw = await auraRewardRate.convertCrvToCvx(rewardRateRaw.toString());
    const rewardRateAura = ethers.formatEther(rewardRateAuraRaw);
    const rewardAura = 100 * (parseFloat(rewardRateAura) * (86400 * 365) * price_AURA) / tvl;
   
    const apy = rewardBal + rewardAura;
    return [apy, tvl]
}


export const getFraxApy = async (provider, FRAX_REWARD_CONTRACT, prices) => {
    const fraxContactABI = [
        `function lastRewardAmount() external view returns (uint192)`,
        `function rewardsCycleLength() external view returns (uint32)`,
        `function totalAssets() external view returns (uint256)`,
    ];
    const fraxRewardContract = new ethers.Contract(FRAX_REWARD_CONTRACT, fraxContactABI, provider);
    const lastRewardAmountRaw = await fraxRewardContract.lastRewardAmount();
    const rewardsCycleLengthRaw = await fraxRewardContract.rewardsCycleLength();
    const totalAssetsRaw = await fraxRewardContract.totalAssets();
   
    const lastRewardAmount = +lastRewardAmountRaw.toString();
    const rewardsCycleLength = +rewardsCycleLengthRaw.toString();
    const totalAssets = +totalAssetsRaw.toString();

    const apy = (lastRewardAmount * rewardsCycleLength / totalAssets) / 100;
    // const tvl = await getTotalAssetsTVL(FRAX_REWARD_CONTRACT);
    return [apy, 0]
}


export const getConvexApy = async (provider, CONVEX_CONTRACT, prices) => {
    const convexContactABI = [
        `function rewardRate() external view returns (uint256)`,
    ];
    const fraxRewardContract = new ethers.Contract(CONVEX_CONTRACT, convexContactABI, provider);

    const rewardRateRaw = await fraxRewardContract.rewardRate();
    const rewardRate = parseFloat(ethers.formatEther(rewardRateRaw));
    const apy = rewardRate * 100;

    return [apy, 0]
}


export const getGmxApy = async (provider, GMX_GMX, GMX_TVL, GMX_USER_ADDRESS, prices) => {
    const gmxContactABI = [
        `function tokensPerInterval() external view returns (uint256)`,
    ];
    const gmxRewardContract = new ethers.Contract(GMX_GMX, gmxContactABI, provider);
    const tokensPerIntervalRaw = await gmxRewardContract.tokensPerInterval();
    const tokensPerInterval = parseFloat(ethers.formatEther(tokensPerIntervalRaw));
    const tvl = await getBalanceTVL(provider, GMX_TVL, GMX_USER_ADDRESS);
    const priceGmx = prices['gmx'] ? prices['gmx']['usd'] : 0;
    const tvlUsd = tvl * priceGmx;
    const apy = tokensPerInterval * 3600 * 24 * 365 / tvlUsd * 100;
    return [apy, tvl]

}


export const getGmdStakingApy = async (provider, GMD_STAKING, GMD_TOKEN, userAddress, prices) => {
    const gmdStakingContactABI = [
        `function WETHPerSecond() external view returns (uint256)`,
    ];

    const gmdTokenContactABI = [
        `function balanceOf(address) external view returns (uint256)`,
    ]
    const gmdStakingContact = new ethers.Contract(GMD_STAKING, gmdStakingContactABI, provider);
    const gmdTokenContact = new ethers.Contract(GMD_TOKEN, gmdTokenContactABI, provider);
    const WETHPerSecondRaw = await gmdStakingContact.WETHPerSecond();
    const WETHPerSecond = parseFloat(ethers.formatEther(WETHPerSecondRaw));
    const balanceRaw = await gmdTokenContact.balanceOf(userAddress);
    const balance = parseFloat(ethers.formatEther(balanceRaw));

    const WETH_price_USD = prices['weth']['usd'];
    const GMD_price_USD = prices['gmd-protocol']['usd'];

   // const tvl = await getBalanceTVL(provider, GMD_TOKEN, userAddress);

    const apy = 100 * (WETHPerSecond * 86400 * 365 * WETH_price_USD) / (balance * GMD_price_USD);
    return [apy, 0]
}


export const getGAINS_GNS_APY = async (provider, GAINS_GNS, userAddress, GNS_TVL, prices) => {
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


export const getYEARN_YCRV_APY = async (provider, YEARN_CONTRACT, prices) => {
    const yearnContactABI = [
        `function pricePerShare() external view returns (uint256)`,
    ];
    const fraxRewardContract = new ethers.Contract(YEARN_CONTRACT, yearnContactABI, provider);
    const share_price = await fraxRewardContract.pricePerShare();
    // const apy = ((share_price/previous_5min_share_price) - 1) * 100 * 12 * 24 * 365
    const tvl = await getTotalAssetsTVL(YEARN_CONTRACT);
    return [apy, tvl]

}







