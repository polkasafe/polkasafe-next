// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Network, networks } from '@common/constants/substrateNetworkConstant';
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
import { useAtomValue } from 'jotai';

export const useAllAPI = () => {
	const polkadot = useAtomValue(polkadotApi);
	const astar = useAtomValue(astarApi);
	const avail = useAtomValue(availGoldbergApi);
	const khala = useAtomValue(khalaApi);
	const kusama = useAtomValue(kusamaApi);
	const phala = useAtomValue(phalaApi);
	const rococo = useAtomValue(rococoApi);
	const assethubPolkadot = useAtomValue(assethubPolkadotApi);
	const assethubKusama = useAtomValue(assethubKusamaApi);
	const assethubRococo = useAtomValue(assethubRococoApi);
	const availTuring = useAtomValue(availTuringApi);
	const westend = useAtomValue(westendApi);

	const getApi = (network: Network) => {
		switch (network) {
			case networks.POLKADOT:
				return polkadot;
			case networks.ASTAR:
				return astar;
			case networks.AVAIL:
				return avail;
			case networks.KHALA:
				return khala;
			case networks.KUSAMA:
				return kusama;
			case networks.PHALA:
				return phala;
			case networks.ROCOCO:
				return rococo;
			case networks.STATEMINT:
				return assethubPolkadot;
			case networks.STATEMINE:
				return assethubKusama;
			case networks.ROCOCO_ASSETHUB:
				return assethubRococo;
			case networks.TURING:
				return availTuring;
			case networks.WESTEND:
				return westend;
			default:
				return null;
		}
	};

	return {
		allApi: {
			polkadotApi: polkadot,
			astarApi: astar,
			availApi: avail,
			khalaApi: khala,
			kusamaApi: kusama,
			phalaApi: phala,
			rococoApi: rococo,
			assethubPolkadotApi: assethubPolkadot,
			assethubKusamaApi: assethubKusama,
			assethubRococoApi: assethubRococo,
			availTuringApi: availTuring,
			westendApi: westend
		},
		getApi
	};
};
