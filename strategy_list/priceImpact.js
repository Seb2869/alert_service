const arbUSDC = '0xaf88d065e77c8cc2239327c5edb3a432268e5831';
const ethUSDC = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const wETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const ETH = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';

export const swapPrice = [
  {
    tokenAName: 'rETH',
    fromToken: '0xae78736cd615f374d3085123a210448e74fc6393',
    tokenBName: 'ETH',
    toToken: ETH,
    amount1: '60000000000000000000',
    amount0: '6000000000000000',
    chain: 1,
  },
  {
    tokenAName: 'frxETH',
    fromToken: '0x5e8422345238f34275888049021821e8e08caa1f',
    tokenBName: 'ETH',
    toToken: ETH,
    amount1: '60000000000000000000',
    amount0: '6000000000000000',
    chain: 1
  },
   {
    tokenAName: 'yCRV',
    fromToken: '0xfcc5c47be19d06bf83eb04298b026f81069ff65b',
    tokenBName: 'CRV',
    amount1: '127305000000000000000000',
    amount0: '12730500000000000000',
    toToken: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    chain: 1
  },
  {
    tokenAName: 'CRV',
    fromToken: '0xd533a949740bb3306d119cc777fa900ba034cd52',
    tokenBName: 'USDC',
    amount1: '127305000000000000000000',
    amount0: '12730500000000000000',
    toToken: ethUSDC,
    chain: 1
  },
  {
    tokenAName: 'FXS',
    fromToken: '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0',
    tokenBName: 'USDC',
    amount1: '10400000000000000000000',
    amount0: '1040000000000000000',
    toToken: ethUSDC,
    chain: 1
  },
  {
    tokenAName: 'AURA',
    fromToken: '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf',
    tokenBName: 'USDC',
    amount1: '60000000000000000000000',
    amount0: '6000000000000000000',
    toToken: ethUSDC,
    chain: 1
  },
  {
    tokenAName: 'auraBAL',
    fromToken: '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d',
    tokenBName: 'USDC',
    amount1: '6000000000000000000000',
    amount0: '600000000000000000',
    toToken: ethUSDC,
    chain: 1
  },
  {
    tokenAName: 'CVX',
    fromToken: '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b',
    tokenBName: 'ETH',
    amount1: '20000000000000000000000',
    amount0: '2000000000000000000',
    toToken: ETH,
    chain: 1
  },
  {
    tokenAName: 'GMX',
    fromToken: '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a',
    tokenBName: 'USDC',
    amount1: '700000000000000000000',
    amount0: '70000000000000000',
    toToken: arbUSDC,
    chain: 42161
  },
  {
    tokenAName: 'GNS',
    fromToken: '0x18c11fd286c5ec11c3b683caa813b77f5163a122',
    tokenBName: 'USDC',
    amount1: '700000000000000000000',
    amount0: '70000000000000000',
    toToken: arbUSDC,
    chain: 42161
  },
  {
    tokenAName: 'JOE',
    fromToken: '0x371c7ec6D8039ff7933a2AA28EB827Ffe1F52f07',
    tokenBName: 'USDC',
    amount1: '80000000000000000000000',
    amount0: '8000000000000000000',
    toToken: arbUSDC,
    chain: 42161
  },
  {
    tokenAName: 'GMD',
    fromToken: '0x4945970EfeEc98D393b4b979b9bE265A3aE28A8B',
    tokenBName: 'USDC',
    amount1: '600000000000000000000',
    amount0: '60000000000000000',
    toToken: arbUSDC,
    chain: 42161
  } 
]
