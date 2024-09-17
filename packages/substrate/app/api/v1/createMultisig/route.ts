// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessages } from '@common/constants/responseMessage';
import { MULTISIG_COLLECTION } from '@common/db/collections';
import { IDBMultisig } from '@common/types/substrate';
import { ENetwork, EUserType } from '@common/enum/substrate';
import { encodeAddress, encodeMultiAddress } from '@polkadot/util-crypto';
import { networkConstants } from '@common/constants/substrateNetworkConstant';

const updateDB = async (multisigs: Array<IDBMultisig>) => {
	try {
		Promise.all(
			multisigs.map(async (multisig) =>
				MULTISIG_COLLECTION.doc(`${multisig.address}_${multisig.network}`).set(multisigs, { merge: true })
			)
		);
	} catch (err: unknown) {
		console.log('Error in updateDB:', err);
	}
};

export const POST = withErrorHandling(async (req: NextRequest) => {
	try {
		const { name, signatories, network, threshold, proxy = [] } = await req.json();
		if (!name || !signatories || !network || !threshold) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}
		if (!Array.isArray(signatories)) {
			return NextResponse.json({ error: ResponseMessages.INVALID_PARAMS }, { status: 400 });
		}
		if (signatories.length < 2) {
			return NextResponse.json({ error: 'You should have at least one signatories' }, { status: 400 });
		}
		if (!threshold) {
			return NextResponse.json({ error: 'threshold is required' }, { status: 400 });
		}

		const encodedSignatories = signatories.map((signatory) =>
			encodeAddress(signatory, networkConstants[network as ENetwork].ss58Format)
		);
		const multisigAddress = encodeMultiAddress(encodedSignatories, threshold);
		const payload: IDBMultisig = {
			name,
			signatories: encodedSignatories,
			network,
			address: multisigAddress,
			threshold,
			type: EUserType.SUBSTRATE,
			created_at: new Date(),
			updated_at: new Date(),
			proxy
		};
		updateDB([payload]);
		return NextResponse.json({ data: payload, error: null });
	} catch (err: unknown) {
		console.log('Error in getAssets:', err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
