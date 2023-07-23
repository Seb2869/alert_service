import * as methods from "./apyMethods.js"

// AURA 
const AURA_REWARD = '0x744Be650cea753de1e69BF6BAd3c98490A855f52';

// AURA_WSTETHETH
/* const AURA_WSTETHETH_BAL_REWARD = '0xe4683fe8f53da14ca5dac4251eadfb3aa614d528';
const AURA_WSTETHETH_TVL = '0x32296969ef14eb0c6d29669c550d4a0449130230'; */
const AURA_WSTETHETH_BAL_REWARD = '0x59d66c58e83a26d6a0e35114323f65c3945c89c1'; 
const AURA_WSTETHETH_TVL = '0x32296969ef14eb0c6d29669c550d4a0449130230';


// AURA_RETHETH
// const AURA_RETHETH_BAL_REWARD = '0x001b78cec62dcfdc660e06a91eb1bc966541d758';
const AURA_RETHETH_BAL_REWARD = '0xdd1fe5ad401d4777ce89959b7fa587e569bf125d';
const AURA_RETHETH_TVL = '0x1e19cf2d73a72ef1332c882f20534b6519be0276';

// AURA_BAL
const AURA_BAL_REWARD = '0xac16927429c5c7af63dd75bc9d8a58c63ffd0147';
const AURA_BAL_TVL = '0xfaa2ed111b4f580fcb85c48e6dc6782dc5fcd7a6';

// AURA_AURAWETH
const AURA_AURAWETH_BAL_REWARD = '0x1204f5060be8b716f5a62b4df4ce32acd01a69f5';
const AURA_AURAWETH_TVL = '0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9';
const ASSET = '0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9';
const VAULT = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const ID = '0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9000200000000000000000274';

// FRAX_SFRXETHETH
const FRAX_SFRXETHETH = '0xac3e018457b222d93114458476f3e3416abbe38f';

// CONVEX_FXS
const CONVEX_FXS = '0xf27AFAD0142393e4b3E5510aBc5fe3743Ad669Cb';
const CONVEX_FXS_TVL = '0xF3A43307DcAFa93275993862Aae628fCB50dC768';

// CONVEX_CVX
const CONVEX_CVX = '0xb1Fb0BA0676A1fFA83882c7F4805408bA232C1fA';
const CONVEX_CVX_TVL = '0x3A283D9c08E8b55966afb64C515f5143cf907611';

// YEARN_YCRV
const YEARN_YCRV = '0x27B5739e22ad9033bcBf192059122d163b60349D';

// GMX_GMX
const GMX_GMX = '0xd2D1162512F927a7e282Ef43a362659E4F2a728F';
const GMX_TVL = '0xfc5A1A6EB076a2C7aD06eD22C90d7E710E35ad0a';
const GMX_USER_ADDRESS = '0x908C4D94D34924765f1eDc22A1DD098397c59dD4';


// GAINS_GNS
const GAINS_GNS = '0x6B8D3C08072a020aC065c467ce922e3A36D3F9d6';
const GNS_USER_ADDRESS = '0x4da9fb66734f9d7936232bcf64dacc24406595c1';
const GNS_TVL = '0x18c11FD286C5EC11c3b683Caa813B77f5163A122';


// GMD_STAKING
const GMD_STAKING = '0x48C81451D1FDdecA84b47ff86F91708fa5c32e93';
const GMD_TOKEN = '0x4945970efeec98d393b4b979b9be265a3ae28a8b';
const GMD_USER_ADDRESS = '0x48C81451D1FDdecA84b47ff86F91708fa5c32e93';

export const strategies = [
     {
        strategy_id: 'AURA_WSTETHETH',
        chain: 1,
        method: methods.getAuraApyLp,
        params: [AURA_WSTETHETH_BAL_REWARD, AURA_REWARD, null]
    },
    {
        strategy_id: 'AURA_RETHETH',
        chain: 1,
        method: methods.getAuraApyLp,
        params: [AURA_RETHETH_BAL_REWARD, AURA_REWARD, null]
    },
    {
        strategy_id: 'AURA_AURAWETH',
        chain: 1,
        method: methods.getAuraApyLp,
        params: [AURA_AURAWETH_BAL_REWARD,
            AURA_REWARD, ASSET]
        /* params: [AURA_AURAWETH_BAL_REWARD,
            AURA_REWARD,
            VAULT,
            ID] */
    },
    {
        strategy_id: 'AURA_BAL',
        chain: 1,
        method: methods.getAuraApyStaked,
        params: [AURA_BAL_REWARD, AURA_REWARD, AURA_BAL_TVL]
    },
    {
        strategy_id: 'CONVEX_FXS',
        chain: 1,
        method: methods.getConvexApy,
        params: [CONVEX_FXS, CONVEX_FXS_TVL]
    },
    {
        strategy_id: 'CONVEX_CVX',
        chain: 1,
        method: methods.getConvexApy,
        params: [CONVEX_CVX, CONVEX_CVX_TVL]
    }, 
     {
        strategy_id: 'FRAX_SFRXETHETH',
        chain: 1,
        method: methods.getFraxApy,
        params: [FRAX_SFRXETHETH]
    },
    {
        strategy_id: 'GMD_STAKING',
        chain: 42161,
        method: methods.getGmdStakingApy,
        params: [GMD_STAKING, GMD_TOKEN, GMD_USER_ADDRESS]

    }, 
    {
        strategy_id: 'GMX_GMX',
        chain: 42161,
        method: methods.getGmxApy ,
        params: [GMX_GMX, GMX_TVL, GMX_USER_ADDRESS]

    },  
    /* 
   
    {
        strategy_id: 'YEARN_YCRV',
        chain: 1,
        method: methods.getYEARN_YCRV_APY,
        params: [YEARN_YCRV]

    },
    {
        strategy_id: 'GAINS_GNS',
        chain: 42161,
        method: methods.getGAINS_GNS_APY,
        params: [GAINS_GNS, GNS_USER_ADDRESS, GNS_TVL]

    },
  */
]