// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { LOGIN_URL } from '@substrate/app/global/end-points';
import { ISearchParams } from '@substrate/app/global/types';
import { isValidAddress } from '@substrate/app/global/utils/isValidAddress';
import { isValidNetwork } from '@substrate/app/global/utils/isValidNetwork';
import { redirect } from 'next/navigation';
import React from 'react';
import { getMultisigAssets } from './ssr-actions/getMultisigAssets';
import AssetsTemplate from './components/AssetsTemplate';

interface IAssetsProps {
	searchParams: ISearchParams;
}

async function Assets({ searchParams }: IAssetsProps) {
	const { _multisig, _organisation, _network } = searchParams;

	if (!_organisation && !_multisig) {
		// check local storage for login user details
		//  if not found redirect to login page
		redirect(LOGIN_URL);
	}

	if (_organisation && !isValidAddress(_organisation)) {
		redirect('/404');
	}

	if (_multisig && (!isValidAddress(_multisig) || !isValidNetwork(_network))) {
		redirect('/404');
	}

	if (_organisation) {
		const { assets } = await getMultisigAssets(_multisig, _network);
		return <AssetsTemplate assets={assets} />;
	}

	if (_multisig && isValidAddress(_multisig) && isValidNetwork(_network)) {
		const { assets } = await getMultisigAssets(_multisig, _network);
		return <AssetsTemplate assets={assets} />;
	}
	return null;
}

export default Assets;
