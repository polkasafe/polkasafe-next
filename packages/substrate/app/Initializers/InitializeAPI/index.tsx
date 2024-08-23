// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

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
	westendApi
} from '@substrate/app/atoms/api/apiAtom';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { chainProperties, networks } from '@common/constants/substrateNetworkConstant';
import { initialize } from 'avail-js-sdk';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { queueNotification } from '@common/global-ui-components/QueueNotification';
import { NotificationStatus } from '@common/enum/substrate';

export const checkAvailNetwork = (network: string) => {
	return [networks.AVAIL].includes(network);
};

function InitializeAPI() {
	const setPolkadotApiAtom = useSetAtom(polkadotApi);
	const setAstarApiAtom = useSetAtom(astarApi);
	const setAvailGoldbergApiAtom = useSetAtom(availGoldbergApi);
	const setKhalaApiAtom = useSetAtom(khalaApi);
	const setKusamaApiAtom = useSetAtom(kusamaApi);
	const setPhalaApiAtom = useSetAtom(phalaApi);
	const setRococoApiAtom = useSetAtom(rococoApi);
	const setAssethubPolkadotApiAtom = useSetAtom(assethubPolkadotApi);
	const setAssethubKusamaApiAtom = useSetAtom(assethubKusamaApi);
	const setWestendApiAtom = useSetAtom(westendApi);

	const getApiSetter = (network: string) => {
		switch (network) {
			case networks.POLKADOT:
				return setPolkadotApiAtom;
			case networks.ASTAR:
				return setAstarApiAtom;
			case networks.AVAIL:
				return setAvailGoldbergApiAtom;
			case networks.KHALA:
				return setKhalaApiAtom;
			case networks.KUSAMA:
				return setKusamaApiAtom;
			case networks.PHALA:
				return setPhalaApiAtom;
			case networks.ROCOCO:
				return setRococoApiAtom;
			case networks.STATEMINT:
				return setAssethubPolkadotApiAtom;
			case networks.STATEMINE:
				return setAssethubKusamaApiAtom;
			case networks.WESTEND:
				return setWestendApiAtom;
			default:
				return null;
		}
	};

	const setAllNetworkApi = async () => {
		try {
			const data = Object.values(networks).map(async (network) => {
				const isAvail = checkAvailNetwork(network);
				const provider = isAvail ? null : new WsProvider(chainProperties[network].rpcEndpoint);
				const availApi = isAvail ? await initialize(chainProperties[network].rpcEndpoint) : null;
				const api = isAvail ? availApi : new ApiPromise({ provider: provider as WsProvider });
				if (!api) {
					queueNotification({
						header: 'Error',
						message: `Failed to connect to ${network} network`,
						status: NotificationStatus.ERROR
					});
					return;
				}
				await api.isReady;
				const setAtom = getApiSetter(network);
				if (!setAtom) {
					return;
				}
				console.log(network, 'connected');
				setAtom({
					api,
					apiReady: true,
					network
				});
			});
			await Promise.all(data);
		} catch (error) {
			console.error(error);
		}
	};

	useEffect(() => {
		setAllNetworkApi();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	return null;
}

export default InitializeAPI;
