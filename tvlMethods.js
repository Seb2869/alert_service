
import { ethers } from "ethers";
import { getLpBalancerPrice } from "./utils.js";

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

export const getTokensBalTVL = async (provider, VAULT_CONTRACT, idPool, prices) => { 
    const contractABI = [
        `function getPoolTokens(bytes32 poolId) external view returns (address[] tokens, uint256[] balances, uint256 lastChangeBlock)`,
    ];
    const contract = new ethers.Contract(VAULT_CONTRACT, contractABI, provider);
    const info = await contract.getPoolTokens(idPool);
    const { balances } = info;
    const token0Balance = parseFloat(ethers.formatEther(balances[0]));
    const token1Balance = parseFloat(ethers.formatEther(balances[1]));
    const token0 = token0Balance  * prices[0];
    const token1 = token1Balance * prices[1];
    const tvlUsd = token0 + token1 ;
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



