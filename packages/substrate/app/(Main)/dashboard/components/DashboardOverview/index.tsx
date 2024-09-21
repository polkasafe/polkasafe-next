// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { ENetwork, ETxType, Wallet } from '@common/enum/substrate';
import DashboardCard from '@common/global-ui-components/DashboardCard';
import { ICurrency, IGenericObject, IMultisig, ISendTransaction } from '@common/types/substrate';
import { ApiPromise } from '@polkadot/api';
import { useAssets } from '@substrate/app/atoms/assets/assetsAtom';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import { useAtomValue } from 'jotai';
import { DashboardProvider } from '@common/context/DashboarcContext';
import { currencyAtom, selectedCurrencyAtom } from '@substrate/app/atoms/currency/currencyAtom';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { BN } from '@polkadot/util';
import NewTransaction from '@common/modals/NewTransaction';
import ReviewTransaction from '@substrate/app/(Main)/components/ReviewTransaction';
import { newTransaction } from '@substrate/app/global/utils/newTransaction';
import { useQueueAtom } from '@substrate/app/atoms/transaction/transactionAtom';
import { notification } from '@common/utils/notification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { useSearchParams } from 'next/navigation';
import { getReviewTxCallData } from '@substrate/app/global/utils/getReviewCallData';
import OverviewCard from '@substrate/app/(Main)/dashboard/components/OverviewCard';

export function DashboardOverview() {
	const [assets] = useAssets();
	const currency = useAtomValue(selectedCurrencyAtom);
	const currencyValues = useAtomValue(currencyAtom);
	const [organisation] = useOrganisation();

	const proxyAddress = useSearchParams().get('_proxy');
	const address = useSearchParams().get('_multisig');
	const network = useSearchParams().get('_network') as ENetwork;

	const multisig = organisation?.multisigs?.find((item) => item.address === address && item.network === network);

	const allProxies = multisig?.proxy || [];
	const proxy = allProxies.find((item) => item.address === proxyAddress);

	const { getApi, allApi } = useAllAPI();
	const [user] = useUser();
	const [queueTransaction, setQueueTransactions] = useQueueAtom();

	const getCallData = ({
		multisigDetails,
		recipientAndAmount
	}: {
		multisigDetails: { address: string; network: ENetwork; name: string; proxy?: string };
		recipientAndAmount: { recipient: string; amount: BN }[];
	}): string => {
		return getReviewTxCallData({
			multisigDetails,
			recipientAndAmount,
			getApi
		});
	};

	const handleNewTransaction = async (values: ISendTransaction) => {
		if (!user) {
			return;
		}
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

		// Initiate the transaction
		await newTransaction(values, user, getApi, onSuccess);
	};

	const handleFundTransaction = async ({
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
			onNewTransaction={handleNewTransaction}
			onFundMultisig={handleFundTransaction}
			assets={assets}
			currency={currency}
			currencyValues={currencyValues || ({} as ICurrency)}
			multisigs={multisig ? [multisig] : organisation?.multisigs || []}
			addressBook={organisation?.addressBook || []}
			allApi={allApi}
			getCallData={getCallData}
			ReviewTransactionComponent={(values) => <ReviewTransaction {...values} />}
		>
			{multisig && network ? (
				<OverviewCard
					name={multisig.name}
					address={multisig.address}
					network={multisig.network}
					threshold={multisig.threshold}
					signatories={multisig.signatories}
				/>
			) : (
				<div className='flex flex-col gap-y-6'>
					<DashboardCard />
					<NewTransaction />
				</div>
			)}
		</DashboardProvider>
	);
}
