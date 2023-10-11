import { ethers } from "ethers";

const pauseAbi = [
    `function paused() external view returns (bool)`
  ]

export const getOvernightPause = async (provider, contractAddress, threshold) => {
    const contract = new ethers.Contract(contractAddress, pauseAbi, provider);
    const paused = await contract.paused();
    return [paused, 0]
}