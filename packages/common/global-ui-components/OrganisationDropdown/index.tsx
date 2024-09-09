import React from 'react';
import { Dropdown, Skeleton } from 'antd';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import { ORGANISATION_DASHBOARD_URL } from '@substrate/app/global/end-points';
import { IOrganisation } from '@common/types/substrate';
import Link from 'next/link';
import Org from '@common/global-ui-components/OrganisationDropdown/Organisation';
import Image from 'next/image';
import emptyImage from '@common/assets/icons/empty-image.png';

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
					selectable: true,
					selectedKeys: [selectedOrganisation.id],
					defaultSelectedKeys: [selectedOrganisation.id],
					items: organisations.map((item) => ({
						key: item.id,
						label: (
							<Link
								className='flex items-center'
								href={ORGANISATION_DASHBOARD_URL({ id: item.id })}
							>
								<div className='flex items-center gap-x-3'>
									<Image
										width={30}
										height={30}
										className='rounded-full h-[30px] w-[30px]'
										src={emptyImage}
										alt='empty profile image'
									/>
									<div className='flex flex-col gap-y-[1px]'>
										<span className='text-sm text-white capitalize truncate max-w-[100px] font-bold'>{item.name}</span>
										<span className='text-xs text-text-secondary'>{item.multisigs?.length || 0} Multisigs</span>
									</div>
								</div>
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
