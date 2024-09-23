import { ESettingsTab } from '@common/enum/substrate';
import { Signatories } from '@substrate/app/(Main)/settings/components/Actions/components/Signatories';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { NotificationsUI } from '@common/global-ui-components/Notifications/index.tsx';
import { AdminPanel } from '@common/global-ui-components/AdminPanel/index';
import React from 'react';
import { Skeleton } from 'antd';

interface IActionItems {
	selectedTab: ESettingsTab;
}

export const ActionItems = ({ selectedTab }: IActionItems) => {
	const [organisation] = useOrganisation();
	console.log('organisation', organisation);

	if (!organisation) {
		return <Skeleton active />;
	}

	return (
		<>
			{selectedTab === ESettingsTab.SIGNATORIES && <Signatories multisigs={organisation.multisigs} />}
			{selectedTab === ESettingsTab.NOTIFICATIONS && <NotificationsUI />}
			{selectedTab === ESettingsTab.ADMIN && <AdminPanel />}
		</>
	);
};
