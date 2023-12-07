import * as methods from '../pools/poolMethods.js'

const POOL_CURVE_CVX_FXS = '0xd658A338613198204DCa1143Ac3F01A722b5d94A'
const POOL_CURVE_FRX_ETH = '0xa1f8a6807c402e4a15ef4eba36528a3fed24e577'
const POOL_CURVE_RETH = '0x0f3159811670c117c372428d4e69ac32325e4d0f'
const POOL_CURVE_STETH = '0xdc24316b9ae028f1497c275eb9192a3ea0f67022'
const POOL_CURVE_YCRV = '0x99f5aCc8EC2Da2BC0771c32814EFF52b712de1E5' //'0x453d92c7d4263201c69aacfaf589ed14202d83a4';
const POOL_CURVE_3POOL = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7' // DAI / USDC /USDT
const POOL_AURA_BAL = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'
const POOL_AURA_RETH_ETH = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'

const POOL_CURVE_CVX_ETH = '0xB576491F1E6e5E62f1d8F26062Ee822B40B0E0d4'
const POOL_CURVE_CRVUSD_USDC = '0x4DEcE678ceceb27446b35C672dC7d61F30bAD69E'
const POOL_CURVE_CRV_YCRV = '0x99f5aCc8EC2Da2BC0771c32814EFF52b712de1E5'
const POOL_CURVE_TriCRV = '0x4eBdF703948ddCEA3B11f675B4D1Fba9d2414A14'
const POOL_CURVE_FRAX_USDC = '0xDcEF968d416a41Cdac0ED8702fAC8128A64241A2'

const POOL_FRAX_FXS = '0x03B59Bd1c8B9F6C265bA0c3421923B93f15036Fa'


const FRAX_FXS_TOKENS = [
  '0x3432B6A60D23Ca0dFCa7761B7ab56459D9C964D0',
  '0x853d955aCEf822Db058eb8505911ED77F175b99e'
]

const CURVE_CVX_ETH_TOKENS = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B'
]

const CURVE_TriCRV_TOKENS = [
  '0xf939E0A03FB07F59A73314E73794Be0E57ac1b4E', //crvUSD
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  '0xD533a949740bb3306d119CC777fa900bA034cd52' // CRV
]

const AURA_BAL_POOL_ID =
  '0x3dd0843a028c86e0b760b1a76929d1c5ef93a2dd000200000000000000000249'
const AURA_BAL_TOKENS = [
  '0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56',
  '0x616e8BfA43F920657B3497DBf40D6b1A02D4608d'
]

const AURA_RETH_POOL_ID =
  '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112'
const AURA_RETH_TOKENS = [
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0xae78736Cd615f374D3085123A210448E74Fc6393'
]

const OVERNIGHT = '0xe80772Eaf6e2E18B651F160Bc9158b2A5caFCA65';

export const pools = [
  {
    poolId: 'POOL_CURVE_CVX_FXS',
    chain: 1,
    contractAddress: POOL_CURVE_CVX_FXS,
    method: methods.getCurvePoolBalance,
    threshold: 85,
    params: [],
    needPrice: false,
    message: `Доля "cvxFXS" превышает {threshold}% от общего баланса в пуле curve. Доля "cvxFXS": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_CVX_ETH',
    chain: 1,
    contractAddress: POOL_CURVE_CVX_ETH,
    method: methods.getCurvePoolBalance,
    threshold: 65,
    params: [CURVE_CVX_ETH_TOKENS],
    needPrice: true,
    message: `Доля "CVX" превышает {threshold}% от общего баланса в пуле curve. Доля "CVX": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_CRVUSD_USDC',
    chain: 1,
    contractAddress: POOL_CURVE_CRVUSD_USDC,
    method: methods.getCurvePoolBalance,
    threshold: 70,
    params: [],
    decimals: [6, 18],
    needPrice: false,
    message: `Доля "crvUSD" превышает {threshold}% от общего баланса в пуле curve. Доля "crvUSD": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_CRV_YCRV',
    chain: 1,
    contractAddress: POOL_CURVE_CRV_YCRV,
    method: methods.getCurvePoolBalance,
    threshold: 70,
    params: [],
    needPrice: false,
    message: `Доля "yCRV" превышает {threshold}% от общего баланса в пуле curve. Доля "yCRV": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_FRX_ETH',
    chain: 1,
    contractAddress: POOL_CURVE_FRX_ETH,
    method: methods.getCurvePoolBalance,
    threshold: 85,
    params: [],
    needPrice: false,
    message: `Доля "frxETH" превышает {threshold}% от общего баланса в пуле curve. Доля "frxETH": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_RETH',
    chain: 1,
    contractAddress: POOL_CURVE_RETH,
    method: methods.getCurvePoolBalance,
    threshold: 55,
    params: [],
    needPrice: false,
    message: `Доля "CURVE rETH" превышает {threshold}% от общего баланса в пуле curve. Доля "CURVE rETH": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_STETH',
    chain: 1,
    contractAddress: POOL_CURVE_STETH,
    method: methods.getCurvePoolBalance,
    threshold: 55,
    params: [],
    needPrice: false,
    message: `Доля "stETH" превышает {threshold}% от общего баланса в пуле curve. Доля "stETH": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_YCRV',
    chain: 1,
    contractAddress: POOL_CURVE_YCRV,
    method: methods.getCurvePoolBalance,
    threshold: 88,
    params: [],
    needPrice: false,
    message: `Доля "yCRV" превышает {threshold}% от общего баланса в пуле curve. Доля "yCRV": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_FRAX_USDC',
    chain: 1,
    contractAddress: POOL_CURVE_FRAX_USDC,
    method: methods.getCurvePoolBalance,
    threshold: 90,
    params: [],
    needPrice: false,
    decimals: [18, 6],
    message: `Доля "FRAX" превышает {threshold}% от общего баланса в пуле curve. Доля "FRAX": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_CURVE_3POOL',
    chain: 1,
    contractAddress: POOL_CURVE_3POOL,
    method: methods.getCurve3poolBalance,
    threshold: 40,
    params: [],
    needPrice: false,
    decimals: [18, 6, 6],
    message: `Доля одного из трех токенов в пуле 3pool curve превышает {threshold}% от общего баланса (либо доля двух токенов из трех >75%)`,
    status: false
  },
  {
    poolId: 'POOL_CURVE_TriCRV',
    chain: 1,
    contractAddress: POOL_CURVE_TriCRV,
    method: methods.getCurve3poolBalance,
    threshold: 40,
    params: [CURVE_TriCRV_TOKENS],
    needPrice: true,
    decimals: [18, 18, 18],
    message: `Доля одного из трех токенов в пуле TriCRV curve превышает {threshold}% от общего баланса (либо доля двух токенов из трех >75%)`,
    status: true
  },
  {
    poolId: 'POOL_AURA_BAL',
    chain: 1,
    contractAddress: POOL_AURA_BAL,
    method: methods.getAuraPoolBalance,
    threshold: 60,
    params: [AURA_BAL_TOKENS, AURA_BAL_POOL_ID],
    needPrice: true,
    message: `Доля "auraBAL" превышает {threshold}% от общего долларового баланса в пуле aura. Доля "auraBAL": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_AURA_RETH_ETH',
    chain: 1,
    contractAddress: POOL_AURA_RETH_ETH,
    method: methods.getAuraPoolBalance,
    threshold: 55,
    params: [AURA_RETH_TOKENS, AURA_RETH_POOL_ID],
    needPrice: false,
    message: `Доля "AURA rETH" превышает {threshold}% от общего баланса в пуле aura. Доля "AURA rETH": {percent}% `,
    status: true
  },
  {
    poolId: 'POOL_FRAX_FXS',
    chain: 1,
    contractAddress: POOL_FRAX_FXS,
    method: methods.getFraxPoolBalance,
    threshold: 85,
    params: [FRAX_FXS_TOKENS],
    needPrice: true,
    message: `Доля "FRAX" превышает {threshold}% от общего баланса в пуле Frax. Доля "FRAX": {percent}% `,
    status: true
  },
  {
    poolId: 'Overnight',
    chain: 10,
    contractAddress: OVERNIGHT,
    method: methods.getOvernightPause,
    threshold: 0,
    params: [],
    needPrice: false,
    message: `OPTIMISM Overnight USD+/USDC Paused = TRUE`,
    status: true
  }

]
