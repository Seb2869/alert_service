import { ethers } from "ethers";
import { ETH_NODE, ARB_NODE, OPTIMISM_NODE } from "./utils/utils.js";
import { getLastBlock, writeLastBlock } from "./utils/database.js";
import { vaults } from "./strategy_list/vault.js";
import { getPriceForDefiLama } from "./utils/price.js";
import { getEvents } from "./deposit_withdraw/depositAndWithdraw.js";


export const checkEvent = async (pgClient, vault, provider, scan, lastBlocks, ethPrice) => {
    const { vaultId, chain, contractAddress,decimals, token } = vault;
    const vaultProvider = provider[chain];
    const vaultScan = scan[chain];
    // const defBlock = chain===1? 17823116 : 117660826;
    const blockNumber = await vaultProvider.getBlockNumber();
    const lastBlock = lastBlocks[vaultId]?? blockNumber;
    const result = await getEvents(vaultId, lastBlock, blockNumber, vaultProvider, vaultScan, contractAddress, decimals, ethPrice, token);
    if (result) {
        const newRow = lastBlocks[vaultId]? false : true;
        await writeLastBlock(pgClient, vaultId, blockNumber, newRow)
    };
}

export const loadAllEvent = async (provider, pgClient, scan, last_blocks, ethPrice) => {
    let result = false;
    if (vaults?.length) {
        const data = await Promise.all(vaults.map(vault => checkEvent(pgClient, vault, provider, scan, last_blocks, ethPrice)));
        result = data.reduce((acc, value) => acc && value, true);
    }
    else {
        console.log("price error");
        return false;
    }
    return result;

}


export const eventCheck = async (pgClient) => {
    const ethProvider = new ethers.JsonRpcProvider(ETH_NODE);
    const arbProvider = new ethers.JsonRpcProvider(ARB_NODE);
    const optProvider = new ethers.JsonRpcProvider(OPTIMISM_NODE);
    const lastBlocks = await getLastBlock(pgClient);
    const provider = {
        1: ethProvider,
        42161: arbProvider,
        10: optProvider
    };
    const scan = {
        1: 'https://etherscan.io',
        42161: 'https://arbiscan.io',
        10: 'https://optimistic.etherscan.io'
    };
    const ethPrice = await getPriceForDefiLama('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2');
    const resultCheck = await loadAllEvent(provider, pgClient, scan, lastBlocks, ethPrice);
    return resultCheck;
}

