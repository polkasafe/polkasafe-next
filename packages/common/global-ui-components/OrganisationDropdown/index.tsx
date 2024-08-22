import React from 'react';
import { CircleArrowDownIcon } from '@common/global-ui-components/Icons';
import Image from 'next/image';
import emptyImage from '@common/assets/icons/empty-image.png';
import { Dropdown } from 'antd';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import { useRouter } from 'next/navigation';
import { ORGANISATION_DASHBOARD_URL } from '@substrate/app/global/end-points';
import { IOrganisation } from '@common/types/substrate';

interface IOrganisationDropdown {
	organisations: Array<IOrganisation>;
	selectedOrganisation: IOrganisation;
}

// TODO: tailwind need to update
function OrganisationDropdown({ organisations, selectedOrganisation }: IOrganisationDropdown) {
	const router = useRouter();
	return (
		<SlideInMotion>
			<Dropdown
				trigger={['click']}
				className='w-52 my-2 px-2 py-1 bg-org-gradient rounded-2xl cursor-pointer'
				menu={{
					items: organisations.map((item) => ({
						key: item.id,
						label: <span className='text-white capitalize truncate'>{item.name}</span>
					})),
					onClick: (e) => {
						router.push(ORGANISATION_DASHBOARD_URL({ id: e.key }));
					}
				}}
			>
				<div className='flex justify-between items-center text-white gap-x-2'>
					<div className='flex items-center gap-x-3'>
						<Image
							width={30}
							height={30}
							className='rounded-full h-[30px] w-[30px]'
							src={emptyImage}
							alt='empty profile image'
						/>
						<div className='flex flex-col gap-y-[1px]'>
							<span className='text-sm text-white capitalize truncate max-w-[100px]'>{selectedOrganisation.name}</span>
							<span className='text-xs text-text-secondary'>{selectedOrganisation.members.length || 0} Members</span>
						</div>
					</div>
					<CircleArrowDownIcon className='text-white' />
				</div>
			</Dropdown>
		</SlideInMotion>
	);
}

export default OrganisationDropdown;
