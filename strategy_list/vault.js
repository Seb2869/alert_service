const ETH_VAULT_ADDRESS = '0x3edbE670D03C4A71367dedA78E73EA4f8d68F2E4';
const DEFI_VAULT_ADDRESS = '0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B';
const ARBITRUM_VAULT_ADDRESS = '0xBE55f53aD3B48B3ca785299f763d39e8a12B1f98';


export const vaults = [
     {
        vaultId: 'ETH',
        chain: 1,
        decimals: 18,
        contractAddress: ETH_VAULT_ADDRESS, 
    }, 
    {
        vaultId: 'DEFI',
        chain: 1,
        decimals: 6,
        contractAddress: DEFI_VAULT_ADDRESS, 
    },
    {
        vaultId: 'ARBITRUM',
        chain: 42161,
        decimals: 6,
        contractAddress: ARBITRUM_VAULT_ADDRESS, 
    },  
]