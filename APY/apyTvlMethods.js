
import { ethers } from "ethers";
import { getLpBalancerPrice } from "../utils/price.js";

export const getSupplyBalTVL = async (provider, TVL_CONTRACT, lpAddress) => {
    const contractABI = [
        `function totalSupply() external view returns (uint256)`,
    ];
    const contract = new ethers.Contract(TVL_CONTRACT, contractABI, provider);
    const tvlRaw = await contract.totalSupply();
    const tvl = ethers.formatEther(tvlRaw);

    const lpPrice = await getLpBalancerPrice(lpAddress);
    const tvlUsd = tvl * lpPrice;

    return tvlUsd
}

export const getSupplyTVL = async (provider, TVL_CONTRACT, price) => {
    const contractABI = [
        `function totalSupply() external view returns (uint256)`,
    ];
    const contract = new ethers.Contract(TVL_CONTRACT, contractABI, provider);
    const tvlRaw = await contract.totalSupply();
    const tvl = ethers.formatEther(tvlRaw);
   

    const tvlUsd = tvl * price;

    return tvlUsd
}

export const getTokensBalTVL = async (provider, VAULT_CONTRACT, idPool, prices) => {
    const contractABI = [
        `function getPoolTokens(bytes32 poolId) external view returns (address[] tokens, uint256[] balances, uint256 lastChangeBlock)`,
    ];
    const contract = new ethers.Contract(VAULT_CONTRACT, contractABI, provider);
    const info = await contract.getPoolTokens(idPool);
    const { balances } = info;
    const token0Balance = parseFloat(ethers.formatEther(balances[0]));
    const token1Balance = parseFloat(ethers.formatEther(balances[1]));
    const token0 = token0Balance * prices[0];
    const token1 = token1Balance * prices[1];
    const tvlUsd = token0 + token1;
    return tvlUsd
}

export const getBalanceTVL = async (provider, TVL_CONTRACT, USER_ADDRESS) => {
    const contractABI = [
        `function balanceOf(address) external view returns (uint256)`,
    ];
    const contract = new ethers.Contract(TVL_CONTRACT, contractABI, provider);
    const tvlRaw = await contract.balanceOf(USER_ADDRESS);
    const tvl = parseFloat(ethers.formatEther(tvlRaw));
    return tvl
}

export const getCVXBalanceTVL = async (provider, TVL_CONTRACT, prices) => {
    const contractABI = [
        `function balances(uint256 arg0) external view returns (uint256)`,
    ];
    const contract = new ethers.Contract(TVL_CONTRACT, contractABI, provider);
    const balances0Raw = await contract.balances(0);
    const balances1Raw = await contract.balances(1);
    const balances0 = ethers.formatEther(balances0Raw);
    const balances1 = ethers.formatEther(balances1Raw);
    const tvl = parseFloat(balances0) * prices[0] + parseFloat(balances1) * prices[1];
    return tvl
}

export const getConvexTvl = (pool, mappedGauges, totalSupply, decimals) => {

    let v2PoolUsd;
    const z = [
        '0x453D92C7d4263201C69aACfaf589Ed14202d83a4', // yCrv
        '0x5b6C539b224014A09B3388e51CaAA8e354c959C8', // cbETH
        '0x051d7e5609917Bd9b73f04BAc0DED8Dd46a74301', // wbtc-sBTC
        '0x9848482da3Ee3076165ce6497eDA906E66bB85C5', // eth-peth
    ];

    const gauges = mappedGauges[pool.lptoken.toLowerCase()];
    if (!gauges && !z.includes(pool.lptoken)) return null;

    const virtualPrice = z.includes(pool.lptoken)
        ? pool.virtualPrice
        : gauges.swap_data.virtual_price / 10 ** 18;
    if (!pool.coinsAddresses) return null;

    if (pool.totalSupply == 0) {
        const usdValue = pool.coins.reduce(
            (acc, coin) =>
                acc +
                (Number(coin.poolBalance) / 10 ** coin.decimals) * coin.usdPrice,
            0
        );
        let supply = pool.coins.reduce(
            (acc, coin) => acc + Number(coin.poolBalance) / 10 ** coin.decimals,
            0
        );

        if (pool.assetTypeName === 'usd') supply = usdValue / virtualPrice;

        v2PoolUsd = (totalSupply / 10 ** decimals / supply) * usdValue;
    }


    const cvxTvl = v2PoolUsd
        ? v2PoolUsd
        : ((totalSupply * virtualPrice) /
            (pool.totalSupply * virtualPrice ||
                pool.usdTotal * 10 ** decimals)) *
        pool.usdTotal;
    return cvxTvl;
}



export const getStakedTVL = async (provider, STAKED_CONTRACT, price) => {
    const contractABI = [
        `function totalUnderlying() external view returns (uint256)`,
    ];
    const contract = new ethers.Contract(STAKED_CONTRACT, contractABI, provider);
    const tvlRaw = await contract.totalUnderlying();
    const tvl = parseFloat(ethers.formatEther(tvlRaw));
    const tvlUsd = tvl * price;
    return tvlUsd
}



export const getTotalAssetsTVL = async (provider, TVL_CONTRACT, USER_ADDRESS) => {
    const contractABI = [
        `function totalAssets() external view returns (uint256)`,
    ];
    const contract = new ethers.Contract(TVL_CONTRACT, contractABI, provider);
    const tvlRaw = await contract.totalAssets();
    const tvl = ethers.formatEther(tvlRaw);
    return tvl
}



