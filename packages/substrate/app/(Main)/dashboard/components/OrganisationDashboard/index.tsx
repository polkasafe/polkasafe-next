// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { getOrganisationData } from '@substrate/app/(Main)/dashboard/ssr-actions/getOrganisationData';
import Secure from '@substrate/app/(Main)/Secure';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { ASSETS_ORGANISATION_URL } from '@substrate/app/global/end-points';
import Link from 'next/link';

import RightArrowOutlined from '@common/assets/icons/RightArrowOutlined.svg';
import { ActionAndDetails } from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails';
import { DashboardOverview } from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/DashboardOverview';
import AssetsOverview from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/AssetsOverview';
import { Suspense } from 'react';
import { ETransactionTab } from '@common/enum/substrate';

interface IOrganisationDashboard {
	id: string;
	selectedTab: ETransactionTab;
}

export default async function OrganisationDashboard({ id, selectedTab }: IOrganisationDashboard) {
	const data = await getOrganisationData(id);

	return (
		<Secure>
			<div className='flex flex-col gap-5 h-full'>
				<div className='flex gap-5'>
					<div className='flex flex-col gap-4 basis-[55%]'>
						<Typography variant={ETypographyVariants.h1}>Overview</Typography>
						<DashboardOverview />
					</div>
					<div className='flex flex-col gap-4 basis-[45%]'>
						<div className='flex justify-between items-center'>
							<Typography variant={ETypographyVariants.h1}>Assets</Typography>
							<Link
								href={ASSETS_ORGANISATION_URL({ id })}
								className='flex gap-2 items-center text-text-outline-primary'
							>
								View All <RightArrowOutlined />
							</Link>
						</div>
						<AssetsOverview />
					</div>
				</div>
				<div className='bg-bg-main rounded-3xl p-5 h-full'>
					<Suspense key={id}>
						<ActionAndDetails
							multisigs={data?.organisationData?.multisigs || []}
							organisationId={id}
							selectedTab={selectedTab}
						/>
					</Suspense>
				</div>
			</div>
		</Secure>
	);
}
