// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Link from 'next/link';
import { MULTISIG_TRANSACTION_URL, ORGANISATION_TRANSACTION_URL } from '@substrate/app/global/end-points';
import { ETransactionTab } from '@common/enum/substrate';
import Queue from '../Queue';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@sdk/polkasafe-sdk/src/constants/pagination';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { IMultisig } from '@common/types/substrate';
import { twMerge } from 'tailwind-merge';
import { History } from '@substrate/app/(Main)/transactions/components/History';

interface ITransactionTemplateProps {
	organisationId: string;
	network?: string;
	multisig?: string;
	tab: ETransactionTab;
}

const styles = {
	selectedTab: 'bg-highlight text-label border-0 py-3 px-5 text-sm font-medium',
	tab: 'bg-transparent text-text-primary border-0 py-3 px-5 text-sm shadow-none',
	filterButton: 'py-3 px-5 font-bold border-2 text-text-outline-primary flex gap-2 items-center'
};

function TransactionTemplate({ organisationId, network, multisig, tab: selectedTab }: ITransactionTemplateProps) {
	const [organisation] = useOrganisation();
	const isSingleMultisig = multisig && network;
	const multisigs = (organisation?.multisigs || []) as Array<IMultisig>;

	const tabs = [
		{
			label: 'Queue',
			tab: ETransactionTab.QUEUE,
			link: !isSingleMultisig
				? ORGANISATION_TRANSACTION_URL({
						organisationId,
						page: DEFAULT_PAGE,
						limit: DEFAULT_PAGE_SIZE,
						tab: ETransactionTab.QUEUE
					})
				: MULTISIG_TRANSACTION_URL({
						organisationId,
						multisig,
						page: DEFAULT_PAGE,
						limit: DEFAULT_PAGE_SIZE,
						network: network as string,
						tab: ETransactionTab.QUEUE
					})
		},
		{
			label: 'Transaction History',
			tab: ETransactionTab.HISTORY,
			link: !isSingleMultisig
				? ORGANISATION_TRANSACTION_URL({
						organisationId,
						page: DEFAULT_PAGE,
						limit: DEFAULT_PAGE_SIZE,
						tab: ETransactionTab.HISTORY
					})
				: MULTISIG_TRANSACTION_URL({
						organisationId,
						multisig,
						page: DEFAULT_PAGE,
						limit: DEFAULT_PAGE_SIZE,
						network: network as string,
						tab: ETransactionTab.HISTORY
					})
		}
	];

	return (
		<div className='flex flex-col gap-y-6 h-full'>
			<div className='flex justify-between items-center'>
				<div className='flex gap-x-4 items-center'>
					<div className='flex gap-x-4 items-center'>
						{tabs.map((tab) => (
							<Link
								key={tab.tab}
								href={tab.link}
							>
								<Button
									variant={EButtonVariant.PRIMARY}
									className={twMerge(
										selectedTab === tab.tab && styles.selectedTab,
										selectedTab !== tab.tab && styles.tab
									)}
									size='large'
								>
									{tab.label}
								</Button>
							</Link>
						))}
					</div>
				</div>
			</div>
			<div className='flex-1 overflow-y-auto'>
				{selectedTab === ETransactionTab.QUEUE && <Queue multisigs={multisigs} />}
				{selectedTab === ETransactionTab.HISTORY && <History multisigs={multisigs} />}
			</div>
		</div>
	);
}

export default TransactionTemplate;
