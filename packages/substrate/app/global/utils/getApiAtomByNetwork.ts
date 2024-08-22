// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { networks } from '@common/constants/substrateNetworkConstant';
import {
	astarApi,
	polkadotApi,
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

export const getApiAtomByNetwork = (network: string) => {
	switch (network) {
		case networks.POLKADOT:
			return polkadotApi;
		case networks.ASTAR:
			return astarApi;
		case networks.AVAIL:
			return availGoldbergApi;
		case networks.KHALA:
			return khalaApi;
		case networks.KUSAMA:
			return kusamaApi;
		case networks.PHALA:
			return phalaApi;
		case networks.ROCOCO:
			return rococoApi;
		case networks.STATEMINT:
			return assethubPolkadotApi;
		case networks.STATEMINE:
			return assethubKusamaApi;
		case networks.ROCOCO_ASSETHUB:
			return assethubRococoApi;
		case networks.TURING:
			return availTuringApi;
		case networks.WESTEND:
			return westendApi;
		default:
			return null;
	}
};
