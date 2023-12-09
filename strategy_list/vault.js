const ETH_VAULT_ADDRESS = '0x3edbE670D03C4A71367dedA78E73EA4f8d68F2E4'
const DEFI_VAULT_ADDRESS = '0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B'
const ARBITRUM_VAULT_ADDRESS = '0xBE55f53aD3B48B3ca785299f763d39e8a12B1f98'

const lvETH = "0x3edbE670D03C4A71367dedA78E73EA4f8d68F2E4"
const lvETH_v2 = "0x0e86f93145d097090acbbb8ee44c716dacff04d7"
const lvDCI = "0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B"
const lvDCI_v2 = "0x65b08FFA1C0E1679228936c0c85180871789E1d7"

const lvAYI = "0xBE55f53aD3B48B3ca785299f763d39e8a12B1f98"
const lvAYI_v2 = "0x0f094f6deb056af1fa1299168188fd8c78542a07"


const lvOMV = "0xd39583c9d1001c237151a5a6d4c7a7207b2c08e3"

const lvOMV_v2 = "0x6c090e79A9399c0003A310E219b2D5ed4E6b0428"


export const vaults = [
 /*  {
    vaultId: 'lvETH',
    chain: 1,
    decimals: 18,
    contractAddress: lvETH
  }, */
  {
    vaultId: 'lvETH_v2',
    chain: 1,
    decimals: 18,
    contractAddress: lvETH_v2,
    token: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  },
  /* {
    vaultId: 'lvDCI',
    chain: 1,
    decimals: 6,
    contractAddress: lvDCI
  }, */
  {
    vaultId: 'lvDCI_v2',
    chain: 1,
    decimals: 6,
    contractAddress: lvDCI_v2,
    token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
  },
  /* {
    vaultId: 'lvAYI',
    chain: 42161,
    decimals: 6,
    contractAddress: lvAYI
  }, */
  {
    vaultId: 'lvAYI_v2',
    chain: 42161,
    decimals: 6,
    contractAddress: lvAYI_v2,
    token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
  },
  /* {
    vaultId: 'lvOMV',
    chain: 10,
    decimals: 6,
    contractAddress: lvOMV
  }, */
  {
    vaultId: 'lvOMV_v2',
    chain: 42161,
    decimals: 6,
    contractAddress: lvOMV_v2,
    token: "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8"
  }
]
