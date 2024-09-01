// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable no-tabs */
import { ENetwork, ETransactionOptions, ETransactionType } from '@common/enum/substrate';
import { TransactionHead } from '@common/global-ui-components/Transaction/TransactionHead';
import { useDecodeCallData } from '@substrate/app/global/hooks/queryHooks/useDecodeCallData';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';

interface ITransactionRow {
	callData?: string;
	callHash: string;
	createdAt: Date;
	to: string;
	network: ENetwork;
	amountToken: string;
	from: string;
	type: ETransactionOptions;
	transactionType: ETransactionType;
}

function TransactionRow({
	callData,
	callHash,
	createdAt,
	to,
	network,
	amountToken,
	from,
	type,
	transactionType
}: ITransactionRow) {
	const { getApi } = useAllAPI();

	const { data, isLoading, error } = useDecodeCallData({
		callData,
		callHash,
		apiData: getApi(network)
	});
	const label = data?.method && data?.section ? `${data.section}_${data.method}` : '';
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<TransactionHead
			createdAt={createdAt}
			to={data?.to || to}
			network={network}
			amountToken={data?.value || amountToken}
			from={from}
			label={label.split('_')}
			type={type}
			transactionType={transactionType}
		/>
	);
}

export default TransactionRow;
