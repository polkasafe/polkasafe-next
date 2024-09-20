// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import OverviewCard from './components/OverviewCard';
import { IMultisig } from '@common/types/substrate';
import SelectAccount from '@substrate/app/(Main)/dashboard/components/MultisigDashboard/components/SelectAccount';
import { ActionAndDetails } from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails';
import { ETransactionTab } from '@common/enum/substrate';
import { Suspense } from 'react';

interface IMultisigDashboardProps {
	multisig: IMultisig;
	tab: ETransactionTab;
	id: string;
}

function MultisigDashboard({ multisig, id, tab }: IMultisigDashboardProps) {
	return (
		<div className='flex flex-col gap-5 h-full'>
			<div className='grid grid-cols-3 gap-x-6'>
				<div className='col-span-2'>
					<OverviewCard
						address={multisig.address}
						network={multisig.network}
						signatories={multisig.signatories}
						threshold={multisig.threshold}
						name={multisig.name}
					/>
				</div>
				<div className='col-span-1'>
					<SelectAccount multisig={multisig} />
				</div>
			</div>
			<div className='bg-bg-main rounded-3xl p-5 h-full'>
				<Suspense key={JSON.stringify(multisig)}>
					<ActionAndDetails
						multisigs={[multisig]}
						organisationId={id}
						selectedTab={tab}
						multisig={multisig.address}
						network={multisig.network}
					/>
				</Suspense>
			</div>
		</div>
	);
}

export default MultisigDashboard;
