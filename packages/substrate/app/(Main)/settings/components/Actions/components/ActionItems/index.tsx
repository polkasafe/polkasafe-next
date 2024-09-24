import { ESettingsTab } from '@common/enum/substrate';
import { Signatories } from '@substrate/app/(Main)/settings/components/Actions/components/Signatories';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { NotificationsUI } from '@common/global-ui-components/Notifications/index.tsx';
import TransactionFields from '@common/global-ui-components/TransactionFields';
import MultisigOverview from '@common/global-ui-components/MultisigOverview';
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
			{selectedTab === ESettingsTab.TRANSACTION_FIELDS && <TransactionFields transactionFields={organisation.transactionFields} />}
			{selectedTab === ESettingsTab.ADMIN && <AdminPanel />}
			{selectedTab === ESettingsTab.OVERVIEW && <MultisigOverview multisigs={organisation.multisigs} />}
		</>
	);
};
