import * as methods from "../pools/poolMethods.js"

const POOL_CURVE_CVX_FXS = '0xd658A338613198204DCa1143Ac3F01A722b5d94A';
const POOL_CURVE_FRX_ETH = '0xa1f8a6807c402e4a15ef4eba36528a3fed24e577';
const POOL_CURVE_RETH = '0x0f3159811670c117c372428d4e69ac32325e4d0f';
const POOL_CURVE_STETH = '0xdc24316b9ae028f1497c275eb9192a3ea0f67022';
const POOL_CURVE_YCRV = '0x453d92c7d4263201c69aacfaf589ed14202d83a4';
const POOL_CURVE_3POOL = '0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7';
const POOL_AURA_BAL = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const POOL_AURA_RETH_ETH = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';

const AURA_BAL_POOL_ID = '0x3dd0843a028c86e0b760b1a76929d1c5ef93a2dd000200000000000000000249';
const AURA_BAL_TOKENS = [
    '0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56',
    '0x616e8BfA43F920657B3497DBf40D6b1A02D4608d'
]

const AURA_RETH_POOL_ID = '0x1e19cf2d73a72ef1332c882f20534b6519be0276000200000000000000000112';
const AURA_RETH_TOKENS = [
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    '0xae78736Cd615f374D3085123A210448E74Fc6393'
]

export const pools = [
    {
        poolId: 'POOL_CURVE_CVX_FXS',
        chain: 1,
        contractAddress: POOL_CURVE_CVX_FXS, 
        method: methods.getCurvePoolBalance,
        threshold: 70,
        params: [],
        needPrice: false,
        message: `Доля "cvxFXS" превышает {threshold}% от общего баланса в пуле curve. Доля "cvxFXS": {percent}% `,
        status: true,
        
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
        status: true,
        
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
        status: true,
        
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
        status: true,
        
    },
    {
        poolId: 'POOL_CURVE_YCRV',
        chain: 1,
        contractAddress: POOL_CURVE_YCRV, 
        method: methods.getCurvePoolBalance,
        threshold: 90,
        params: [],
        needPrice: false,
        message: `Доля "yCRV" превышает {threshold}% от общего баланса в пуле curve. Доля "yCRV": {percent}% `,
        status: true,
        
    },
    {
        poolId: 'POOL_CURVE_3POOL',
        chain: 1,
        contractAddress: POOL_CURVE_3POOL, 
        method: methods.getCurve3poolBalance,
        threshold: 40,
        params: [],
        needPrice: false,
        message: `Доля одного из трех токенов в пуле 3pool curve превышает {threshold}% от общего баланса`,
        status: false,
    },
     {
        poolId: 'POOL_AURA_BAL',
        chain: 1,
        contractAddress: POOL_AURA_BAL, 
        method: methods.getAuraPoolBalance,
        threshold: 60,
        params: [AURA_BAL_POOL_ID, AURA_BAL_TOKENS],
        needPrice: true,
        message: `Доля "auraBAL" превышает {threshold}% от общего долларового баланса в пуле aura. Доля "auraBAL": {percent}% `,
        status: true,
    },
    {
        poolId: 'POOL_AURA_RETH_ETH',
        chain: 1,
        contractAddress: POOL_AURA_RETH_ETH, 
        method: methods.getAuraPoolBalance,
        threshold: 55,
        params: [AURA_RETH_POOL_ID, AURA_RETH_TOKENS],
        needPrice: false,
        message: `Доля "AURA rETH" превышает {threshold}% от общего баланса в пуле aura. Доля "AURA rETH": {percent}% `,
        status: true,
    }, 
]