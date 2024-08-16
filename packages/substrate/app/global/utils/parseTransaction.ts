// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IDashboardTransaction } from '@substrate/app/global/types';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseTransaction = (transaction: any) => {
	return {
		multisigAddress: transaction.multisigAddress as string,
		from: transaction.from as string,
		amountToken: transaction.amount_token as string,
		network: transaction.network as string,
		createdAt: new Date(transaction.created_at) as Date,
		callData: transaction.callData as string,
		callHash: transaction.callHash as string
	} as unknown as IDashboardTransaction;
};
