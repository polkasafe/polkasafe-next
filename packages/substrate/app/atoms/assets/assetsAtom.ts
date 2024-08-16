// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable security/detect-object-injection */
/* eslint-disable no-restricted-syntax */

import { chainProperties, networks } from '@common/constants/substrateNetworkConstant';
import {
	polkadotApi,
	astarApi,
	availGoldbergApi,
	khalaApi,
	kusamaApi,
	phalaApi,
	rococoApi,
	assethubPolkadotApi,
	assethubKusamaApi,
	assethubRococoApi,
	availTuringApi,
	westendApi
} from '@substrate/app/atoms/api/apiAtom';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { IMultisigAssets } from '@substrate/app/global/types';
// import axios from 'axios';
import { atom } from 'jotai';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';
// import { tokenSymbolToNetwork } from '@next-common/global/networkConstants';

export const assetsAtom = atom<Promise<Array<IMultisigAssets | null>>>(async (get) => {
	const organisation = get(organisationAtom);
	const PolkadotApiAtom = get(polkadotApi);
	const AstarApiAtom = get(astarApi);
	const AvailGoldbergApiAtom = get(availGoldbergApi);
	const KhalaApiAtom = get(khalaApi);
	const KusamaApiAtom = get(kusamaApi);
	const PhalaApiAtom = get(phalaApi);
	const RococoApiAtom = get(rococoApi);
	const AssethubPolkadotApiAtom = get(assethubPolkadotApi);
	const AssethubKusamaApiAtom = get(assethubKusamaApi);
	const AssethubRococoApiAtom = get(assethubRococoApi);
	const AvailTuringApiAtom = get(availTuringApi);
	const WestendApiAtom = get(westendApi);

	const getApi = (network: string) => {
		switch (network) {
			case networks.POLKADOT:
				return PolkadotApiAtom;
			case networks.ASTAR:
				return AstarApiAtom;
			case networks.AVAIL:
				return AvailGoldbergApiAtom;
			case networks.KHALA:
				return KhalaApiAtom;
			case networks.KUSAMA:
				return KusamaApiAtom;
			case networks.PHALA:
				return PhalaApiAtom;
			case networks.ROCOCO:
				return RococoApiAtom;
			case networks.STATEMINT:
				return AssethubPolkadotApiAtom;
			case networks.STATEMINE:
				return AssethubKusamaApiAtom;
			case networks.ROCOCO_ASSETHUB:
				return AssethubRococoApiAtom;
			case networks.TURING:
				return AvailTuringApiAtom;
			case networks.WESTEND:
				return WestendApiAtom;
			default:
				return null;
		}
	};

	if (!organisation) {
		return [null];
	}

	const usdData = {} as any;
	const { multisigs } = organisation;
	const assetsPromise = multisigs.map(async (m) => {
		const { address, network } = m;
		const networkApi = getApi(network);
		const api = networkApi?.api;
		const apiReady = networkApi?.apiReady;
		if (!api || !apiReady) {
			return null;
		}
		const { data: balanceWithDecimals } = (await api.query.system.account(address)).toJSON() as unknown as {
			data: {
				free: string;
				reserved: string;
				frozen: string;
				flags: string;
			};
		};
		const balance = {} as any;
		for (const [key, value] of Object.entries(balanceWithDecimals)) {
			balance[key] = formatBalance(value, chainProperties[network].tokenDecimals, {
				numberAfterComma: 3,
				withThousandDelimitor: false
			});
		}
		const usedValue =
			Number(usdData?.[network] || 0) *
			Number(
				formatBalance(balance.free, chainProperties[network].tokenDecimals, {
					numberAfterComma: 3,
					withThousandDelimitor: false
				})
			);
		return { ...balance, usd: usedValue, address, symbol: chainProperties[network]?.tokenSymbol } as IMultisigAssets;
	});
	return Promise.all(assetsPromise);
});
