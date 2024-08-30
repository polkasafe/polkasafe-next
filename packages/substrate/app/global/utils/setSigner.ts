// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable security/detect-object-injection */

import APP_NAME from '@common/constants/appName';
import { Network } from '@common/constants/substrateNetworkConstant';
import { Wallet } from '@common/enum/substrate';
import { Injected, InjectedWindow } from '@polkadot/extension-inject/types';
import { isNumber } from '@polkadot/util';
import { checkAvailNetwork } from '@substrate/app/Initializers/InitializeAPI';
import { signedExtensions, types } from 'avail-js-sdk';

const getInjectorMetadata = (api: any) => {
	return {
		chain: api.runtimeChain.toString(),
		chainType: 'substrate' as const,
		genesisHash: api.genesisHash.toHex(),
		icon: 'substrate',
		specVersion: api.runtimeVersion.specVersion.toNumber(),
		ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : 0,
		tokenDecimals: api.registry.chainDecimals[0] || 18,
		tokenSymbol: api.registry.chainTokens[0] || 'AVAIL',
		types: types as any,
		userExtensions: signedExtensions
	};
};

export async function setSigner(api: any, chosenWallet: Wallet, network: Network) {
	const injectedWindow = (typeof window !== 'undefined' && window) as Window & InjectedWindow;

	const wallet = injectedWindow.injectedWeb3[String(chosenWallet)];

	if (!wallet) {
		return;
	}

	let injected: Injected | undefined;
	try {
		injected = await new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => {
				reject(new Error('Wallet Timeout'));
			}, 60000); // wait 60 sec

			if (wallet && wallet.enable) {
				wallet
					.enable(APP_NAME)
					.then((value) => {
						clearTimeout(timeoutId);
						resolve(value);
					})
					.catch((error) => {
						reject(error);
					});
			}
		});
	} catch (err) {
		console.log(err?.message);
	}
	if (!injected) {
		return;
	}
	if (checkAvailNetwork(network)) {
		const metadata = getInjectorMetadata(api);
		const prevMetadatas = await injected.metadata?.get();
		if (
			prevMetadatas &&
			prevMetadatas.some(
				(item) => item.specVersion === metadata.specVersion && item.genesisHash === metadata.genesisHash
			)
		) {
			api.setSigner(injected.signer);
			return;
		}
		await injected.metadata?.provide(metadata);
		const inj = injected;
		if (inj?.signer) {
			api.setSigner(inj.signer);
			return;
		}
	}
	api.setSigner(injected.signer);
}
