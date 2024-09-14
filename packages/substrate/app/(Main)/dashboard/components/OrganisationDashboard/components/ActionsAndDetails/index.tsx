// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';

import { twMerge } from 'tailwind-merge';
import DownIcon from '@common/assets/icons/down.svg';
import { IMultisig } from '@common/types/substrate';
import { ETransactionTab } from '@common/enum/substrate';
import Link from 'next/link';
import { ORGANISATION_DASHBOARD_URL } from '@substrate/app/global/end-points';
import { QuickHistory } from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails/components/QuickHistory';
import { QuickQueue } from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails/components/QuickQueue';
import QuickMultisigs from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails/components/Multisigs';

interface IDashboardTransactionProps {
	multisigs: Array<IMultisig>;
	organisationId: string;
	selectedTab: ETransactionTab;
}

const styles = {
	selectedTab: 'bg-highlight text-label border-0 py-3 px-5 text-sm font-medium',
	tab: 'bg-bg-main text-text-primary border-0 py-3 px-5 text-sm shadow-none',
	filterButton: 'py-3 px-5 font-bold border-2 text-text-outline-primary flex gap-2 items-center'
};

export function ActionAndDetails({ multisigs, organisationId, selectedTab }: IDashboardTransactionProps) {
	const tabs = [
		{
			label: 'Queue',
			tab: ETransactionTab.QUEUE,
			link: ORGANISATION_DASHBOARD_URL({ id: organisationId, tab: ETransactionTab.QUEUE })
		},
		{
			label: 'Multisig',
			tab: ETransactionTab.MULTISIGS,
			link: ORGANISATION_DASHBOARD_URL({ id: organisationId, tab: ETransactionTab.MULTISIGS })
		},
		{
			label: 'Transaction History',
			tab: ETransactionTab.HISTORY,
			link: ORGANISATION_DASHBOARD_URL({ id: organisationId, tab: ETransactionTab.HISTORY })
		},
	];

	return (
		<div className='flex flex-col gap-4'>
			<div className='flex justify-between items-center'>
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
				<div>
					<Button
						variant={EButtonVariant.SECONDARY}
						className='px-5 border-primary'
					>
						Filters
						<DownIcon />
					</Button>
				</div>
			</div>
			{selectedTab === ETransactionTab.QUEUE && <QuickQueue multisigs={multisigs} />}
			{selectedTab === ETransactionTab.MULTISIGS && <QuickMultisigs multisigs={multisigs} />}
			{selectedTab === ETransactionTab.HISTORY && <QuickHistory multisigs={multisigs} />}
		</div>
	);
}
