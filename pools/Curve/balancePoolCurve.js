import { ethers } from "ethers";

const poolAbi = [
    `function balances(uint256 arg0) external view returns (uint256)`,
]

export const getCurve3poolBalance = async (provider, contractAddress, threshold ) => {
    const contract = new ethers.Contract(contractAddress, poolAbi, provider);
    const balance0 = ethers.formatEther(await contract.balances(0));
    const balance1 = ethers.formatUnits(await contract.balances(1), 6);
    const balance2 = ethers.formatUnits(await contract.balances(2), 6);
    const totalBalance = parseFloat(balance0) + parseFloat(balance1) + parseFloat(balance2);
    const percentBalance0 = (parseFloat(balance0) / totalBalance) * 100
    const percentBalance1 = (parseFloat(balance1) / totalBalance) * 100
    const percentBalance2 = (parseFloat(balance2) / totalBalance) * 100
    if (percentBalance0 > threshold || percentBalance1 > threshold || percentBalance2 > threshold) {
        return [true, [percentBalance0, percentBalance1,percentBalance2 ]]
    }
    else {
        return [false, [percentBalance0, percentBalance1,percentBalance2]]
    }
};


export const getCurvePoolBalance = async (provider, contractAddress, threshold, prices) => {
    const contract = new ethers.Contract(contractAddress, poolAbi, provider);
    const balance0 = ethers.formatEther(await contract.balances(0));
    const balance1 = ethers.formatEther(await contract.balances(1));
    const totalBalance = parseFloat(balance0)+ parseFloat(balance1);
    const percentBalance = (parseFloat(balance1) / totalBalance) * 100;
    if (percentBalance > threshold)
        return [true, [percentBalance]]
    else return [false, [percentBalance]];
}


