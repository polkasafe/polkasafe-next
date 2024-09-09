import React from 'react';
import { Dropdown, Skeleton } from 'antd';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import { ORGANISATION_DASHBOARD_URL } from '@substrate/app/global/end-points';
import { IOrganisation } from '@common/types/substrate';
import Link from 'next/link';
import Org from '@common/global-ui-components/OrganisationDropdown/Organisation';

interface IOrganisationDropdown {
	organisations: Array<IOrganisation>;
	selectedOrganisation: IOrganisation | null;
}

// TODO: tailwind need to update
function OrganisationDropdown({ organisations, selectedOrganisation }: IOrganisationDropdown) {
	return (
		<SlideInMotion>
			<Dropdown
				trigger={['click']}
				className='my-2'
				menu={{
					items: organisations.map((item) => ({
						key: item.id,
						label: (
							<Link href={ORGANISATION_DASHBOARD_URL({ id: item.id })}>
								<span className='text-white capitalize truncate'>{item.name}</span>
							</Link>
						),
						children: ['Multisig 1', 'Multisig 2']?.map((m) => ({
							key: m,
							label: <span className='text-white capitalize truncate'>{m}</span>
						}))
					}))
				}}
			>
				{selectedOrganisation ? (
					<div>
						<Org selectedOrganisation={selectedOrganisation} />
					</div>
				) : (
					<Skeleton />
				)}
			</Dropdown>
		</SlideInMotion>
	);
}

export default OrganisationDropdown;
