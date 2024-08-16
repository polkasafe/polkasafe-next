// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
// import { SubstrateAddress } from '@common/global-ui-components/SubstrateAddress';
// import { EProjectType } from '@common/constants/projectConstants';
// import { SplashScreen } from '@common/global-ui-components/LayoutWrapper/SplashScreen';
import { redirect } from 'next/navigation';
import { ISearchParams } from '@substrate/app/global/types';
import { getUserFromCookie } from '@substrate/app/global/lib/cookies';
import { LOGIN_URL, MULTISIG_DASHBOARD_URL, ORGANISATION_DASHBOARD_URL } from '../global/end-points';
// import { cookies } from 'next/headers';

export interface IHomeProps {
	searchParams: ISearchParams;
}

export default function Home({ searchParams }: IHomeProps) {
	const user = getUserFromCookie();
	const { _multisig, _organisation, _network } = searchParams;
	if (_organisation) {
		redirect(ORGANISATION_DASHBOARD_URL({ id: _organisation }));
	}
	if (_multisig && _network) {
		redirect(MULTISIG_DASHBOARD_URL({ multisig: _multisig, network: _network }));
	}
	if (!user) {
		redirect(LOGIN_URL);
	}
	redirect(ORGANISATION_DASHBOARD_URL({ id: user.organisations[0].id }));
}
