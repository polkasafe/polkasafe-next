// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessages } from '@common/constants/responseMessage';
import { MULTISIG_COLLECTION, ORGANISATION_COLLECTION, PROXY_COLLECTION } from '@common/db/collections';
import { IDBMultisig, IDBOrganisation, IOrganisation } from '@common/types/substrate';
import { EUserType } from '@common/enum/substrate';
import { isValidRequest } from '@common/utils/isValidRequest';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { DEFAULT_MULTISIG_NAME } from '@common/constants/defaults';
import getEncodedAddress from '@common/utils/getEncodedAddress';

const updateDB = async (organisation: IDBOrganisation, multisigs: Array<IDBMultisig>) => {
	try {
		const orgRef = ORGANISATION_COLLECTION.doc();
		await Promise.all([
			orgRef.set(organisation),
			Promise.all(
				multisigs.map(async (multisig) => {
					const docId = `${multisig.address}_${multisig.network}`;
					await MULTISIG_COLLECTION.doc(docId).set({ multisigs }, { merge: true });
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
				})
			)
		]);
		return orgRef.id;
	} catch (err: unknown) {
		console.log('Error in updateDB:', err);
	}
};

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { headers } = req;
	const address = headers.get('x-address');
	const signature = headers.get('x-signature');
	try {
		// check if address is valid
		const substrateAddress = getSubstrateAddress(String(address));
		if (!substrateAddress) {
			return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS });
		}

		// check if signature is valid
		const { isValid, error } = await isValidRequest(substrateAddress, signature);
		if (!isValid) return NextResponse.json({ error }, { status: 400 });

		const {
			name,
			multisigs,
			imageURI = '',
			country = '',
			state = '',
			city = '',
			postalCode = '',
			organisationAddress = '',
			taxNumber = '',
			description = ''
		} = await req.json();

		if (!multisigs || !name) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}
		if (multisigs.length < 1) {
			return NextResponse.json({ error: ResponseMessages.INVALID_THRESHOLD }, { status: 400 });
		}

		const oldMultisigData = (await MULTISIG_COLLECTION.where('signatories', 'array-contains', address).get()).docs.map(
			(oldData) => oldData.data()
		);

		const getMultisigName = (address: string) => {
			oldMultisigData.forEach((a) => {
				if (a.address === address) {
					return a.name;
				}
			});
			return DEFAULT_MULTISIG_NAME;
		};

		const multisigPayload = (multisigs as Array<IDBMultisig>).map((multisig) => {
			return {
				name: getMultisigName(multisig.address),
				signatories: multisig.signatories.map((signatory) =>
					getEncodedAddress(signatory, multisig.network)
				) as Array<string>,
				network: multisig.network,
				address: multisig.address,
				threshold: multisig.threshold,
				type: EUserType.SUBSTRATE,
				proxy: multisig.proxy,
				description,
				created_at: new Date(),
				updated_at: new Date()
			};
		});
		const members = multisigPayload
			.map((multisig) => multisig.signatories)
			.flat()
			.map((signatory) => (signatory ? getSubstrateAddress(signatory) : signatory)) as Array<string>;

		const newOrganisation: IDBOrganisation = {
			name: String(name),
			multisigs: multisigPayload.map((multisig) => `${multisig.address}_${multisig.network}`),
			imageURI,
			country,
			state,
			city,
			postal_code: postalCode,
			organisation_address: organisationAddress,
			tax_number: taxNumber,
			members,
			created_at: new Date(),
			updated_at: new Date()
		};

		const docId = await updateDB(newOrganisation, multisigPayload);
		return NextResponse.json({ data: { ...newOrganisation, id: docId }, error: null });
	} catch (err: unknown) {
		console.log('Error in getAssets:', err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});