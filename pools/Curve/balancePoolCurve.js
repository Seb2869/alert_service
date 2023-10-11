import { ethers } from "ethers";

const poolAbi = [
    `function balances(uint256 arg0) external view returns (uint256)`,
]

export const getCurve3poolBalance = async (provider, contractAddress, threshold, decimals = [18, 18, 18], tokens, price ) => {
    const contract = new ethers.Contract(contractAddress, poolAbi, provider);
    const balance0 = parseFloat(ethers.formatUnits(await contract.balances(0), decimals[0]));
    const balance1 = parseFloat(ethers.formatUnits(await contract.balances(1), decimals[1]));
    const balance2 = parseFloat(ethers.formatUnits(await contract.balances(2), decimals[2]));
    const balanceUsd0 = (price && price[0])? balance0 * price[0] : balance0;
    const balanceUsd1 = (price && price[1])? balance1 * price[1] : balance1;
    const balanceUsd2 = (price && price[2])? balance2 * price[2] : balance2;
    const totalBalance = parseFloat(balanceUsd0) + parseFloat(balanceUsd1) + parseFloat(balanceUsd2);
    const percentBalance0 = (parseFloat(balanceUsd0) / totalBalance) * 100;
    const percentBalance1 = (parseFloat(balanceUsd1) / totalBalance) * 100;
    const percentBalance2 = (parseFloat(balanceUsd2) / totalBalance) * 100;

    if (percentBalance0 > threshold || percentBalance1 > threshold || percentBalance2 > threshold || percentBalance0+percentBalance2 > 75) {
        let percent = Math.max(percentBalance0, percentBalance1,percentBalance2);
        return [true, percent]
    }
    else {
        return [false, 0]
    }
};


export const getCurvePoolBalance = async (provider, contractAddress, threshold, decimals = [18, 18], tokens, price) => {
    const contract = new ethers.Contract(contractAddress, poolAbi, provider);
    const balance0 = parseFloat(ethers.formatUnits(await contract.balances(0), decimals[0]));
    const balance1 = parseFloat(ethers.formatUnits(await contract.balances(1), decimals[1]));
    const balanceUsd0 = (price && price[0])? balance0 * price[0] : balance0;
    const balanceUsd1 = (price && price[1])? balance1 * price[1] : balance1;
    const totalBalance = parseFloat(balanceUsd0)+ parseFloat(balanceUsd1);
    const percentBalance = (parseFloat(balanceUsd1) / totalBalance) * 100;
    if (percentBalance > threshold)
        return [true, percentBalance]
    else return [false, percentBalance];
}


