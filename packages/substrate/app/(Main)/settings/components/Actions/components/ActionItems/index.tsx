import { ESettingsTab } from '@common/enum/substrate';
import { Notifications } from '@substrate/app/(Main)/settings/components/Actions/components/Notifications';
import { Signatories } from '@substrate/app/(Main)/settings/components/Actions/components/Signatories';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import React from 'react';

interface IActionItems {
	selectedTab: ESettingsTab;
}

export const ActionItems = ({ selectedTab }: IActionItems) => {
	const [organisation] = useOrganisation();
	console.log('organisation', organisation);

	if (!organisation) {
		return <div>Loading...</div>;
	}

	return (
		<>
			{selectedTab === ESettingsTab.SIGNATORIES && <Signatories multisigs={organisation.multisigs} />}
			{selectedTab === ESettingsTab.NOTIFICATIONS && <Notifications />}
		</>
	);
};