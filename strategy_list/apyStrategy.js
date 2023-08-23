import * as methods from "../APY/apyMethods.js"

// AURA 
const AURA_REWARD = '0x744Be650cea753de1e69BF6BAd3c98490A855f52';

// AURA_WSTETHETH
const AURA_WSTETHETH_BAL_REWARD = '0x59d66c58e83a26d6a0e35114323f65c3945c89c1';

// AURA_RETHETH
const AURA_RETHETH_BAL_REWARD = '0xdd1fe5ad401d4777ce89959b7fa587e569bf125d';
const AURA_RETHETH_TVL = '0x1e19cf2d73a72ef1332c882f20534b6519be0276';
const TVL_109 = '0x9497df26e5bD669Cb925eC68E730492b9300c482';

// AURA_BAL
const AURA_BAL_REWARD = '0x00A7BA8Ae7bca0B10A32Ea1f8e2a1Da980c6CAd2';
const AURA_BAL_TVL = '0xfaa2ed111b4f580fcb85c48e6dc6782dc5fcd7a6';

// AURA_AURAWETH
const AURA_AURAWETH_BAL_REWARD = '0x1204f5060be8b716f5a62b4df4ce32acd01a69f5';
const ASSET = '0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9';
const TVL_100 = '0x0665BC4e218CaA5A3b2Ca839EEf9B8F342cd5C58';

// AURA_TRI_POOL
const AURA_TRI_POOL_BAL_REWARD = '0x032b676d5d55e8ecbae88ebee0aa10fb5f72f6cb';
const TVL_139 = '0xe1faC5eCe66E6bb5CC9e6869343023599D142a6E';

// FRAX_SFRXETHETH
const FRAX_SFRXETHETH = '0xac3e018457b222d93114458476f3e3416abbe38f';

// convex 
const booster = '0xF403C135812408BFbE8713b5A23a04b3D48AAE31';

// CONVEX_FXS
const CONVEX_FXS = '0xf27AFAD0142393e4b3E5510aBc5fe3743Ad669Cb'; // crvRewards
const CONVEX_FXS_TVL = '0xd658a338613198204dca1143ac3f01a722b5d94a';

// CONVEX_CVX
const CONVEX_CVX = '0xb1Fb0BA0676A1fFA83882c7F4805408bA232C1fA';
// const CONVEX_CVX_TVL = '0x3A283D9c08E8b55966afb64C515f5143cf907611';
const CONVEX_CVX_TVL = '0xb576491f1e6e5e62f1d8f26062ee822b40b0e0d4';

// YEARN_YCRV
const YEARN_YCRV = '0x27B5739e22ad9033bcBf192059122d163b60349D';

// GMX_GMX
const GMX_GMX = '0xd2D1162512F927a7e282Ef43a362659E4F2a728F';

// GAINS_GNS
const GAINS_GNS = '0x6B8D3C08072a020aC065c467ce922e3A36D3F9d6';
const GNS_USER_ADDRESS = '0x4da9fb66734f9d7936232bcf64dacc24406595c1';
const GNS_TVL = '0x18c11FD286C5EC11c3b683Caa813B77f5163A122';

// GMD_STAKING
const GMD_STAKING = '0x48C81451D1FDdecA84b47ff86F91708fa5c32e93';
const GMD_TOKEN = '0x4945970efeec98d393b4b979b9be265a3ae28a8b';


export const strategies = [
    /* {
        strategy_id: 'AURA_WSTETHETH',
        strategy_addr: '0x1CB7385AbAF068bD22af4A4D364dE6e583dfce4e',
        vault_addr: '0x3edbE670D03C4A71367dedA78E73EA4f8d68F2E4',
        chain: 1,
        method: methods.getAuraApyLp,
        params: [AURA_WSTETHETH_BAL_REWARD, AURA_REWARD, null]
    }, */
     {
        strategy_id: 'AURA_RETHETH',
        strategy_addr: '0x13e19efAC9C07D3F167B2e861bbfe1d3E68971CC',
        vault_addr: '0x3edbE670D03C4A71367dedA78E73EA4f8d68F2E4',
        chain: 1,
        method: methods.getAuraApyLp,
        params: [AURA_RETHETH_BAL_REWARD, AURA_REWARD, TVL_109, null, '109']
    },
    {
        strategy_id: 'AURA_AURAWETH',
        strategy_addr: '0x589f347f67D55cfd0c053b6B569ada34Ac8a1e47',
        vault_addr: '0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B',
        chain: 1,
        method: methods.getAuraApyLp,
        params: [AURA_AURAWETH_BAL_REWARD,
            AURA_REWARD, TVL_100, ASSET, '100']

    }, 
    {
        strategy_id: 'AURA_TRI_POOL',
        strategy_addr: '0x3832189aBf3f9796dF1Cb9916971C9C03869F3c3',
        vault_addr: '0x3edbE670D03C4A71367dedA78E73EA4f8d68F2E4', 
        chain: 1,
        method: methods.getAuraApyLp,
        params: [AURA_TRI_POOL_BAL_REWARD, AURA_REWARD, TVL_139, null, '139']
    },
    {
        strategy_id: 'AURA_BAL',
        strategy_addr: '0xae60bf4746c9fc06041207da3ce471e2e375274c',
        vault_addr: '0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B',
        chain: 1,
        method: methods.getAuraApyStaked,
        params: [AURA_BAL_REWARD, AURA_REWARD, AURA_BAL_TVL, 'auraBal']
    },
    

    /* {
        strategy_id: 'CONVEX_FXS',
        strategy_addr: '0x18b9430d9ab251f7C27b7F2E922d2b0AF7506526',//'0x186C4d1CDDD405E15525DF03f21E3705B9d4F659',
        vault_addr: '0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B',
        chain: 1,
        method: methods.getConvexApy,
        params: [booster, CONVEX_FXS, CONVEX_FXS_TVL, ['frax-share', 'convex-fxs']]
    }, */
    {
        strategy_id: 'CONVEX_CVX',
        strategy_addr: '0x10e17b5aDbccb8B8E9657Fb1Fa5a688f58D88850', // '0xE60343a903F0a3122F73B5D2BB9E1bC9491dbf01',
        vault_addr: '0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B',
        chain: 1,
        method: methods.getConvexApy,
        params: [booster, CONVEX_CVX, CONVEX_CVX_TVL, ['ethereum', 'curve-dao-token']]
    },
    {
        strategy_id: 'GMX_GMX',
        strategy_addr: '0x8e84FA3F87C4965F91EF5b218891295515d62E85',
        vault_addr: '0xBE55f53aD3B48B3ca785299f763d39e8a12B1f98',
        chain: 42161,
        method: methods.getGmxApy,
        params: [GMX_GMX]

    },
    {
        strategy_id: 'FRAX_SFRXETHETH',
        strategy_addr: '0xcca81Ea593FEa25f45DCCF034bD12391a8f64BB3',
        vault_addr: '0x3edbE670D03C4A71367dedA78E73EA4f8d68F2E4',
        chain: 1,
        method: methods.getFraxApy,
        params: [FRAX_SFRXETHETH]
    },
    {
        strategy_id: 'GMD_STAKING',
        strategy_addr: '0xC9FDdB51E0EfFb94adbe13E1118Ec5530bb733B0',
        vault_addr: '0xBE55f53aD3B48B3ca785299f763d39e8a12B1f98',
        chain: 42161,
        method: methods.getGmdStakingApy,
        params: [GMD_STAKING, GMD_TOKEN]

    },
    {
        strategy_id: 'YEARN_YCRV',
        strategy_addr: '0x3E5e9B5E4C08f1d0E7d5a75204edcd57e44ee2cf',//'0x4DDeD4525dE7a38AE9273634914194B46d21041a',
        vault_addr: '0xf62A24EbE766d0dA04C9e2aeeCd5E86Fac049B7B',
        chain: 1,
        method: methods.getYearnApy,
        params: [YEARN_YCRV]

    },
    {
        strategy_id: 'GAINS_GNS',
        strategy_addr: '0x18b9430d9ab251f7C27b7F2E922d2b0AF7506526',
        vault_addr: '0xBE55f53aD3B48B3ca785299f763d39e8a12B1f98',
        chain: 42161,
        method: methods.getGnsApy,
        params: [GAINS_GNS, GNS_TVL]

    }, 
   /*  {
        strategy_id: 'JOE',
        strategy_addr: '0xcA16676Ba8512688884195B611aE1C00Ff2F3183',
        vault_addr: '0xBE55f53aD3B48B3ca785299f763d39e8a12B1f98',
        chain: 42161,
        method: undefined,//methods.getGnsApy,
        params: []

    },
 */
]