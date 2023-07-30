import * as methods from "../APY/apyMethods.js"

// AURA 
const AURA_REWARD = '0x744Be650cea753de1e69BF6BAd3c98490A855f52';

// AURA_WSTETHETH
const AURA_WSTETHETH_BAL_REWARD = '0x59d66c58e83a26d6a0e35114323f65c3945c89c1';

// AURA_RETHETH
const AURA_RETHETH_BAL_REWARD = '0xdd1fe5ad401d4777ce89959b7fa587e569bf125d';
const AURA_RETHETH_TVL = '0x1e19cf2d73a72ef1332c882f20534b6519be0276';

// AURA_BAL
const AURA_BAL_REWARD = '0x00A7BA8Ae7bca0B10A32Ea1f8e2a1Da980c6CAd2';
const AURA_BAL_TVL = '0xfaa2ed111b4f580fcb85c48e6dc6782dc5fcd7a6';

// AURA_AURAWETH
const AURA_AURAWETH_BAL_REWARD = '0x1204f5060be8b716f5a62b4df4ce32acd01a69f5';
const ASSET = '0xcfca23ca9ca720b6e98e3eb9b6aa0ffc4a5c08b9';

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
        params: [booster, CONVEX_FXS, CONVEX_FXS_TVL, ['frax-share', 'convex-fxs']]
    },
    {

        strategy_id: 'CONVEX_CVX',
        chain: 1,
        method: methods.getConvexApy,
        params: [booster, CONVEX_CVX, CONVEX_CVX_TVL, ['ethereum', 'curve-dao-token']]
    },
    {

        strategy_id: 'GMX_GMX',
        chain: 42161,
        method: methods.getGmxApy,
        params: [GMX_GMX]

    },
    {
        // сверено
        strategy_id: 'FRAX_SFRXETHETH',
        chain: 1,
        method: methods.getFraxApy,
        params: [FRAX_SFRXETHETH]
    },
    {

        strategy_id: 'GMD_STAKING',
        chain: 42161,
        method: methods.getGmdStakingApy,
        params: [GMD_STAKING, GMD_TOKEN]

    },
    {

        strategy_id: 'YEARN_YCRV',
        chain: 1,
        method: methods.getYearnApy,
        params: [YEARN_YCRV]

    },
    {
        strategy_id: 'GAINS_GNS',
        chain: 42161,
        method: methods.getGnsApy,
        params: [GAINS_GNS, GNS_TVL]

    },
]