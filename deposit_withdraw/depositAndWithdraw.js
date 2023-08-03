import { ethers } from "ethers";
import { contractAbi } from "./contract.js";
import { sendTxMessage } from "../utils/alert.js";



export const getTotalAssets = async (contract, decimals, etherPrice) => {
    const tvl = parseFloat(ethers.formatUnits(await contract.totalAssets(), decimals));
    const tvlUsd = decimals === 6 ? tvl : parseFloat(tvl) * parseFloat(etherPrice);
    return [tvl, tvlUsd]
}


export const getEvents = async (
    vault,
    fromBlock,
    toBlock,
    provider,
    scan, 
    CONTRACT_ADDRESS,
    decimals,
    etherPrice,

) => {
    try {

        const contract = new ethers.Contract(CONTRACT_ADDRESS, contractAbi, provider);
        const [tvl, tvlUsd] = await getTotalAssets(contract, decimals, etherPrice);
        const depositEventSignature = ethers.id('Deposit(address,uint256,uint256)');
        const withdrawEventSignature = ethers.id('Withdraw(address,uint256,uint256)');
    
        let filterParams = {
            fromBlock: fromBlock,
            toBlock: toBlock,
            address: CONTRACT_ADDRESS
        };
        filterParams.topics = [depositEventSignature];
        let depositLogs = await provider.getLogs(filterParams);
        let processedDepositLogs = depositLogs.map(log => contract.interface.parseLog(log));
        let totalDeposit = processedDepositLogs.reduce((acc, log) => acc + log.args[2], BigInt(0));
        if (totalDeposit > 0) {
            let depositLinks = depositLogs.map(log => `<${scan}/tx/${log.transactionHash}>`).join('\n');
            let message = decimals===6 
            ? `\n${vault} vault:\nTotal deposits: ${ethers.formatUnits(totalDeposit, decimals)} USDC.\nTVL: ${tvlUsd.toFixed(2)} USDC.\nTransactions:\n${depositLinks}`
            : `\n${vault} vault:\nTotal deposits: ${ethers.formatUnits(totalDeposit, decimals)} ETH (${(etherPrice * parseFloat(ethers.formatUnits(totalDeposit, decimals))).toFixed(2)}$).\nTVL: ${tvl.toFixed(2)} ETH (${tvlUsd.toFixed(2)}$).\nTransactions:\n${depositLinks}`
            
            await sendTxMessage(message, 'Deposit');
            // console.log(message);
        }

        filterParams.topics = [withdrawEventSignature];
        let withdrawLogs = await provider.getLogs(filterParams);
        let processedWithdrawLogs = withdrawLogs.map(log => contract.interface.parseLog(log));
        let totalWithdraw = processedWithdrawLogs.reduce((acc, log) => acc + log.args[2], BigInt(0));
        if (totalWithdraw > 0) {
            let withdrawLinks = withdrawLogs.map(log => `<${scan}/tx/${log.transactionHash}>`).join('\n');
            let message = decimals===6 
            ? `\n${vault} vault:\nTotal withdrawals: ${ethers.formatUnits(totalWithdraw, decimals)} USDC.\nTVL: ${tvlUsd.toFixed(2)} USDC.\nTransactions:\n${withdrawLinks}`
            : `\n${vault} vault:\nTotal withdrawals: ${ethers.formatUnits(totalWithdraw, decimals)} ETH (${(etherPrice * parseFloat(ethers.formatUnits(totalWithdraw, decimals))).toFixed(2)}$).\nTVL: ${tvl.toFixed(2)} ETH (${tvlUsd.toFixed(2)}$).\nTransactions:\n${depositLinks}`
            
            await sendTxMessage(message, 'Withdraw');
           // console.log(message);
        }

        return true
    }
    catch (error) {
        console.log(error);
        return false
    }

}