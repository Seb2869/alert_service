import { ethers } from "ethers";
import {
    getSupplyBalTVL,
    getTokensBalTVL,
    getSupplyTVL
}
    from "../apyTvlMethods.js";
import { getPriceForContract } from "../../utils/price.js";



export const getAuraApyLp = async (
    provider,
    BAL_REWARD_CONTRACT,
    AURA_REWARD_CONTRACT,
    ASSET,
    prices
) => {

    const balContactABI = [
        `function rewardRate() external view returns (uint256)`,
        `function rewardToken() external view returns (address)`,
        `function extraRewardsLength() external view returns (uint256)`,
        `function extraRewards(uint256) external view returns (address)`,
        `function asset() external view returns (address)`,
    ];
    const auraContractABI = [
        `function convertCrvToCvx(uint256 _amount) external view returns (uint256 amount)`,
    ];
    const tokenContractABI = [
        `function totalSupply() external view returns (uint256)`,
    ]
    const assetABI = [
        `function getPoolId() external view returns (bytes32)`,
    ]

    const price_AURA = prices['aura-finance'] ? prices['aura-finance']['usd'] : 0;
    const price_BAL = prices['balancer'] ? prices['balancer']['usd'] : 0;


    const balRewardContract = new ethers.Contract(BAL_REWARD_CONTRACT, balContactABI, provider);
    const auraRewardRate = new ethers.Contract(AURA_REWARD_CONTRACT, auraContractABI, provider);
    // const auraContract = new ethers.Contract(AURA_ADDRESS, tokenContractABI, provider);


    // reward BAL
    const rewardRateRaw = await balRewardContract.rewardRate();
    const rewardRate = ethers.formatEther(rewardRateRaw);


    const lpAddress = ASSET ? ASSET : await balRewardContract.asset();
    const tvl = await getSupplyBalTVL(provider, BAL_REWARD_CONTRACT, lpAddress);

    const rewardBal = 100 * (parseFloat(rewardRate) * (86400 * 365) * price_BAL) / tvl;

    // reward AURA //  делим на AURA supply
    const rewardRateAuraRaw = await auraRewardRate.convertCrvToCvx(rewardRateRaw.toString());
    const rewardRateAura = ethers.formatEther(rewardRateAuraRaw);
    const rewardAura = 100 * (parseFloat(rewardRateAura) * (86400 * 365) * price_AURA) / tvl;
    // const rewardAura = 100 * (parseFloat(rewardRateAura) * (86400 * 365) * price_AURA) / auraTvl;

    // reward EXTRA
    let extraReward = 0;
    try {
        const numberExtraReward = (await balRewardContract.extraRewardsLength()).toString();


        for (let i = 0; i < parseInt(numberExtraReward); i++) {
            const extraRewardAddress = await balRewardContract.extraRewards(i);

            const extraRewardContract = new ethers.Contract(extraRewardAddress, balContactABI, provider);
            const rewardRateRaw = await extraRewardContract.rewardRate();

            if (rewardRateRaw > 0) {
                const rewardRate = ethers.formatEther(rewardRateRaw);
                const rewardAddress = await extraRewardContract.rewardToken();
                const rewardToken = new ethers.Contract(
                    rewardAddress,
                    [
                        `function baseToken() external view returns (address)`,
                    ],
                    provider);
                const baseToken = await rewardToken.baseToken();

                const priceBaseToken = await getPriceForContract(baseToken);

                const iterExtraReward = priceBaseToken ? 100 * (parseFloat(rewardRate) * (86400 * 365) * priceBaseToken) / tvl : 0;
                extraReward = extraReward + iterExtraReward;
            }
        }
    }
    catch (error) {
        console.log(error)
    }

    const apy = rewardBal + rewardAura + extraReward;
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
    const rewardAura = (parseFloat(rewardRateAura) * (86400 * 365) * price_AURA);
    const rewAuraTvl = 100 * rewardAura / tvl;



    const apy = rewardBal + rewAuraTvl;
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
        `function rewardToken() external view returns (address)`,
        `function extraRewardsLength() external view returns (uint256)`,
        `function extraRewards(uint256) external view returns (address)`,
        `function asset() external view returns (address)`,
    ];
    const auraContractABI = [
        `function convertCrvToCvx(uint256 _amount) external view returns (uint256 amount)`,
    ];

    const priceAuraBal = prices['aura-bal'] ? prices['aura-bal']['usd'] : 0;
    const priceAura = prices['aura-finance'] ? prices['aura-finance']['usd'] : 0;
    const priceBal = prices['balancer'] ? prices['balancer']['usd'] : 0;

    const balRewardContract = new ethers.Contract(BAL_REWARD_CONTRACT, balContactABI, provider);
    const auraRewardRate = new ethers.Contract(AURA_REWARD_CONTRACT, auraContractABI, provider);

    const rewardRateRaw = await balRewardContract.rewardRate();

    const rewardRate = ethers.formatEther(rewardRateRaw);

    // const tvl = await getStakedTVL(provider, STAKED_CONTRACT, priceAuraBal);
    const tvl = await getSupplyTVL(provider, BAL_REWARD_CONTRACT, priceAuraBal);


    const rewardBal = 100 * (parseFloat(rewardRate) * (86400 * 365) * priceBal) / tvl;
    const rewardRateAuraRaw = await auraRewardRate.convertCrvToCvx(rewardRateRaw.toString());

    const rewardRateAura = ethers.formatEther(rewardRateAuraRaw);
    const rewardAura = 100 * (parseFloat(rewardRateAura) * (86400 * 365) * priceAura) / tvl;

    const apy = +rewardBal + +rewardAura;
    return [apy, tvl]
}