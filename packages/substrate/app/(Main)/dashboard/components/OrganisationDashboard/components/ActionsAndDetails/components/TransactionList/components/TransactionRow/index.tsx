// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable no-tabs */
import { ENetwork, ETransactionOptions, ETransactionType, ETxType, Wallet } from '@common/enum/substrate';
import { TransactionHead } from '@common/global-ui-components/Transaction/TransactionHead';
import { IMultisig } from '@common/types/substrate';
import { findMultisig } from '@common/utils/findMultisig';
import { ApiPromise } from '@polkadot/api';
import { userAtom } from '@substrate/app/atoms/auth/authAtoms';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useDecodeCallData } from '@substrate/app/global/hooks/queryHooks/useDecodeCallData';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import { useAtomValue } from 'jotai';

interface ITransactionRow {
	callData?: string;
	callHash: string;
	createdAt: Date;
	to: string;
	network: ENetwork;
	amountToken: string;
	from: string;
	type: ETransactionOptions;
	transactionType: ETransactionType;
	multisig: string;
}

function TransactionRow({
	callData,
	callHash,
	createdAt,
	to,
	network,
	amountToken,
	from,
	type,
	transactionType,
	multisig
}: ITransactionRow) {
	const { getApi } = useAllAPI();
	const user = useAtomValue(userAtom);
	const organisation = useAtomValue(organisationAtom);

	const { data, isLoading, error } = useDecodeCallData({
		callData,
		callHash,
		apiData: getApi(network)
	});

	const onActionClick = (type: ETxType) => {
		const api = getApi(network);
		const txMultisig = findMultisig(organisation?.multisigs || [], `${multisig}_${network}`);

		if (!api?.api || !user?.address || !txMultisig) {
			console.log('API not found', api, user, txMultisig, callData);
			return;
		}

		const wallet = (localStorage.getItem('wallet') as Wallet) || Wallet.POLKADOT;

		initiateTransaction({
			calldata: callData,
			callHash,
			type,
			api: api.api as ApiPromise,
			data: null,
			isProxy: false,
			sender: user.address,
			wallet,
			multisig: txMultisig
		});
	};

	const label = data?.method && data?.section ? `${data.section}_${data.method}` : '';
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<TransactionHead
			createdAt={createdAt}
			to={data?.to || to}
			network={network}
			amountToken={data?.value || amountToken}
			from={from}
			label={label.split('_')}
			type={type}
			transactionType={transactionType}
			onAction={onActionClick}
		/>
	);
}

export default TransactionRow;
