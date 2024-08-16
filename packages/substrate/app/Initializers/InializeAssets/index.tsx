// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue, useSetAtom } from 'jotai/react';
import { PropsWithChildren, useEffect } from 'react';
import { apiAtom } from '@substrate/app/atoms/api/apiAtom';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
import axios from 'axios';
import { chainProperties, networks } from '@common/constants/substrateNetworkConstant';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';

function InitializeAssets({ children }: PropsWithChildren) {
	const organisation = useAtomValue(organisationAtom);
	const apis = useAtomValue(apiAtom);
	const setAtom = useSetAtom(assetsAtom);

	const handleOrganisation = async () => {
		if (!apis || !organisation) {
			return;
		}
		const usedValueData = await axios.get(
			`https://api.coingecko.com/api/v3/simple/price?ids=${Object.values(networks).join(',')}&vs_currencies=usd`
		);

		const { multisigs } = organisation;
		const assetsPromise = multisigs.map(async (m) => {
			const { address, network } = m;
			const { api, apiReady } = apis[network];
			if (!api || !apiReady) {
				return null;
			}
			const { data: balanceWithDecimals } = (await api.query.system.account(address)) as unknown as {
				data: {
					free: string;
					reserved: string;
					frozen: string;
					flags: string;
				};
			};
			const balance = {} as any;
			// eslint-disable-next-line no-restricted-syntax
			for (const [key, value] of Object.entries(balanceWithDecimals)) {
				balance[key] = formatBalance(value, chainProperties[network].tokenDecimals, {
					numberAfterComma: 3,
					withThousandDelimitor: false
				});
			}
			const usedValue =
				Number(usedValueData?.data?.[network]?.usd || 0) *
				Number(
					formatBalance(balance.free, chainProperties[network].tokenDecimals, {
						numberAfterComma: 3,
						withThousandDelimitor: false
					})
				);
			return { ...balance, usd: usedValue, address, symbol: chainProperties[network].tokenSymbol };
		});

		const assets = await Promise.all(assetsPromise);
		setAtom(assets);
	};

	useEffect(() => {
		if (!organisation) {
			return;
		}
		handleOrganisation();
	}, [organisation]);

	return children;
}

export default InitializeAssets;
