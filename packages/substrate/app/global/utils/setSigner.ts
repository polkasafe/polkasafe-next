// Copyright 2019-2025 @blobscriptions/marketplace authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable no-console */

import APP_NAME from '@common/constants/appName';
import { Wallet } from '@common/enum/substrate';
import { Injected, InjectedWindow, MetadataDef } from '@polkadot/extension-inject/types';
import { isNumber } from '@polkadot/util';
import { ApiPromise, signedExtensions, types } from 'avail-js-sdk';

const getInjectorMetadata = (api: ApiPromise) => {
	return {
		chain: api.runtimeChain.toString(),
		chainType: 'substrate' as const,
		genesisHash: api.genesisHash.toHex(),
		icon: 'substrate',
		specVersion: api.runtimeVersion.specVersion.toNumber(),
		ss58Format: isNumber(api.registry.chainSS58) ? api.registry.chainSS58 : 0,
		tokenDecimals: api.registry.chainDecimals[0] || 18,
		tokenSymbol: api.registry.chainTokens[0] || 'AVAIL',
		types,
		userExtensions: signedExtensions
	};
};

export async function setSigner(api: any, chosenWallet: Wallet) {
	if (!api || !chosenWallet) throw new Error('Please select an address');

	const injectedWindow = (typeof window !== 'undefined' && window) as Window & InjectedWindow;

	if (!injectedWindow) {
		console.log('Injected Window is null', injectedWindow);
		throw new Error('Injected Window is null');
	}

	const wallet = injectedWindow.injectedWeb3[String(chosenWallet)];

	if (!wallet) {
		console.log('console.log', wallet);
		throw new Error('Wallet not found');
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
					.then((value: Injected | PromiseLike<Injected | undefined> | undefined) => {
						clearTimeout(timeoutId);
						resolve(value);
					})
					.catch((error: unknown) => {
						reject(error);
					});
			}
		});
	} catch (err) {
		console.log(err);
	}
	if (!injected) {
		throw new Error('Wallet not injected');
	}
	const metadata = getInjectorMetadata(api);
	const prevMetadatas = await injected.metadata?.get();
	if (
		prevMetadatas &&
		prevMetadatas.some((item) => item.specVersion === metadata.specVersion && item.genesisHash === metadata.genesisHash)
	) {
		api.setSigner(injected.signer);
		return;
	}

	if (!metadata) {
		throw new Error('Metadata not found');
	}
	await injected.metadata?.provide(metadata as unknown as MetadataDef);
	const inj = injected;
	if (inj?.signer) {
		api.setSigner(inj.signer);
	}
}
