'use client';

import React, { PropsWithChildren } from 'react';
import { Layout as AntDLayout } from 'antd';
import NavHeader from '@common/global-ui-components/Layout/components/NavHeader';
import { IOrganisation } from '@common/types/substrate';
import Footer from './components/Footer';
import Menu from './components/Menu';

const { Sider, Content } = AntDLayout;

const classNames = {
	layoutContainer: 'w-full h-screen',
	sidebarHeaderAndFooter: 'bg-bg-main',
	content: 'bg-bg-secondary p-7 rounded-tl-3xl rounded-bl-3xl'
};

interface ILayoutProps extends PropsWithChildren {
	userAddress: string;
	organisations: Array<IOrganisation>;
	selectedOrganisation: IOrganisation;
}

export const Layout = ({ userAddress, organisations, children, selectedOrganisation }: ILayoutProps) => {
	return (
		<AntDLayout className={classNames.layoutContainer}>
			<Sider
				className={classNames.sidebarHeaderAndFooter}
				width={240}
			>
				<Menu
					userAddress={userAddress}
					organisation={selectedOrganisation}
				/>
			</Sider>
			<AntDLayout className={classNames.sidebarHeaderAndFooter}>
				<NavHeader
					organisations={organisations}
					userAddress={userAddress}
				/>
				<Content className={classNames.content}>{children}</Content>
				<Footer />
			</AntDLayout>
		</AntDLayout>
	);
};
