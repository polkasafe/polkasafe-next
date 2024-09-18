// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { IDashboardTransaction } from '@common/types/substrate';
import { ENetwork, ETransactionOptions, ETransactionType } from '@common/enum/substrate';
import TransactionRow from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails/components/TransactionList/components/TransactionRow';
import { Empty } from 'antd';
import { useSearchParams } from 'next/navigation';

interface ITransactionList {
	transactions: Array<IDashboardTransaction>;
	txType: ETransactionType;
}

const columns = [
	{
		title: 'Transaction',
		variant: ETypographyVariants.p
	},
	{
		title: 'Amount',
		variant: ETypographyVariants.p
	},
	{
		title: 'From',
		variant: ETypographyVariants.p
	},
	{
		title: 'To',
		variant: ETypographyVariants.p
	},
	{
		title: 'Action',
		variant: ETypographyVariants.p
	}
];

const filterTransactions = (
	transactions: Array<IDashboardTransaction>,
	address: string | null,
	network: ENetwork | null
) => {
	if (!address || !network) {
		return transactions;
	}
	return transactions.filter(
		(transaction) => transaction.multisigAddress === address && transaction.network === network
	);
};

export function TransactionList({ transactions = [], txType }: ITransactionList) {
	const multisig = useSearchParams().get('_multisig');
	const network = useSearchParams().get('_network') as ENetwork;

	return (
		<>
			<div className='flex bg-bg-secondary my-1 p-3 rounded-lg mr-1'>
				{columns.map((column) => (
					<Typography
						key={column.title}
						variant={column.variant}
						className='basis-1/5 text-base'
					>
						{column.title}
					</Typography>
				))}
			</div>
			<div className='max-h-72 overflow-x-hidden overflow-y-auto flex flex-col gap-3'>
				{transactions &&
					filterTransactions(transactions, multisig, network).map((transaction) => (
						<TransactionRow
							callHash={transaction.callHash}
							callData={transaction.callData}
							key={`${transaction.callHash}`}
							createdAt={new Date(transaction.createdAt)}
							to={transaction.to as string}
							network={transaction.network as ENetwork}
							amountToken={transaction.amountToken}
							from={transaction.from || transaction.multisigAddress}
							type={
								transaction.to === transaction.multisigAddress ? ETransactionOptions.RECEIVED : ETransactionOptions.SENT
							}
							transactionType={txType}
							multisig={transaction.multisigAddress}
						/>
					))}
			</div>
		</>
	);
}
