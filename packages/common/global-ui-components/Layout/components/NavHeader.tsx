import React from 'react';
import { Layout as AntDLayout } from 'antd';
import { usePathname } from 'next/navigation';
import Breadcrumb from '@common/global-ui-components/Breadcrumb';
import NotificationPopover from '@common/global-ui-components/NotificationPopover';
import DonateButton from '@common/global-ui-components/DonateButton';
import DocsButton from '@common/global-ui-components/DocsButton';
import UserPopover from '@common/global-ui-components/UserPopover';

const { Header } = AntDLayout;

interface INavHeaderProps {
	userAddress: string;
}

function NavHeader({ userAddress }: INavHeaderProps) {
	const pathname = usePathname();

	return (
		<Header className='bg-bg-main flex items-center px-0 justify-between pr-3'>
			<div className='p-0 m-0'>
				<Breadcrumb link={pathname} />
			</div>
			<div className='flex items-center gap-x-3'>
				<NotificationPopover />
				{userAddress && <UserPopover userAddress={userAddress} />}
				<DonateButton />
				<DocsButton />
			</div>
		</Header>
	);
}

export default NavHeader;
