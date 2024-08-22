// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { getAssets } from '@sdk/polkasafe-sdk/src';

const parseAssets = (assets: any) => ({
	balance: assets.balance_token,
	value: `$ ${assets.balance_usd || 0}`,
	logoURI: assets.logoURI,
	name: assets.name,
	asset: assets.symbol
});

export const getMultisigAssets = async (address: string, network: string) => {
	// fetch multisig data and transactions
	// const multisigPromise = getMultisigData({address, network})
	const { data: assets, error } = (await getAssets({ address, network })) as { data: Array<any>; error: string };

	if (error) {
		return { assets: [], error };
	}

	return { assets: assets.map(parseAssets), error: null };
};
