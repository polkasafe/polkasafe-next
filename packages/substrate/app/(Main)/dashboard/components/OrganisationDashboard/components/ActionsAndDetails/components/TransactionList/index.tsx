// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { IDashboardTransaction } from '@common/types/substrate';
import { ENetwork, ETransactionOptions, ETransactionType } from '@common/enum/substrate';
import TransactionRow from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails/components/TransactionList/components/TransactionRow';

interface ITransactionList {
	transactions: Array<IDashboardTransaction>;
	txType: ETransactionType;
}

const columns = [
	{
		title: 'Details',
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
		title: 'Date',
		variant: ETypographyVariants.p
	},
	{
		title: 'Category',
		variant: ETypographyVariants.p
	},
	{
		title: 'Status',
		variant: ETypographyVariants.p
	}
];
export function TransactionList({ transactions = [], txType }: ITransactionList) {
	console.log('transactions', transactions);
	return (
		<>
			<div className='flex bg-bg-secondary my-1 p-3 rounded-lg mr-1'>
				{columns.map((column) => (
					<Typography
						key={column.title}
						variant={column.variant}
						className='basis-1/6 text-base'
					>
						{column.title}
					</Typography>
				))}
			</div>
			<div className='max-h-72 overflow-x-hidden overflow-y-auto flex flex-col gap-3'>
				{transactions &&
					transactions.map((transaction) => (
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
