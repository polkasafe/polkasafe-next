import React from 'react';
import { Layout as AntDLayout } from 'antd';
import { useSearchParams, usePathname } from 'next/navigation';
import OrganisationDropdown from '@common/global-ui-components/OrganisationDropdown';
import Breadcrumb from '@common/global-ui-components/Breadcrumb';
import NotificationPopover from '@common/global-ui-components/NotificationPopover';
import DonateButton from '@common/global-ui-components/DonateButton';
import DocsButton from '@common/global-ui-components/DocsButton';
import UserPopover from '@common/global-ui-components/UserPopover';
import { IOrganisation } from '@common/types/substrate';

const { Header } = AntDLayout;

interface INavHeaderProps {
	organisations: Array<IOrganisation>;
	userAddress: string;
}

function NavHeader({ organisations, userAddress }: INavHeaderProps) {
	const organisationId = useSearchParams().get('_organisation');
	const selectedOrganisation = organisations.find((org) => org.id === organisationId) || organisations[0];
	const pathname = usePathname();

	return (
		<Header className='bg-bg-main flex items-center px-0 justify-between pr-3'>
			<div className='p-0 m-0'>
				<Breadcrumb link={pathname} />
			</div>
			<div className='flex items-center gap-x-3'>
				{organisations && organisations.length > 0 && (
					<OrganisationDropdown
						organisations={organisations}
						selectedOrganisation={selectedOrganisation}
					/>
				)}
				<NotificationPopover />
				{userAddress && <UserPopover userAddress={userAddress} />}
				<DonateButton />
				<DocsButton />
			</div>
		</Header>
	);
}

export default NavHeader;
