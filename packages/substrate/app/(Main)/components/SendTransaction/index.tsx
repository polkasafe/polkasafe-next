// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { ENetwork, ETransactionState, ETxType, Wallet } from '@common/enum/substrate';
import {
	IGenericObject,
	IMultisig,
	IReviewTransaction,
	ISendTransaction,
	ISubstrateExecuteProps
} from '@common/types/substrate';
import { ApiPromise } from '@polkadot/api';
import { useAssets } from '@substrate/app/atoms/assets/assetsAtom';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import { useAtomValue } from 'jotai';
import { DashboardProvider } from '@common/context/DashboarcContext';
import { selectedCurrencyAtom } from '@substrate/app/atoms/currency/currencyAtom';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { BN } from '@polkadot/util';
import { useQueueAtom } from '@substrate/app/atoms/transaction/transactionAtom';
import { ERROR_MESSAGES, INFO_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { PropsWithChildren, useState } from 'react';
import { setSigner } from '@substrate/app/global/utils/setSigner';
import { executeTx } from '@substrate/app/global/utils/executeTransaction';
import { TRANSACTION_BUILDER } from '@substrate/app/global/utils/transactionBuilder';
import { useNotification } from '@common/utils/notification';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';

interface ISendTransactionProps {
	address: string | null;
	network?: ENetwork;
	proxyAddress: string | null;
}

export function SendTransaction({
	children,
	address,
	network,
	proxyAddress
}: PropsWithChildren<ISendTransactionProps>) {
	// Atoms Hooks
	const [data] = useAssets();
	const currency = useAtomValue(selectedCurrencyAtom);
	const [organisation] = useOrganisation();
	const { getApi, allApi } = useAllAPI();
	const [user] = useUser();
	const [queueTransaction, setQueueTransactions] = useQueueAtom();

	const notification = useNotification();

	// States
	const [transactionState, setTransactionState] = useState(ETransactionState.BUILD);
	const [executableTransaction, setExecutableTransaction] = useState<ISubstrateExecuteProps | null>(null);
	const [reviewTransaction, setReviewTransaction] = useState<IReviewTransaction | null>(null);

	// Get multisig and proxy details
	const multisig = organisation?.multisigs?.find((item) => item.address === address && item.network === network);
	const allProxies = multisig?.proxy || [];
	const proxy = allProxies.find((item) => item.address === proxyAddress);
	const assets = data?.assets;

	const buildTransaction = async (values: ISendTransaction) => {
		// After successful transaction add the transaction to the queue with the latest transaction on top
		const onSuccess = ({ newTransaction }: IGenericObject) => {
			try {
				if (!queueTransaction) {
					return;
				}
				const payload = [newTransaction, ...(queueTransaction?.transactions || [])];
				setQueueTransactions({ ...queueTransaction, transactions: payload });
				notification(SUCCESS_MESSAGES.TRANSACTION_SUCCESS);
			} catch (error) {
				notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: error || error.message });
			}
		};
		try {
			if (!user) {
				notification({ ...ERROR_MESSAGES.AUTHENTICATION_FAILED });
				return;
			}
			const { address } = user;
			const { recipients, sender: multisig, selectedProxy } = values;
			const apiAtom = getApi(multisig.network);

			if (!apiAtom) {
				notification({ ...ERROR_MESSAGES.API_NOT_CONNECTED });
				return;
			}

			const { api } = apiAtom as { api: ApiPromise };
			if (!api || !api.isReady) {
				notification({ ...ERROR_MESSAGES.API_NOT_CONNECTED });
				return;
			}

			const data = recipients.map((recipient) => ({
				amount: recipient.amount,
				recipient: recipient.address
			}));

			const transaction = (await TRANSACTION_BUILDER.Transfer({
				type: ETxType.TRANSFER,
				api,
				data,
				params: {
					tip: values.tip
				},
				isProxy: Boolean(selectedProxy),
				proxyAddress: selectedProxy,
				multisig,
				sender: address,
				onSuccess
			})) as ISubstrateExecuteProps;

			if (!transaction) {
				notification({ ...ERROR_MESSAGES.TRANSACTION_BUILD_FAILED });
				return;
			}

			const fee = (await transaction.tx.paymentInfo(address)).partialFee;
			console.log(fee.toString());
			const formattedFee = formatBalance(
				fee.toString(),
				{
					numberAfterComma: 3,
					withThousandDelimitor: false
				},
				multisig.network
			);

			const reviewData = {
				tx: transaction.tx.method.toJSON(),
				from: values.sender,
				to: values.recipients[0].address,
				proxyAddress: values.selectedProxy,
				txCost: formattedFee.toString()
			};
			setExecutableTransaction(transaction);
			setReviewTransaction(reviewData);
			setTransactionState(ETransactionState.REVIEW);
		} catch (error) {
			notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: error || error.message });
			console.log(error);
		}
	};

	const signTransaction = async () => {
		try {
			if (!executableTransaction) {
				notification({ ...ERROR_MESSAGES.TRANSACTION_BUILD_FAILED });
				return;
			}
			const wallet = localStorage.getItem('logged_in_wallet') as Wallet;
			await setSigner(executableTransaction.api, wallet, executableTransaction.network);
			await executeTx(executableTransaction);
			notification({ ...INFO_MESSAGES.TRANSACTION_IN_BLOCK });
			setTransactionState(ETransactionState.CONFIRM);
		} catch (e) {
			notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: e || e.message });
			setTransactionState(ETransactionState.FAILED);
		}
	};

	const fundTransaction = async ({
		multisigAddress,
		amount,
		selectedProxy
	}: {
		amount: string;
		multisigAddress: IMultisig;
		selectedProxy?: string;
	}) => {
		if (!user) {
			return;
		}
		const { address } = user;
		const wallet = (localStorage.getItem('logged_in_wallet') as Wallet) || Wallet.POLKADOT;
		const apiAtom = getApi(multisigAddress.network);
		if (!apiAtom) {
			return;
		}
		const { api } = apiAtom as { api: ApiPromise };
		if (!api || !api.isReady) {
			return;
		}
		await initiateTransaction({
			wallet,
			type: ETxType.FUND,
			api,
			data: [{ amount: new BN(amount), recipient: multisigAddress.address }],
			isProxy: !!selectedProxy,
			proxyAddress: selectedProxy,
			multisig: multisigAddress,
			sender: address
		});
	};

	return (
		<DashboardProvider
			buildTransaction={buildTransaction}
			signTransaction={signTransaction}
			onFundMultisig={fundTransaction}
			reviewTransaction={reviewTransaction}
			assets={assets || null}
			currency={currency}
			multisigs={multisig ? [multisig] : organisation?.multisigs || []}
			addressBook={organisation?.addressBook || []}
			allApi={allApi}
			transactionState={transactionState}
			setTransactionState={setTransactionState}
		>
			{children}
		</DashboardProvider>
	);
}
