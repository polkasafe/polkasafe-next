// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import { ResponseMessages } from '@common/constants/responseMessage';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { onChainTransaction } from '@substrate/app/api/api-utils/onChainTransaction';
import { Network } from '@common/constants/substrateNetworkConstant';
import { ITransaction } from '@common/types/substrate';

export const POST = withErrorHandling(async (req: NextRequest) => {
	// const { headers } = req;
	// const address = headers.get('x-address');
	// const signature = headers.get('x-signature');
	try {
		// check if address is valid
		// const substrateAddress = getSubstrateAddress(String(address));
		// if (!substrateAddress) {
		// return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS }, { status: 400 });
		// }

		// // check if signature is valid
		// const { isValid, error } = await isValidRequest(substrateAddress, signature);
		// if (!isValid) return NextResponse.json({ error }, { status: 400 });
		const { multisigs, limit, page } = await req.json();
		if (!multisigs || Number.isNaN(limit) || Number.isNaN(page)) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}
		if (Number(limit) > 100 || Number(limit) <= 0) {
			return NextResponse.json({ error: ResponseMessages.INVALID_LIMIT }, { status: 400 });
		}
		if (Number(page) <= 0) {
			return NextResponse.json({ error: ResponseMessages.INVALID_PAGE }, { status: 400 });
		}

		const encodedMultisigs = multisigs.map((item: string) => {
			const [address, network] = item.split('_');
			const encodeAddress = getEncodedAddress(address, network);
			if (!encodeAddress) {
				return null;
			}
			return {
				address: encodeAddress,
				network
			};
		});

		const allTxns: ITransaction[] = [];

		const promises = encodedMultisigs.map(async ({ address, network }: { address: string; network: Network }) => {
			const {
				data: { transactions: historyItemsArr },
				error: historyItemsError
			} = await onChainTransaction(address, network, Number(limit), Number(page));
			if (historyItemsError || !historyItemsArr) {
				console.log(`Error in  Multisig - ${address} Network - ${network}:`, {
					err: historyItemsError
				});
			}
			if (historyItemsArr) {
				allTxns.push(...historyItemsArr);
			}
		});

		await Promise.all(promises);

		return NextResponse.json(
			{
				data: { transactions: allTxns },
				error: null
			},
			{ status: 200 }
		);
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
