import { ESettingsTab } from '@common/enum/substrate';
import { Notifications } from '@substrate/app/(Main)/settings/components/Actions/components/Notifications';
import { Signatories } from '@substrate/app/(Main)/settings/components/Actions/components/Signatories';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';
import React from 'react';

interface IActionItems {
	selectedTab: ESettingsTab;
}

export const ActionItems = ({ selectedTab }: IActionItems) => {
	const organisation = useAtomValue(organisationAtom);
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
