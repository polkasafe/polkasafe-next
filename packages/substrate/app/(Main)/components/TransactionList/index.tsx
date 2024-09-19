// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { IDashboardTransaction } from '@common/types/substrate';
import { ENetwork, ETransactionOptions, ETransactionType } from '@common/enum/substrate';
import { useSearchParams } from 'next/navigation';
import TransactionRow from '@substrate/app/(Main)/components/TransactionList/components/TransactionRow';
import { twMerge } from 'tailwind-merge';

interface ITransactionList {
	transactions: Array<IDashboardTransaction>;
	txType: ETransactionType;
	className?: string;
}

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

export function TransactionList({ transactions = [], txType, className }: ITransactionList) {
	const multisig = useSearchParams().get('_multisig');
	const network = useSearchParams().get('_network') as ENetwork;

	console.log("transactions", transactions);

	return (
			<div className={twMerge('flex flex-col gap-3 border-none', className)}>
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
							approvals={transaction.approvals}
						/>
					))}
			</div>
	);
}
