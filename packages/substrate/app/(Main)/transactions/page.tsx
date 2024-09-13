// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { LOGIN_URL } from '@substrate/app/global/end-points';
import { isValidAddress } from '@substrate/app/global/utils/isValidAddress';
import { isValidNetwork } from '@substrate/app/global/utils/isValidNetwork';
import { redirect } from 'next/navigation';
import React from 'react';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@sdk/polkasafe-sdk/src/constants/pagination';
import { ISearchParams } from '@common/types/substrate';
import { ETransactionType } from '@common/enum/substrate';
import { isValidOrg } from '@substrate/app/global/utils/isValidOrg';
import { getMultisigTransactions } from './ssr-actions/getMultisigTransactions';
import TransactionTemplate from './components/TransactionTemplete';
import { getOrganisationTransactions } from '@substrate/app/(Main)/transactions/ssr-actions/getOrganisationTransaction';

interface ITransactionProps {
	searchParams: ISearchParams;
}

export default async function Transaction({ searchParams }: ITransactionProps) {
	const {
		_multisig,
		_organisation,
		_network,
		_type = ETransactionType.QUEUE_TRANSACTION,
		_page = DEFAULT_PAGE,
		_limit = DEFAULT_PAGE_SIZE
	} = searchParams;
	console.log('searchParams', searchParams);

	if (!_organisation && !_multisig) {
		//  if not found redirect to login page
		redirect(LOGIN_URL);
	}
	if (_organisation && !isValidOrg(_organisation)) {
		redirect('/404');
	}

	if (
		_organisation &&
		isValidOrg(_organisation) &&
		(_type === ETransactionType.HISTORY_TRANSACTION || _type === ETransactionType.QUEUE_TRANSACTION)
	) {
		const { transactions } = await getOrganisationTransactions(
			_organisation,
			_type as ETransactionType,
			Number(_page) || DEFAULT_PAGE,
			Number(_limit) || DEFAULT_PAGE_SIZE
		);
		return (
			<TransactionTemplate
				organisationId={_organisation}
				type={_type}
				transactions={transactions}
				address={_multisig}
				network={_network}
				page={Number(_page) || DEFAULT_PAGE}
				limit={Number(_limit) || DEFAULT_PAGE_SIZE}
			/>
		);
	}

	if (
		_multisig &&
		isValidAddress(_multisig) &&
		isValidNetwork(_network) &&
		(_type === ETransactionType.HISTORY_TRANSACTION || _type === ETransactionType.QUEUE_TRANSACTION)
	) {
		const { transactions } = await getMultisigTransactions(
			_type,
			_multisig,
			_network,
			Number(_page) || DEFAULT_PAGE,
			Number(_limit) || DEFAULT_PAGE_SIZE
		);
		return (
			<TransactionTemplate
				organisationId={_organisation}
				type={_type}
				transactions={transactions}
				address={_multisig}
				network={_network}
				page={Number(_page) || DEFAULT_PAGE}
				limit={Number(_limit) || DEFAULT_PAGE_SIZE}
			/>
		);
	}
	return <div>Transaction</div>;
}
