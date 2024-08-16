// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IMultisig, ITransaction } from '@substrate/app/global/types';
import React from 'react';
import OverviewCard from '../OverviewCard';
import TransactionCard from '../TransactionCard';

interface IMultisigDashboardProps {
	multisig: IMultisig;
	transactions: Array<ITransaction>;
	queueTransactions: Array<ITransaction>;
}

function MultisigDashboard({ multisig, transactions, queueTransactions }: IMultisigDashboardProps) {
	return (
		<div>
			<div>
				<h1>Overview:</h1>
				<OverviewCard {...multisig} />
			</div>
			<div className='flex gap-3'>
				<div className='bg-bg-secondary'>
					<h1>History Transactions:</h1>
					<div className='p-2'>
						<TransactionCard transactions={transactions} />
					</div>
				</div>
				<div className='bg-bg-secondary'>
					<h1>Queue Transactions:</h1>
					<div className='p-2'>
						<TransactionCard transactions={queueTransactions} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default MultisigDashboard;
