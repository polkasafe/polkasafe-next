// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessages } from '@common/constants/responseMessage';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { IDBMultisig, IDBTransaction, ITransaction } from '@common/types/substrate';
import { onChainQueueTransaction } from '@substrate/app/api/api-utils/onChainQueueTransaction';
import { ENetwork } from '@common/enum/substrate';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { MULTISIG_COLLECTION, TRANSACTION_COLLECTION } from '@common/db/collections';
import { isValidRequest } from '@common/utils/isValidRequest';

const getMultisigTransactions = async (multisigs: Array<IDBMultisig>, limit: number, page: number) => {
	const payload: Array<ITransaction> = [];

	for (const { address, network } of multisigs.filter((a) => Boolean(a))) {
		const {
			data: { transactions: historyItemsArr },
			error: historyItemsError
		} = await onChainQueueTransaction(address, network, Number(limit), Number(page));
		if (historyItemsError || !historyItemsArr) {
			console.log(`Error in  Multisig - ${address} Network - ${network}:`, {
				err: historyItemsError
			});
		}
		if (historyItemsArr) {
			payload.push(...historyItemsArr);
		}
	}

	// multisigs.forEach(async ({ address, network }: { address: string; network: ENetwork }) => {
	// 	const {
	// 		data: { transactions: historyItemsArr },
	// 		error: historyItemsError
	// 	} = await onChainQueueTransaction(address, network, Number(limit), Number(page));
	// 	if (historyItemsError || !historyItemsArr) {
	// 		console.log(`Error in  Multisig - ${address} Network - ${network}:`, {
	// 			err: historyItemsError
	// 		});
	// 	}
	// 	if (historyItemsArr) {
	// 		payload.push(...historyItemsArr);
	// 	}
	// });
	// return Promise.all(payload);
	return payload;
};

// Queue transaction for multisig
export const POST = withErrorHandling(async (req: NextRequest, { params }) => {
	const { headers } = req;
	const address = headers.get('x-address');
	const signature = headers.get('x-signature');
	const callhash = params?.callhash;
	try {
		if (!callhash) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}
		const substrateAddress = getSubstrateAddress(String(address));
		if (!substrateAddress) {
			return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS });
		}

		// check if signature is valid
		const { isValid, error } = await isValidRequest(substrateAddress, signature);
		if (!isValid) return NextResponse.json({ error }, { status: 400 });

		const { transactionFields } = await req.json();

		if (!transactionFields) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}
		const txRef = TRANSACTION_COLLECTION.doc(callhash);
		txRef.update({ transactionFields });
		return NextResponse.json({ data: { transactionFields }, error: null }, { status: 200 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
