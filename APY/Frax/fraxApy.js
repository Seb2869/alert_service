import { ethers } from "ethers";

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

    //const apy = (lastRewardAmount * rewardsCycleLength / totalAssets) / 100;
    const apy = (lastRewardAmount / totalAssets) * (31536000 / rewardsCycleLength) * 100;

    // const tvl = await getTotalAssetsTVL(FRAX_REWARD_CONTRACT);
    return [apy, 0]
}