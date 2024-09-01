// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LOGIN_URL } from '@substrate/app/global/end-points';
import { isValidAddress } from '@substrate/app/global/utils/isValidAddress';
import { redirect } from 'next/navigation';
import React from 'react';
import { isValidNetwork } from '@substrate/app/global/utils/isValidNetwork';
import OrganisationDashboard from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard';
import { ISearchParams } from '@common/types/substrate';
import { ETransactionTab } from '@common/enum/substrate';
import { getMultisigDataAndTransactions } from './ssr-actions/getMultisigDataAndTransactions';
import MultisigDashboard from './components/MultisigDashboard';

interface IDashboardProps {
	searchParams: ISearchParams;
}

async function Dashboard({ searchParams }: IDashboardProps) {
	const { _multisig, _organisation, _network, _tab } = searchParams;

	if (!_organisation && !_multisig) {
		//  if not found redirect to login page
		redirect(LOGIN_URL);
	}

	if (_organisation) {
		// if organisation found then render organisation dashboard
		return (
			<OrganisationDashboard
				id={_organisation}
				selectedTab={(_tab as ETransactionTab) || ETransactionTab.HISTORY}
			/>
		);
	}

	if (_multisig && (!isValidAddress(_multisig) || !isValidNetwork(_network))) {
		redirect('/404');
	}

	if (_multisig && isValidAddress(_multisig) && isValidNetwork(_network)) {
		const { multisig, history, queue } = await getMultisigDataAndTransactions(_multisig, _network);
		if (!multisig) {
			redirect('/404');
		}

		if (!history && !queue) {
			redirect('/404');
		}
		return (
			<MultisigDashboard
				multisig={multisig}
				transactions={history.transactions}
				queueTransactions={queue.transactions || []}
			/>
		);
	}
}

export default Dashboard;
