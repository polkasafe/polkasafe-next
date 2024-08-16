// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { getMultisigData, getQueueTransactions, getTransactions } from '@sdk/polkasafe-sdk/src';
import { IMultisig, ITransaction } from '@substrate/app/global/types';

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

export const getMultisigDataAndTransactions = async (address: string, network: string) => {
	// fetch multisig data and transactions
	const multisigPromise = getMultisigData({ address, network });
	const transactionsPromise = getTransactions({ address, network });
	const queueTransactionPromise = getQueueTransactions({ address, network });

	// using Promise.all to fetch all data in parallel
	const [multisigData, transactionsData, queueTransactionData] = await Promise.all([
		multisigPromise,
		transactionsPromise,
		queueTransactionPromise
	]);

	// parsing multisig data
	const { data: multisig, error: multisigError } = multisigData as { data: IMultisig; error: string };

	const {
		data: { count, transactions },
		error: transactionsError
	} = transactionsData as {
		data: { count: number; transactions: Array<ITransaction> };
		error: string;
	};
	const {
		data: { count: queueCount, transactions: queueTransactions },
		error: queueTransactionsError
	} = queueTransactionData as {
		data: { count: number; transactions: Array<ITransaction> };
		error: string;
	};

	return { multisig: parseMultisig(multisig), transactions, queueTransactions };
};
