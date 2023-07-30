import { ethers } from "ethers";
import { getConvexPoolList, getConvexGauges, getCurveApy } from "../../utils/utils.js";
import { getPriceForContract } from "../../utils/price.js";
import { getConvexTvl } from "../apyTvlMethods.js";


export const getConvexApy = async (provider, booster, CONVEX_CONTRACT, CONVEX_TVL, tokens, prices) => {
    const convexContactABI = [
        `function rewardRate() external view returns (uint256)`,
        `function rewardToken() external view returns (address)`,
        `function periodFinish() external view returns (uint256)`,
        `function extraRewardsLength() external view returns (uint256)`,
        `function extraRewards(uint256) external view returns (address)`,
        `function asset() external view returns (address)`,
        `function pid() external view returns (uint256)`,
    ];
    const boosterABI = [
        `function poolInfo(uint256) external view returns 
        (address lptoken,address token, address gauge, address crvRewards, address stash, bool shutdown)`,
    ];
    const tokenABI = [
        `function totalSupply() external view returns (uint256)`,
        `function decimals() external view returns (uint8)`,

    ]
    const cliffSize = 100000; // * 1e18; //new cliff every 100,000 tokens
    const cliffCount = 1000; // 1,000 cliffs
    const maxSupply = 100000000; // * 1e18; //100 mil max supply
    const projectedAprTvlThr = 1e6;

    const cvxAddress = '0x4e3FBD56CD56c3e72c1403e103b45Db9da5B9D2B';

    const rewardContract = new ethers.Contract(CONVEX_CONTRACT, convexContactABI, provider);
    const periodFinish = (await rewardContract.periodFinish()).toString();
    const pid = (await rewardContract.pid()).toString();
    const boosterContract = new ethers.Contract(booster, boosterABI, provider);

    const { lptoken, token, gauge, crvRewards, stash, shutdown } = await boosterContract.poolInfo(pid);
    const poolInfo = {
        lptoken,
        token,
        gauge,
        crvRewards,
        stash,
        shutdown
    };
    const poolsList = await getConvexPoolList();
    const mappedGauges = await getConvexGauges();
    const extPool = poolsList.find(
        ({ address, lpTokenAddress, gaugeAddress }) =>
            address.toLowerCase() === poolInfo.lptoken.toLowerCase() ||
            poolInfo.lptoken.toLowerCase() === (lpTokenAddress || '').toLowerCase() ||
            (gaugeAddress || '').toLowerCase() === poolInfo.gauge.toLowerCase()
    );
    const pool = { ...poolInfo, ...extPool };

    const tokenContract = new ethers.Contract(pool.token, tokenABI, provider);
    const totalSupply = (await tokenContract.totalSupply()).toString();
    const decimals = (await tokenContract.decimals()).toString();

    const cvxTvl = getConvexTvl(pool, mappedGauges, totalSupply, decimals);
    if (cvxTvl) {
        const cvxContract = new ethers.Contract(cvxAddress, tokenABI, provider);
        const cvxSupply = ethers.formatEther(await cvxContract.totalSupply());

        const currentTime = (new Date().getTime()) / 1000; // Get the current date in milliseconds
        const isFinished = +currentTime > +periodFinish;
        const rewardRateRaw = await rewardContract.rewardRate();
        const rewardRate = parseFloat(ethers.formatEther(rewardRateRaw));

        // const price0 = prices[tokens[0]] ? prices[tokens[0]]['usd'] : 0;
        // const price1 = prices[tokens[1]] ? prices[tokens[1]]['usd'] : 0;
        // const tvl = await getCVXBalanceTVL(provider, CONVEX_TVL, [price0, price1]);
        const priceCRV = prices['curve-dao-token'] ? prices['curve-dao-token']['usd'] : 0;
        const priceCVX = prices['convex-finance'] ? prices['convex-finance']['usd'] : 0;
        const pricecvxCRV = prices['convex-crv'] ? prices['convex-crv']['usd'] : 0;

        const crvPerUnderlying = rewardRate;
        const crvPerYear = crvPerUnderlying * 86400 * 365;
        let cvxPerYear;

        const currentCliff = cvxSupply / cliffSize;
        if (currentCliff < cliffCount) {

            let remaining = cliffCount - currentCliff;
            let cvxEarned = (crvPerYear * remaining) / cliffCount;
            let amountTillMax = maxSupply - cvxSupply;
            if (cvxEarned > amountTillMax) {
                cvxEarned = amountTillMax;
            }
            cvxPerYear = cvxEarned;
        } else {
            cvxPerYear = 0;
        }

        let apr = (cvxPerYear * priceCVX * 100) / cvxTvl;
        let crvApr =
            pool.lptoken === cvxAddress
                ? (crvPerYear * pricecvxCRV * 100) / cvxTvl
                : (crvPerYear * priceCRV * 100) / cvxTvl;

        apr = isFinished && pool.cvxTvl < projectedAprTvlThr ? 0 : apr;
        crvApr = isFinished && pool.cvxTvl < projectedAprTvlThr ? 0 : crvApr;

        let extraReward = 0;
        try {
            const numberExtraReward = (await rewardContract.extraRewardsLength()).toString();
            for (let i = 0; i < parseInt(numberExtraReward); i++) {
                const extraRewardAddress = await rewardContract.extraRewards(i);
                const extraRewardContract = new ethers.Contract(extraRewardAddress, convexContactABI, provider);
                const periodFinish = (await extraRewardContract.periodFinish()).toString();
                const currentTime = (new Date().getTime()) / 1000; // Get the current date in milliseconds
                const isFinished = +currentTime > +periodFinish;
                if (!isFinished) {
                    const rewardRateRaw = await extraRewardContract.rewardRate();
                    if (rewardRateRaw > 0) {
                        const rewardRate = ethers.formatEther(rewardRateRaw);
                        const baseToken = await extraRewardContract.rewardToken();

                        const rewardToken = new ethers.Contract(
                            baseToken,
                            [
                                `function name() external view returns (string)`,
                            ],
                            provider);
                        const name = await rewardToken.name();

                        const priceBaseToken = await getPriceForContract(baseToken);
                        const iterExtraReward = priceBaseToken ? 100 * (parseFloat(rewardRate) * (86400 * 365) * priceBaseToken) / cvxTvl : 0;
                        extraReward = extraReward + iterExtraReward;

                    }
                }
            }
        }
        catch (error) {
            console.log(error)
        }
        const curveApys = await getCurveApy();
        const baseApy = pool.id ? curveApys[pool.id]?.baseApy : 0;

        const apyReward =
            pool.lptoken === cvxAddress
                ? crvApr
                : crvApr + apr + extraReward + baseApy;

        return [apyReward, cvxTvl]
    }
    else return [0, 0];
}
