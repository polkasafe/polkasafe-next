// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import OverviewCard from './components/OverviewCard';
import TransactionCard from '../TransactionCard';
import { IMultisig, ITransaction } from '@common/types/substrate';
import SelectAccount from '@substrate/app/(Main)/dashboard/components/MultisigDashboard/components/SelectAccount';

interface IMultisigDashboardProps {
	multisig: IMultisig;
	transactions: Array<ITransaction>;
	queueTransactions: Array<ITransaction>;
}

function MultisigDashboard({ multisig, transactions, queueTransactions }: IMultisigDashboardProps) {
	return (
		<div>
			<div className='grid grid-cols-3 gap-x-6'>
				<div className='col-span-2'>
					<OverviewCard address={multisig.address} network={multisig.network} balance={multisig.balance} signatories={multisig.signatories} threshold={multisig.threshold} name={multisig.name} />
				</div>
				<div className='col-span-1'>
					<SelectAccount multisig={multisig} />
				</div>
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
