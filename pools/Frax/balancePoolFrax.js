import { ethers } from "ethers";

const poolAbi = [
    `function getReserves() external view returns 
    (uint112 _reserve0, uint112 _reserve1, uint32 _blockTimestampLast)`,
]

export const getFraxPoolBalance = async (provider, contractAddress, threshold, decimals = [18, 18], tokens, price) => {
    const contract = new ethers.Contract(contractAddress, poolAbi, provider);
    const reserve = await contract.getReserves();
    const balance0 = parseFloat(ethers.formatUnits(reserve[0], decimals[0]));
    const balance1 = parseFloat(ethers.formatUnits(reserve[1], decimals[1]));
    const balanceUsd0 = (price && price[0])? balance0 * price[0] : balance0;
    const balanceUsd1 = (price && price[1])? balance1 * price[1] : balance1;
    const totalBalance = parseFloat(balanceUsd0)+ parseFloat(balanceUsd1);
    const percentBalance = (parseFloat(balanceUsd1) / totalBalance) * 100;
    if (percentBalance > threshold)
        return [true, percentBalance]
    else return [false, percentBalance];
}