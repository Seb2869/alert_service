import { ethers } from "ethers";

const poolAbi = [
    `function getReserves() external view returns (uint256 _reserve0, uint256 _reserve1, uint256 _blockTimestampLast)`
  ]

export const getPolygonPoolBalance = async (provider, contractAddress, threshold, decimals = [6, 9]) => {
    const contract = new ethers.Contract(contractAddress, poolAbi, provider);
    const reserve = await contract.getReserves();
    const balance0 = parseFloat(ethers.formatUnits(reserve[0], decimals[0]));
    const balance1 = parseFloat(ethers.formatUnits(reserve[1], decimals[1]));
    const totalBalance = parseFloat(balance0)+ parseFloat(balance1);
    const percentBalance = (parseFloat(balance1) / totalBalance) * 100;
    if (percentBalance > threshold)
        return [true, percentBalance]
    else return [false, percentBalance];
}