// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessages } from '@common/constants/responseMessage';
import { MULTISIG_COLLECTION, ORGANISATION_COLLECTION } from '@common/db/collections';

const getDataFromDB = async (docId: string) => {
	const orgRef = await ORGANISATION_COLLECTION.doc(docId).get();
	if (orgRef.exists) {
		const orgData = orgRef.data();

		const multisigsData = (orgData?.multisigs || []).map(async (multisigId: string | any) => {
			let id = multisigId;
			if (typeof multisigId !== 'string' && multisigId.address && multisigId.network) {
				id = `${multisigId.address}_${multisigId.network}`;
			}

			if (id.split('_').length <= 1) {
				return null;
			}
			const multisigRef = await MULTISIG_COLLECTION.doc(id).get();
			if (multisigRef.exists) {
				return multisigRef.data();
			}
			return null;
		});
		return { ...orgData, id: docId, multisigs: (await Promise.all(multisigsData)).filter((a) => Boolean(a)) };
	}
	return null;
};

export const POST = withErrorHandling(async (req: NextRequest) => {
	try {
		const { organisations } = await req.json();
		if (!organisations) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}
		if (!Array.isArray(organisations)) {
			return NextResponse.json({ error: ResponseMessages.INVALID_PARAMS }, { status: 400 });
		}

		const data = (
			await Promise.all(organisations.map(async (organisation) => await getDataFromDB(organisation)))
		).filter((a) => Boolean(a));

		if (data.length > 0) {
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
				error: 'Not Fount'
			},
			{ status: 400 }
		);
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
