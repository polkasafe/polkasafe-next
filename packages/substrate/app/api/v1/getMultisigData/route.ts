// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { ResponseMessages } from '@common/constants/responseMessage';
import { isValidRequest } from '@common/utils/isValidRequest';
import { MULTISIG_COLLECTION, PROXY_COLLECTION } from '@common/db/collections';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { onChainMultisigTransaction } from '@substrate/app/api/api-utils/onChainMultisigTransaction';
import { ENetwork, EUserType } from '@common/enum/substrate';
import { DEFAULT_MULTISIG_NAME } from '@common/constants/defaults';
import { IDBMultisig } from '@common/types/substrate';

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

const getDataFromDB = async (docId: string) => {
	const multisigRef = await MULTISIG_COLLECTION.doc(docId).get();
	// proxy data from db if exists
	const proxyRef = await PROXY_COLLECTION.where('multisigId', '==', docId).get();
	const proxyData = proxyRef.docs.map((doc) => doc.data());

	if (multisigRef.exists) {
		const multisigData = multisigRef.data();
		return { ...multisigData, proxy: proxyData };
	}
	return null;
};

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { headers } = req;
	const address = headers.get('x-address');
	const signature = headers.get('x-signature');
	try {
		// check if address is valid
		// const substrateAddress = getSubstrateAddress(String(address));
		// if (!substrateAddress) {
		// 	return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS });
		// }

		// // check if signature is valid
		// const { isValid, error } = await isValidRequest(substrateAddress, signature);
		// if (!isValid) return NextResponse.json({ error }, { status: 400 });

		const { multisigAddress, network } = await req.json();
		if (!multisigAddress || !network) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}

		const encodedMultisigAddress = getEncodedAddress(multisigAddress, network);
		if (!encodedMultisigAddress) {
			return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS });
		}

		const docId = `${encodedMultisigAddress}_${network}`;
		const { data: multisigMetaData, error: multisigMetaDataErr } = await onChainMultisigTransaction(
			encodedMultisigAddress,
			network
		);
		if (multisigMetaDataErr) {
			const data = await getDataFromDB(docId);
			if (data) {
				return NextResponse.json(
					{
						data,
						error: null
					},
					{ status: 200 }
				);
			}
			return NextResponse.json(
				{
					data: null,
					error: multisigMetaDataErr
				},
				{ status: 400 }
			);
		}
		if (!multisigMetaData) {
			return NextResponse.json(
				{
					data: null,
					error: ResponseMessages.MULTISIG_NOT_FOUND_ON_CHAIN
				},
				{ status: 400 }
			);
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

		return NextResponse.json(
			{
				data: { ...newMultisig, proxy: multisigMetaData.proxy },
				error: null
			},
			{ status: 200 }
		);
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
