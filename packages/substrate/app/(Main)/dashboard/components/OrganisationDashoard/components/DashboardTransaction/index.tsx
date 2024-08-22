// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import DownIcon from '@common/assets/icons/down.svg';
import History from '@substrate/app/(Main)/dashboard/components/OrganisationDashoard/components/DashboardTransaction/History';
import Queue from '@substrate/app/(Main)/dashboard/components/OrganisationDashoard/components/DashboardTransaction/Queue';
import { getOrganisationTransactions } from '@sdk/polkasafe-sdk/src';
import { parseTransaction } from '@substrate/app/global/utils/parseTransaction';
import { IDashboardTransaction, IMultisig } from '@common/types/substrate';

interface IDashboardTransactionProps {
	multisigs: Array<IMultisig>;
}

const styles = {
	selectedTab: 'bg-highlight text-text-outline-primary border-0 py-3 px-5 text-sm font-bold',
	tab: 'bg-bg-main text-text-primary border-0 py-3 px-5 text-sm font-bold'
};

function DashboardTransaction({ multisigs }: IDashboardTransactionProps) {
	const [isMounted, setIsMounted] = useState(false);

	const [selectedMultisig] = useState<Array<IMultisig>>(multisigs);
	const [transaction, setTransaction] = useState<Array<IDashboardTransaction> | null>(null);
	const selectedTab = useSearchParams().get('tab') || 'history';
	useEffect(() => {
		const fetchTransactions = async () => {
			try {
				const multisigs = selectedMultisig.map((multisig) => `${multisig.address}_${multisig.network}`);
				const transactionsData = (await getOrganisationTransactions({ multisigs, limit: 10 })) as {
					data: { transactions: Array<any> };
				};
				const transactions = transactionsData.data.transactions.map(parseTransaction) as Array<IDashboardTransaction>;
				setTransaction(transactions);
				// setTransaction([]);
			} catch (error) {
				console.log(error);
			}
		};
		fetchTransactions();
	}, [selectedMultisig]);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className='flex flex-col gap-2'>
			<div className='flex justify-between items-center'>
				<div className='flex gap-2 items-center'>
					<Button
						variant={EButtonVariant.PRIMARY}
						className={twMerge(
							selectedTab === 'history' && styles.selectedTab,
							selectedTab !== 'history' && styles.tab
						)}
					>
						History
					</Button>
					<Button
						variant={EButtonVariant.PRIMARY}
						className={twMerge(selectedTab === 'queue' && styles.selectedTab, selectedTab !== 'queue' && styles.tab)}
					>
						Queue
					</Button>
				</div>
				<div>
					<Button
						variant={EButtonVariant.PRIMARY}
						className='py-3 px-5 font-bold border-2 text-text-outline-primary flex gap-2 items-center'
					>
						Filters
						<DownIcon />
					</Button>
				</div>
			</div>
			{selectedTab === 'history' && <History transactions={transaction} />}
			{selectedTab === 'queue' && <Queue />}
		</div>
	);
}

export default DashboardTransaction;
