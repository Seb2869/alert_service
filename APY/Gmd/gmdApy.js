import { ethers } from "ethers";

export const getGmdStakingApy = async (provider, GMD_STAKING, GMD_TOKEN, prices) => {
    const gmdStakingContactABI = [
        `function WETHPerSecond() external view returns (uint256)`,
        `function totalAllocPoint() external view returns (uint256)`,
        `function poolInfo(uint256) external view returns 
        (address lpToken,uint256 totalRP, uint256 allocPoint,uint256 lastRewardTime,uint256 accWETHPerShare, uint256 accRPPerShare)`,
        `function poolLength() external view returns (uint256)`,
    ];

    const gmdTokenContactABI = [
        `function balanceOf(address) external view returns (uint256)`,
    ]
    const gmdStakingContact = new ethers.Contract(GMD_STAKING, gmdStakingContactABI, provider);
    const gmdTokenContact = new ethers.Contract(GMD_TOKEN, gmdTokenContactABI, provider);
    const WETHPerSecondRaw = await gmdStakingContact.WETHPerSecond();
    const WETHPerSecond = parseFloat(ethers.formatEther(WETHPerSecondRaw));
    const balanceRaw = await gmdTokenContact.balanceOf(GMD_STAKING);
    const balance = parseFloat(ethers.formatEther(balanceRaw));
    const priceWEth = prices['weth'] ? prices['weth']['usd'] : 0;
    const priceGmd = prices['gmd-protocol'] ? prices['gmd-protocol']['usd'] : 0;
    const tvlUsd = balance * priceGmd;
    const poolLength = (await gmdStakingContact.poolLength()).toString();
    const totalAlloc = (await gmdStakingContact.totalAllocPoint()).toString();
    let allocDict = {};
    for (let i = 0; i < poolLength; i++) {
        const poolInfo = await gmdStakingContact.poolInfo(i);
        allocDict[poolInfo.lpToken.toLowerCase()] = poolInfo.allocPoint.toString();
    };
    const allocPool = allocDict[GMD_TOKEN.toLowerCase()] ?? 0;
    const alloc = allocPool / totalAlloc;
    const apy = 100 * (WETHPerSecond * alloc * 86400 * 365 * priceWEth) / tvlUsd;
    return [apy, tvlUsd]
}