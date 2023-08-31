// AURA_WSTETHETH
const AURA_WSTETHETH_TVL = '0x32296969ef14eb0c6d29669c550d4a0449130230'

// AURA_RETHETH
const AURA_RETHETH_TVL = '0x1e19cf2d73a72ef1332c882f20534b6519be0276'

// AURA_BAL
const AURA_BAL_TVL = '0xfaa2ed111b4f580fcb85c48e6dc6782dc5fcd7a6'

// AURA_AURAWETH
const AURA_AURAWETH_TVL = '0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9'

// FRAX_SFRXETHETH
const FRAX_SFRXETHETH_TVL = '0xac3e018457b222d93114458476f3e3416abbe38f'

// CONVEX_FXS
const CONVEX_FXS_TVL = '0xF3A43307DcAFa93275993862Aae628fCB50dC768'

// CONVEX_CVX
const CONVEX_CVX_TVL = '0x3A283D9c08E8b55966afb64C515f5143cf907611'

// YEARN_YCRV
const YEARN_YCRV_TVL = '0x27B5739e22ad9033bcBf192059122d163b60349D'

// GMX_GMX
const GMX_TVL = '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a'
const GMX_ADDRESS = '0x908C4D94D34924765f1eDc22A1DD098397c59dD4'

// GAINS_GNS
const GNS_TVL = '0x18c11FD286C5EC11c3b683Caa813B77f5163A122'
const GNS_ADDRESS = '0x6B8D3C08072a020aC065c467ce922e3A36D3F9d6'

// GMD_STAKING
const GMD_TVL = '0x4945970EfeEc98D393b4b979b9bE265A3aE28A8B'
const GMD_ADDRESS = '0x48c81451d1fddeca84b47ff86f91708fa5c32e93'

// SJOE_STAKING
const SJOE_TVL = '0x43646A8e839B2f2766392C1BF8f60F6e587B6960'

const totalSupplyAbi = [
  `function totalSupply() external view returns (uint256)`
]

const balanceOfAbi = [
  `function balanceOf(address) external view returns (uint256)`
]

const totalAssetsAbi = [
  `function totalAssets() external view returns (uint256)`
]

const joeBalanceAbi = [
  `function internalJoeBalance() external view returns (uint256)`
]

export const strategiesTVL = [
  /*  {
        strategy_id: 'AURA_WSTETHETH',
        chain: 1,
        contractAddress: AURA_WSTETHETH_TVL, 
        abi: totalSupplyAbi,
        method: 'totalSupply',
    }, */
  {
    strategy_id: 'AURA_RETHETH',
    chain: 1,
    contractAddress: AURA_RETHETH_TVL,
    abi: totalSupplyAbi,
    method: 'totalSupply'
  },
  {
    strategy_id: 'AURA_AURAWETH',
    chain: 1,
    contractAddress: AURA_AURAWETH_TVL,
    abi: totalSupplyAbi,
    method: 'totalSupply'
  },
  {
    strategy_id: 'AURA_BAL',
    chain: 1,
    contractAddress: AURA_BAL_TVL,
    abi: totalSupplyAbi,
    method: 'totalSupply'
  },
  {
    strategy_id: 'CONVEX_FXS',
    chain: 1,
    contractAddress: CONVEX_FXS_TVL,
    abi: totalSupplyAbi,
    method: 'totalSupply'
  },
  {
    strategy_id: 'CONVEX_CVX',
    chain: 1,
    contractAddress: CONVEX_CVX_TVL,
    abi: totalSupplyAbi,
    method: 'totalSupply'
  },
  {
    strategy_id: 'GMX_GMX',
    chain: 42161,
    contractAddress: GMX_TVL,
    abi: balanceOfAbi,
    method: 'balanceOf',
    params: [GMX_ADDRESS]
  },
  {
    strategy_id: 'FRAX_SFRXETHETH',
    chain: 1,
    contractAddress: FRAX_SFRXETHETH_TVL,
    abi: totalAssetsAbi,
    method: 'totalAssets'
  },
  {
    strategy_id: 'GMD_STAKING',
    chain: 42161,
    contractAddress: GMD_TVL,
    abi: balanceOfAbi,
    method: 'balanceOf',
    params: [GMD_ADDRESS]
  },
  {
    strategy_id: 'YEARN_YCRV',
    chain: 1,
    contractAddress: YEARN_YCRV_TVL,
    abi: totalAssetsAbi,
    method: 'totalAssets'
  },
  {
    strategy_id: 'GAINS_GNS',
    chain: 42161,
    contractAddress: GNS_TVL,
    abi: balanceOfAbi,
    method: 'balanceOf',
    params: [GNS_ADDRESS]
  },
  {
    strategy_id: 'SJOE_STAKING',
    chain: 42161,
    contractAddress: SJOE_TVL,
    abi: joeBalanceAbi,
    method: 'internalJoeBalance'
  }
]
