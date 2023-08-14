import { ethers } from "ethers";

const poolAbi = [
    `function getPoolTokenInfo(bytes32 poolId, address token) external view returns 
    (uint256 cash, uint256 managed, uint256 lastChangeBlock, address assetManager)`,
]


export const getAuraPoolBalance = async (provider, contractAddress, threshold, decimals = [18, 18], tokens,  poolId, price) => {
    const contract = new ethers.Contract(contractAddress, poolAbi, provider);

    const balance0Raw = await contract.getPoolTokenInfo(poolId, tokens[0]);
    const balance0 = parseFloat(ethers.formatUnits(balance0Raw[0], decimals[0]));
    
    const balance1Raw = await contract.getPoolTokenInfo(poolId, tokens[1]);
    const balance1 = parseFloat(ethers.formatUnits(balance1Raw[0], decimals[1]));

    const balanceUsd0 = (price && price[0])? balance0 * price[0] : balance0;
    const balanceUsd1 = (price && price[1])? balance1 * price[1] : balance1;
    const totalBalance = balanceUsd0 + balanceUsd1;
    const percentBalance = (balanceUsd1 / totalBalance) * 100;
    if ( percentBalance > threshold ) {
        return [true, [percentBalance]]
    }
    else {
        return [false, [percentBalance]]
    }

};
