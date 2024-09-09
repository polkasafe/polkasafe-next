// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessages } from '@common/constants/responseMessage';
import { MULTISIG_COLLECTION, PROXY_COLLECTION } from '@common/db/collections';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { onChainMultisig } from '@substrate/app/api/api-utils/onChainMultisig';
import { ENetwork, EUserType } from '@common/enum/substrate';
import { DEFAULT_MULTISIG_NAME } from '@common/constants/defaults';
import { IDBMultisig, IProxy } from '@common/types/substrate';
import { onChainMultisigsByAddress } from '@substrate/app/api/api-utils/onChainMultisigsByAddress';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';

const updateDB = async (docId: string, multisig: IDBMultisig) => {
	const multisigRef = await MULTISIG_COLLECTION.doc(String(docId)).get();

	if (!multisigRef.exists) {
		// if the multisig is not exists in our db, update it
		const newMultisigRef = MULTISIG_COLLECTION.doc(docId);
		newMultisigRef.set(multisig);
	}

	await Promise.all(
		(multisig.proxy || [])?.map(async (proxy) => {
			const proxyId = `${proxy.address}_${docId}`;
			const proxyRef = await PROXY_COLLECTION.doc(proxyId).get();
			if (!proxyRef.exists) {
				const newProxyRef = PROXY_COLLECTION.doc(proxyId);
				await newProxyRef.set({ multisigId: docId, address: proxy.address, name: proxy.name });
			}
		})
	);
};

const getProxyDataFromDB = async (docId: string) => {
	const proxyRef = await PROXY_COLLECTION.where('multisigId', '==', docId).get();
	const proxyData = proxyRef.docs.map((doc) => doc.data());

	return proxyData.filter((a) => Boolean(a));
};

export const POST = withErrorHandling(async (req: NextRequest) => {
	try {
		const { address, network } = await req.json();
		if (!address || !network) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}

		const encodedMultisigAddress = getEncodedAddress(address, network);
		if (!encodedMultisigAddress) {
			return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS });
		}

		const allMultisig: Array<IDBMultisig> = [];

		const dbData = await MULTISIG_COLLECTION.where('signatories', 'array-contains', encodedMultisigAddress)
			.where('network', '==', network)
			.get();
		if (dbData.docs.length > 0) {
			dbData.docs.forEach(async (doc) => {
				const data = doc.data() as IDBMultisig;
				const proxyData = (await getProxyDataFromDB(doc.id)) as Array<IProxy>;
				allMultisig.push({ ...data, proxy: proxyData });
			});
		}
		await Promise.all(allMultisig);

		const onChainData: Array<string> = await onChainMultisigsByAddress(encodedMultisigAddress, network);

		onChainData
			.filter((address) => {
				return !allMultisig.map((a) => getSubstrateAddress(a.address)).includes(getSubstrateAddress(address));
			})
			.forEach(async (address) => {
				console.log('address', address);
				const encodedMultisigAddress = getEncodedAddress(address, network) || address;
				const docId = `${encodedMultisigAddress}_${network}`;
				const { data: multisigMetaData, error: multisigMetaDataErr } = await onChainMultisig(
					encodedMultisigAddress,
					network
				);
				if (multisigMetaDataErr) {
					return null;
				}
				if (!multisigMetaData) {
					return null;
				}

				const newMultisig: IDBMultisig = {
					address: encodedMultisigAddress,
					created_at: new Date(),
					updated_at: new Date(),
					name: DEFAULT_MULTISIG_NAME,
					signatories: multisigMetaData.signatories || [],
					network: String(network).toLowerCase() as ENetwork,
					threshold: Number(multisigMetaData.threshold) || 0,
					type: EUserType.SUBSTRATE,
					proxy: multisigMetaData.proxy
				};

				updateDB(docId, newMultisig);
				allMultisig.push(newMultisig);
			});

		await Promise.all(allMultisig);

		return NextResponse.json(
			{
				data: allMultisig,
				error: null
			},
			{ status: 200 }
		);
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
