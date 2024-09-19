// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useSetAtom } from 'jotai/react';
import { useCallback, useEffect } from 'react';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
// import axios from 'axios';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';
// import { ENetwork } from '@common/enum/substrate';
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import axios from 'axios';

function InitializeAssets() {
	const [organisation] = useOrganisation();
	const { getApi } = useAllAPI();
	const setAtom = useSetAtom(assetsAtom);

	useEffect(() => {
		if (!organisation) {
			return;
		}
		const handleOrganisationAssets = async () => {
			if (!organisation) {
				return;
			}
			const {
				data: { data: currencyData }
			} = await axios.get(window.location.origin + '/api/v1/currencyData');

			const { multisigs } = organisation;
			const assetsPromise = multisigs.map(async (m) => {
				const { address, network } = m;
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
				return {
					...balance,
					usd: Number(usdValue.toFixed(3)),
					allCurrency,
					address,
					network,
					symbol: networkConstants[network].tokenSymbol
				};
			});

			const assets = (await Promise.all(assetsPromise)).filter((a) => Boolean(a));
			setAtom(assets);
		};
		handleOrganisationAssets();
	}, [organisation]);

	return null;
}

export default InitializeAssets;
