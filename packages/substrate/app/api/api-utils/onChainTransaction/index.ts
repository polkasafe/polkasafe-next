// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import dayjs from 'dayjs';
import axios from 'axios';
import { IDBTransaction, ITransaction } from '@common/types/substrate';
import { SUBSCAN_API_HEADERS } from '@substrate/app/api/constants/subscane';
import { ResponseMessages } from '@common/constants/responseMessage';
import { TRANSACTION_COLLECTION } from '@common/db/collections';

interface IResponse {
	error?: string | null;
	data: { transactions: ITransaction[]; count: number };
}

const getExcHistoryResponse = async (multisigAddress: string, network: string, page: number, entries: number) => {
	const excHistoryResponse = await axios.post(
		`https://${network}.api.subscan.io/api/scan/multisigs/details`,
		{
			account: multisigAddress,
			page: page - 1 || 0, // pages start from 0
			row: entries || 1,
			status: 'Executed'
		},
		{ headers: SUBSCAN_API_HEADERS }
	);

	const { data: excHistoryData } = excHistoryResponse.data;

	const filteredExcHistoryData =
		excHistoryData && excHistoryData.multisig?.length
			? excHistoryData.multisig.filter((transaction: any) => transaction.status === 'Executed')
			: [];

	const excHistoryTransactionsPromise = filteredExcHistoryData.map(async (transaction: any) => {
		const transactionDoc = await TRANSACTION_COLLECTION.doc(transaction.call_hash).get();
		const txn: IDBTransaction = transactionDoc.data() as IDBTransaction;

		return {
			multi_id: transaction.multi_id || '',
			multisigAddress,
			amount_token: transactionDoc.exists && txn?.amount_token ? txn?.amount_token : '',
			amount_usd: String(Number(transaction.usd_amount) * Number(1)),
			block_number: Number(transaction.block_num || 0),
			callData: transaction?.call_data
				? transaction?.call_data
				: transactionDoc.exists && transaction?.callData
				? transaction?.callData
				: '',
			callHash: transaction.call_hash,
			created_at: dayjs(transaction.block_timestamp * 1000).toDate(),
			from: transaction.multi_account_display.address,
			network,
			note: txn?.note || '',
			to: transaction.to,
			token: transaction.asset_symbol,
			transactionFields: txn?.transactionFields || ({} as any)
		} as unknown as IDBTransaction;
	});
	return Promise.all(excHistoryTransactionsPromise);
};

const getAllHistoryResponse = async (multisigAddress: string, network: string, page: number, entries: number) => {
	const allHistoryResponse = await axios.post(
		`https://${network}.api.subscan.io/api/v2/scan/transfers`,
		{
			address: multisigAddress,
			currency: 'token',
			page: page - 1 || 0, // pages start from 0
			row: entries || 1
		},
		{ headers: SUBSCAN_API_HEADERS }
	);

	const { data: allHistoryData } = allHistoryResponse.data;
	const filteredAllHistoryData =
		allHistoryData && allHistoryData.transfers?.length
			? allHistoryData.transfers.filter((transfer: any) => transfer.to === multisigAddress)
			: [];

	const allHistoryTransactionsPromise = filteredAllHistoryData.map(async (transfer: any) => {
		const transactionDoc = await TRANSACTION_COLLECTION.doc(transfer.hash).get();
		const transaction: ITransaction = transactionDoc.data() as ITransaction;

		return {
			multisigAddress,
			amount_token: transfer.amount,
			amount_usd: String(Number(transfer.usd_amount) * Number(1)),
			approvals: transactionDoc.exists && transaction.approvals ? transaction.approvals : [],
			block_number: Number(transfer.block_num),
			callHash: transfer.hash,
			created_at: dayjs(transfer.block_timestamp * 1000).toDate(),
			from: transfer.from,
			network,
			to: transfer.to,
			token: transfer.asset_symbol,
			transactionFields: transaction?.transactionFields || ({} as any),
			callData: transfer?.call_data
				? transfer?.call_data
				: transactionDoc.exists && transaction?.callData
				? transaction?.callData
				: ''
		} as unknown as IDBTransaction;
	});
	return Promise.all(allHistoryTransactionsPromise);
};

async function onChainTransaction(
	multisigAddress: string,
	network: string,
	entries: number,
	page: number
): Promise<IResponse> {
	const returnValue: IResponse = {
		data: { count: 0, transactions: [] },
		error: ''
	};

	try {
		const transactions: IDBTransaction[] = [];

		const excHistoryTransactionsPromise = getExcHistoryResponse(multisigAddress, network, page, entries);
		const allHistoryTransactionsPromise = getAllHistoryResponse(multisigAddress, network, page, entries);

		const [excHistoryTransactions, allHistoryTransactions] = await Promise.all([
			excHistoryTransactionsPromise,
			allHistoryTransactionsPromise
		]);

		returnValue.data.transactions = [...excHistoryTransactions, ...allHistoryTransactions];
		returnValue.data.count = transactions.length;
	} catch (err) {
		console.log('Error in getTransfersByAddress:', err);
		returnValue.error = String(err) || ResponseMessages.TRANSFERS_FETCH_ERROR;
	}

	return returnValue;
}

export { onChainTransaction };
