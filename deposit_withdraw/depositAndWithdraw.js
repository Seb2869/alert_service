import { ethers } from 'ethers'
import { contractAbi, contractV2Abi } from './contract.js'
import { sendTxMessage } from '../utils/alert.js'

export const getTotalAssets = async (contract, decimals, etherPrice) => {
  const tvl = parseFloat(
    ethers.formatUnits(await contract.totalAssets(), decimals)
  )
  const tvlUsd = decimals === 6 ? tvl : parseFloat(tvl) * parseFloat(etherPrice)
  return [tvl, tvlUsd]
}

const getAmountFromLog = (log, decimals) => {
  if (!log || !log.topics || log.topics.length < 4) {
    return null
  }
  const amountHex = log.topics[3]
  const amountBigInt = BigInt(amountHex)
  return amountBigInt
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
  token
) => {
  try {
    let totalDeposit = 0
    let totalWithdraw = 0
    let depositLogs = []
    let withdrawLogs = []
    let abi = vault.includes('_v2') ? contractV2Abi : contractAbi

    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider)

    const [tvl, tvlUsd] = await getTotalAssets(contract, decimals, etherPrice)

    if (vault.includes('_v2')) {
      const withdrawV2 =
        '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568'
      let filterParams = {
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: CONTRACT_ADDRESS
      }
      filterParams.topics = [withdrawV2]
      let processedWithdrawLogs = []
      try {
        withdrawLogs = await provider.getLogs(filterParams)
      } catch (e) {
        console.log(e)
      }

      processedWithdrawLogs = withdrawLogs.map(log => {
        const res = getAmountFromLog(log, decimals)
        return res
      })
      totalWithdraw = processedWithdrawLogs.reduce(
        (acc, log) => acc + log,
        BigInt(0)
      )

      if (token) {
       
        const transferEventSignature = ethers.id(
          'Transfer(address,address,uint256)'
        )

        let filterParams = {
          fromBlock: fromBlock,
          toBlock: toBlock,
          address: token,
          topics: [
            transferEventSignature,
            null,
            ethers.zeroPadValue(CONTRACT_ADDRESS, 32)
          ]
        }
        depositLogs = await provider.getLogs(filterParams);
        const abiCoder = new ethers.AbiCoder();
        let totalTransfer = depositLogs.reduce((acc, log) => {
            const decodedData = abiCoder.decode(["uint256"], log.data);
            return acc + decodedData[0];
        }, BigInt(0));
        totalDeposit = totalTransfer;
      }
    } else {
      const depositEventSignature = ethers.id(
        'Deposit(address,uint256,uint256)'
      )
      const withdrawEventSignature = ethers.id(
        'Withdraw(address,uint256,uint256)'
      )

      let filterParams = {
        fromBlock: fromBlock,
        toBlock: toBlock,
        address: CONTRACT_ADDRESS
      }
      filterParams.topics = [depositEventSignature]
      depositLogs = await provider.getLogs(filterParams)
      let processedDepositLogs = depositLogs.map(log =>
        contract.interface.parseLog(log)
      )
      totalDeposit = processedDepositLogs.reduce(
        (acc, log) => acc + log.args[2],
        BigInt(0)
      )

      filterParams.topics = [withdrawEventSignature]
      withdrawLogs = await provider.getLogs(filterParams)
      let processedWithdrawLogs = withdrawLogs.map(log =>
        contract.interface.parseLog(log)
      )
      totalWithdraw = processedWithdrawLogs.reduce(
        (acc, log) => acc + log.args[2],
        BigInt(0)
      )
    }

    if (totalDeposit > 0) {
      let depositLinks = depositLogs
        .map(log => `<${scan}/tx/${log.transactionHash}>`)
        .join('\n')
      let message =
        decimals === 6
          ? `\n${vault} vault:\nTotal deposits: ${ethers.formatUnits(
              totalDeposit,
              decimals
            )} USDC.\nTVL: ${tvlUsd.toFixed(
              2
            )} USDC.\nTransactions:\n${depositLinks}`
          : `\n${vault} vault:\nTotal deposits: ${ethers.formatUnits(
              totalDeposit,
              decimals
            )} ETH (${(
              etherPrice *
              parseFloat(ethers.formatUnits(totalDeposit, decimals))
            ).toFixed(2)}$).\nTVL: ${tvl.toFixed(2)} ETH (${tvlUsd.toFixed(
              2
            )}$).\nTransactions:\n${depositLinks}`

      await sendTxMessage(message, 'Deposit')
    }
    if (totalWithdraw > 0) {
      let withdrawLinks = withdrawLogs
        .map(log => `<${scan}/tx/${log.transactionHash}>`)
        .join('\n')
      let message =
        decimals === 6
          ? `\n${vault} vault:\nTotal withdrawals: ${ethers.formatUnits(
              totalWithdraw,
              decimals
            )} USDC.\nTVL: ${tvlUsd.toFixed(
              2
            )} USDC.\nTransactions:\n${withdrawLinks}`
          : `\n${vault} vault:\nTotal withdrawals: ${ethers.formatUnits(
              totalWithdraw,
              decimals
            )} ETH (${(
              etherPrice *
              parseFloat(ethers.formatUnits(totalWithdraw, decimals))
            ).toFixed(2)}$).\nTVL: ${tvl.toFixed(2)} ETH (${tvlUsd.toFixed(
              2
            )}$).\nTransactions:\n${withdrawLinks}`

      await sendTxMessage(message, 'Withdraw')
      // console.log(message)
    }

    return true
  } catch (error) {
    console.log(error)
    return false
  }
}
