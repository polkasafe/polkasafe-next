// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ETransactionType } from '@common/enum/substrate';
import { ITransaction } from '@common/types/substrate';
import { getQueueTransactions, getTransactions } from '@sdk/polkasafe-sdk/src';

export const getMultisigTransactions = async (
	type: ETransactionType,
	address: string,
	network: string,
	page: number,
	limit: number
) => {
	const transactionsData =
		type === ETransactionType.HISTORY_TRANSACTION
			? await getTransactions({ address, network, page, limit })
			: await getQueueTransactions({ address, network, page, limit });

	const {
		data: { count, transactions },
		error: transactionsError
	} = transactionsData as {
		data: { count: number; transactions: Array<ITransaction> };
		error: string;
	};

	if (transactionsError) {
		return { transactions: [] };
	}

	return { transactions, count };
};
