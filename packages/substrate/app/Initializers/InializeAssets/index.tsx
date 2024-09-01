// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { PropsWithChildren, useCallback, useEffect } from 'react';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
// import axios from 'axios';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';
// import { ENetwork } from '@common/enum/substrate';
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';

function InitializeAssets({ children }: PropsWithChildren) {
	const organisation = useAtomValue(organisationAtom);
	const { getApi } = useAllAPI();
	const setAtom = useSetAtom(assetsAtom);

	const handleOrganisationAssets = useCallback(async () => {
		if (!organisation) {
			return;
		}
		// const usedValueData = await axios.get(
		// 	`https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(ENetwork).join(',')}&vs_currencies=usd`
		// );

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
			for (const [key, value] of Object.entries(JSON.parse(balanceWithDecimals.toString()))) {
				balance[key] = formatBalance(String(value), networkConstants[network].tokenDecimals, {
					numberAfterComma: 3,
					withThousandDelimitor: false
				});
			}
			const usedValue =
				// Number(usedValueData?.data?.[network]?.usd || 0) *
				Number(0) *
				Number(
					formatBalance(balance.free, networkConstants[network].tokenDecimals, {
						numberAfterComma: 3,
						withThousandDelimitor: false
					})
				);
			return { ...balance, usd: usedValue, address, symbol: networkConstants[network].tokenSymbol };
		});

		const assets = await Promise.all(assetsPromise);
		setAtom(assets);
	}, [getApi, organisation, setAtom]);

	useEffect(() => {
		if (!organisation) {
			return;
		}
		handleOrganisationAssets();
	}, [handleOrganisationAssets, organisation]);

	return children;
}

export default InitializeAssets;
