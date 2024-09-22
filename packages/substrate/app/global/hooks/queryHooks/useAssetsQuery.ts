// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@sdk/polkasafe-sdk/src/constants/pagination';
import { useAssets } from '@substrate/app/atoms/assets/assetsAtom';
import { useAllCurrencyPrice } from '@substrate/app/atoms/currency/currencyAtom';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface IUseHistoryTransaction {
	multisigIds: Array<string>;
	page?: number;
	limit?: number;
}

export function useAssetsQuery() {
	const [organisation] = useOrganisation();
	const { getApi } = useAllAPI();
	const [allCurrencyData, setAllCurrencyData] = useAllCurrencyPrice();

	const handleOrganisationAssets = async () => {
		if (!organisation) {
			return;
		}
		let currencyData = allCurrencyData;
		if (!currencyData) {
			const {
				data: { data }
			} = await axios.get(window.location.origin + '/api/v1/currencyData');
			setAllCurrencyData(data);
			currencyData = data;
		}

		const { multisigs } = organisation;
		const assetsPromise = multisigs.map(async (m) => {
			const { address, network, proxy } = m;
			const networkApi = getApi(network);
			if (!networkApi) {
				return null;
			}
			const { api, apiReady } = networkApi;
			if (!api || !apiReady) {
				return null;
			}
			const { data: balanceWithDecimals } = (await api.query.system.account(address)) as unknown as {
				data: any;
			};
			const balance = {} as any;
			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.entries(JSON.parse(JSON.stringify(balanceWithDecimals.toHuman())))) {
				balance[key] = formatBalance(
					String(value),
					{
						numberAfterComma: 3,
						withThousandDelimitor: true
					},
					network
				);
			}
			const usdValue = Number(currencyData?.[network]?.usd || 0) * Number(balance.free);
			const allCurrency: any = {};
			Object.keys(currencyData).map((network) => {
				const allCurrencyValue: any = {};
				Object.keys(currencyData?.[network] || {}).map((currency) => {
					allCurrencyValue[currency] = Number(currencyData?.[network]?.[currency] || 0) * Number(balance.free);
				});
				allCurrency[network] = allCurrencyValue;
			});
			const proxyAssetsPromise = (proxy || []).map(async (p) => {
				const { address: proxyAddress } = p;
				const { data: proxyBalanceWithDecimals } = (await api.query.system.account(proxyAddress)) as unknown as {
					data: any;
				};
				const proxyBalance = {} as any;
				// eslint-disable-next-line no-restricted-syntax
				for (const [key, value] of Object.entries(JSON.parse(JSON.stringify(proxyBalanceWithDecimals.toHuman())))) {
					proxyBalance[key] = formatBalance(
						String(value),
						{
							numberAfterComma: 3,
							withThousandDelimitor: true
						},
						network
					);
				}
				const usdValue = Number(currencyData?.[network]?.usd || 0) * Number(proxyBalance.free);
				const allCurrency: any = {};
				Object.keys(currencyData).map((network) => {
					const allCurrencyValue: any = {};
					Object.keys(currencyData?.[network] || {}).map((currency) => {
						allCurrencyValue[currency] = Number(currencyData?.[network]?.[currency] || 0) * Number(proxyBalance.free);
					});
					allCurrency[network] = allCurrencyValue;
				});
				return {
					...proxyBalance,
					usd: Number(usdValue.toFixed(3)),
					allCurrency,
					proxyAddress,
					address,
					network,
					symbol: networkConstants[network].tokenSymbol
				};
			});
			const proxyAssets = (await Promise.all(proxyAssetsPromise)).filter((a) => Boolean(a));

			return [
				{
					...balance,
					usd: Number(usdValue.toFixed(3)),
					allCurrency,
					address,
					network,
					symbol: networkConstants[network].tokenSymbol,
					proxy: proxyAssets
				}
			];
		});

		const assets = (await Promise.all(assetsPromise)).flat().filter((a) => Boolean(a));
		console.log('assets', JSON.stringify(assets));
		return assets;
	};
	return useQuery({
		queryKey: [
			`multisig_balances${JSON.stringify(organisation?.multisigs.map((m) => `${m.address}_${m.network}`) || [])}`
		],
		queryFn: handleOrganisationAssets,
		enabled: Boolean(organisation && Boolean(organisation.multisigs.length)),
		refetchOnWindowFocus: false
	});
}
