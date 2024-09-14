import { ESettingsTab } from '@common/enum/substrate';
import { Notifications } from '@substrate/app/(Main)/settings/components/Actions/components/Notifications';
import { Signatories } from '@substrate/app/(Main)/settings/components/Actions/components/Signatories';
import React from 'react';

interface IActionItems {
	selectedTab: ESettingsTab;
}

export const ActionItems = ({ selectedTab }: IActionItems) => {
	return (
		<>
			{selectedTab === ESettingsTab.SIGNATORIES && <Signatories />}
			{selectedTab === ESettingsTab.NOTIFICATIONS && <Notifications />}
		</>
	);
};
