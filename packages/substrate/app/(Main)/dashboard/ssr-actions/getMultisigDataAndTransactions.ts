// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IDBTransaction, IMultisig, ITransaction } from '@common/types/substrate';
import { getMultisigData, getQueueTransactions, getTransactions } from '@sdk/polkasafe-sdk/src';

const parseMultisig = (multisig: any) =>
	({
		name: multisig.name,
		address: multisig.address,
		threshold: multisig.threshold,
		signatories: multisig.signatories,
		balance: multisig.balance,
		disabled: multisig.disabled,
		network: multisig.network,
		createdAt: multisig.created_at,
		updatedAt: multisig.updated_at,
		proxy: multisig.proxy || []
	}) as IMultisig;

const parseTransactions = (transaction: any) =>
	({
		id: transaction.id,
		from: transaction.from,
		to: transaction.to,
		callData: transaction.callData,
		callHash: transaction.callHash,
		blockNumber: transaction.block_number,
		status: transaction.status,
		createdAt: transaction.created_at,
		updatedAt: transaction.updated_at,
		token: transaction.token,
		amountUSD: transaction.amount_usd,
		amountToken: transaction.amount_token,
		network: transaction.network,
		transactionFields: transaction.transactionFields,
		approvals: transaction.approvals
	}) as unknown as ITransaction;

export const getMultisigDataAndTransactions = async (address: string, network: string) => {
	// fetch multisig data and transactions
	console.log('getMultisigDataAndTransactions', address, network);

	const multisigPromise = getMultisigData({ address, network });
	const transactionsPromise = getTransactions({ address, network });
	const queueTransactionPromise = getQueueTransactions({ multisigs: [`${address}_${network}`], page: 1, limit: 10 });

	// using Promise.all to fetch all data in parallel
	const [multisigData, transactionsData, queueTransactionData] = await Promise.all([
		multisigPromise,
		transactionsPromise,
		queueTransactionPromise
	]);

	// parsing multisig data
	const { data: multisig, error: multisigError } = multisigData as { data: IDBTransaction; error: string };

	const { data: transactions, error: transactionsError } = transactionsData as {
		data: { count: number; transactions: Array<IDBTransaction> };
		error: string;
	};

	const { data, error: queueTransactionsError } = queueTransactionData;

	if (multisigError || transactionsError || queueTransactionsError) {
		return { error: multisigError || transactionsError || queueTransactionsError };
	}

	const historyTx = transactions?.transactions?.map(parseTransactions);
	const queueTx = data?.transactions.map(parseTransactions);

	return {
		multisig: parseMultisig(multisig),
		history: { transactions: historyTx, count: transactions.transactions?.length || 0 },
		queue: { transactions: queueTx, count: queueTx?.length || 0 }
	};
};
