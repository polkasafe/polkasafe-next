// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable no-tabs */
import { ENetwork, ETransactionOptions, ETransactionType, ETxType, Wallet } from '@common/enum/substrate';
import { CircleArrowDownIcon } from '@common/global-ui-components/Icons';
import { TransactionHead } from '@common/global-ui-components/Transaction/TransactionHead';
import TransactionDetails from '@common/global-ui-components/Transaction/TransactionDetails';
import { findMultisig } from '@common/utils/findMultisig';
import { ApiPromise } from '@polkadot/api';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useDecodeCallData } from '@substrate/app/global/hooks/queryHooks/useDecodeCallData';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import { Collapse } from 'antd';
import { twMerge } from 'tailwind-merge';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { useHistoryAtom, useQueueAtom } from '@substrate/app/atoms/transaction/transactionAtom';
import { IGenericObject } from '@common/types/substrate';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { useNotification } from '@common/utils/notification';

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
	approvals: Array<string>;
	onlyHeader: boolean;
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
	multisig,
	approvals = [],
	onlyHeader = false
}: ITransactionRow) {
	const { getApi } = useAllAPI();
	const [user] = useUser();
	const [organisation] = useOrganisation();
	const [queueTransaction, setQueueTransactions] = useQueueAtom();
	const [historyTransaction, setHistoryTransaction] = useHistoryAtom();
	const notification = useNotification();

	const { data, isLoading, error } = useDecodeCallData({
		callData,
		callHash,
		apiData: getApi(network)
	});

	const txMultisig = findMultisig(organisation?.multisigs || [], `${multisig}_${network}`);

	const hasApproved = approvals
		.map((a) => getSubstrateAddress(a))
		.includes(getSubstrateAddress(user?.address || '') || '');

	const onActionClick = (type: ETxType) => {
		const api = getApi(network);

		if (!api?.api || !user?.address || !txMultisig) {
			console.log('API not found', api, user, txMultisig, callData);
			return;
		}

		const wallet = (localStorage.getItem('logged_in_wallet') as Wallet) || Wallet.POLKADOT;

		// After successful transaction add the transaction to the queue with the latest transaction on top
		const onSuccess = ({ callHash }: IGenericObject) => {
			try {
				if (!callHash || !queueTransaction) {
					return;
				}
				if (type === ETxType.APPROVE) {
					const payload = (queueTransaction?.transactions || []).map((tx) => {
						if (tx.callHash === callHash) {
							const approvals = tx.approvals || [];
							if (!approvals.includes(user.address)) {
								approvals.push(user.address);
							}
							const multisig = findMultisig(organisation?.multisigs || [], `${tx.multisigAddress}_${tx.network}`);
							if (approvals.length === multisig?.threshold) {
								if (!historyTransaction) {
									return null;
								}
								setHistoryTransaction({
									...historyTransaction,
									transactions: [tx, ...historyTransaction.transactions]
								});
								return null;
							}

							return { ...tx, approvals };
						}
						return tx;
					});

					const transactions = payload.filter((tx) => tx !== null);

					setQueueTransactions({ ...queueTransaction, transactions });
				} else {
					const payload = (queueTransaction?.transactions || []).filter((tx) => tx.callHash !== callHash);
					const transactions = payload;
					setQueueTransactions({ ...queueTransaction, transactions });
				}

				notification(SUCCESS_MESSAGES.TRANSACTION_SUCCESS);
			} catch (error) {
				notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: error || error.message });
			}
		};

		initiateTransaction({
			calldata: callData,
			callHash,
			type,
			api: api.api as ApiPromise,
			data: null,
			isProxy: false,
			sender: user.address,
			wallet,
			multisig: txMultisig,
			onSuccess
		});
	};

	const label = data?.method && data?.section ? `${data.section}_${data.method}` : '';
	if (isLoading) {
		return <div>Loading...</div>;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	const value = data?.value
		? formatBalance(
				data?.value,
				{
					numberAfterComma: 2,
					withThousandDelimitor: false
				},
				network
			)
		: amountToken;

	if (onlyHeader) {
		return (
			<TransactionHead
				createdAt={createdAt}
				to={data?.to || to}
				network={network}
				amountToken={value}
				from={from}
				label={label.split('_')}
				type={type}
				transactionType={transactionType}
				onAction={onActionClick}
				isHomePage
			/>
		);
	}

	return (
		<Collapse
			className={'bg-bg-secondary rounded-xl'}
			expandIconPosition='end'
			expandIcon={({ isActive }) => (
				<CircleArrowDownIcon className={twMerge('text-primary text-lg', isActive && 'rotate-[180deg]')} />
			)}
			// defaultActiveKey={[item.address]}
			items={[
				{
					key: callHash,
					label: (
						<TransactionHead
							createdAt={createdAt}
							to={data?.to || to}
							network={network}
							amountToken={value}
							from={from}
							label={label.split('_')}
							type={type}
							transactionType={transactionType}
							onAction={onActionClick}
							approvals={approvals}
							threshold={txMultisig?.threshold || 2}
							hasApproved={hasApproved}
						/>
					),
					children: (
						<TransactionDetails
							createdAt={createdAt}
							to={data?.to || to}
							network={network}
							amountToken={value}
							from={from}
							type={type}
							transactionType={transactionType}
							onAction={onActionClick}
							approvals={approvals}
							threshold={txMultisig?.threshold || 2}
							hasApproved={hasApproved}
							callHash={callHash}
							callData={callData}
						/>
					)
				}
			]}
		/>
	);
}

export default TransactionRow;
