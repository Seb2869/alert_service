import { getTotalAssetsTVL } from "../apyTvlMethods.js";

export const getYearnApy = async (provider, YEARN_CONTRACT, prices) => {
	try  {
    const response = await fetch('https://ydaemon.yearn.finance/1/vaults/0x27B5739e22ad9033bcBf192059122d163b60349D');
    const responseText = await response.text();
    const data = JSON.parse(responseText);
    const tvl = data.tvl.tvl;
    const apy = data.apr.netAPR * 100;
    return [apy, tvl]
	}
	catch (e) {
		console.log("getYearnApy", e);
		return [undefined, undefined] 
	}


}

// https://ydaemon.yearn.finance/1/vaults/0x27B5739e22ad9033bcBf192059122d163b60349D


/* ppsWeekAgo := helpers.GetLastWeek(ppsPerTime, vault.Decimals)
		ppsMonthAgo := helpers.GetLastMonth(ppsPerTime, vault.Decimals)

		vaultPerformanceFee := helpers.ToNormalizedAmount(bigNumber.NewInt(int64(vault.PerformanceFee)), 4)
		vaultManagementFee := helpers.ToNormalizedAmount(bigNumber.NewInt(int64(vault.ManagementFee)), 4)
		oneMinusPerfFee := bigNumber.NewFloat(0).Sub(bigNumber.NewFloat(1), vaultPerformanceFee)
		grossAPR := helpers.GetAPR(ppsToday, ppsMonthAgo, bigNumber.NewFloat(30))
		netAPR := bigNumber.NewFloat(0).Mul(grossAPR, oneMinusPerfFee)
		netAPR = bigNumber.NewFloat(0).Sub(netAPR, vaultManagementFee)


// grossAPR := helpers.GetAPR(ppsToday, ppsMonthAgo, bigNumber.NewFloat(30))
//		netAPR := bigNumber.NewFloat(0).Mul(grossAPR, oneMinusPerfFee)
//		netAPR = bigNumber.NewFloat(0).Sub(netAPR, vaultManagementFee)
// */