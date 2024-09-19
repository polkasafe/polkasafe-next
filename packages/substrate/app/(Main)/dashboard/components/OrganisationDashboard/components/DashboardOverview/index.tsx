// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { ENetwork, ETxType, Wallet } from '@common/enum/substrate';
import DashboardCard from '@common/global-ui-components/DashboardCard';
import { ICurrency, IMultisig, ISendTransaction } from '@common/types/substrate';
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
import { SubmittableExtrinsic } from '@polkadot/api/types';
import ReviewTransaction from '@substrate/app/(Main)/components/ReviewTransaction';

export function DashboardOverview() {
	const [assets] = useAssets();
	const currency = useAtomValue(selectedCurrencyAtom);
	const currencyValues = useAtomValue(currencyAtom);
	const [organisation] = useOrganisation();
	const org = organisation;
	const { getApi, allApi } = useAllAPI();
	const [user] = useUser();

	const getCallData = ({ multisigDetails, recipientAndAmount }: { multisigDetails: { address: string; network: ENetwork, name: string; proxy?: string }, recipientAndAmount: { recipient: string; amount: BN }[] }): string => {
		if (
			!allApi ||
			!multisigDetails ||
			!allApi[multisigDetails.network] ||
			!allApi[multisigDetails.network].apiReady ||
			!recipientAndAmount ||
			recipientAndAmount.some((item) => item.recipient === '' || item.amount.isZero())
		)
			return '';

		const { network } = multisigDetails;

		const batch = allApi[network].api.tx.utility.batchAll(
			recipientAndAmount.map((item) =>
				allApi[network].api.tx.balances.transferKeepAlive(item.recipient, item.amount.toString())
			)
		);
		let tx: SubmittableExtrinsic<'promise'>;
		if (multisigDetails.proxy) {
			tx = allApi[network].api.tx.proxy.proxy(multisigDetails.proxy, null, batch);
			return tx.method.toHex();
		} else {
			return batch.method.toHex();
		}
	}

	const handleNewTransaction = async (values: ISendTransaction) => {
		if (!user) {
			return;
		}
		const { address } = user;
		const { recipients, sender: multisig } = values;
		const wallet = (localStorage.getItem('wallet') as Wallet) || Wallet.POLKADOT;
		const apiAtom = getApi(multisig.network);
		if (!apiAtom) {
			return;
		}
		const { api } = apiAtom as { api: ApiPromise };
		if (!api || !api.isReady) {
			return;
		}
		const data = recipients.map((recipient) => ({
			amount: recipient.amount,
			recipient: recipient.address
		}));
		await initiateTransaction({
			wallet,
			type: ETxType.TRANSFER,
			api,
			data,
			isProxy: false,
			proxyAddress: '',
			multisig,
			sender: address
		});
	};
	const handleFundTransaction = async ({ multisigAddress, amount }: { amount: string; multisigAddress: IMultisig }) => {
		if (!user) {
			return;
		}
		const { address } = user;
		const wallet = (localStorage.getItem('wallet') as Wallet) || Wallet.POLKADOT;
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
			isProxy: false,
			proxyAddress: '',
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
			currencyValues={currencyValues || {} as ICurrency}
			multisigs={org?.multisigs || []}
			addressBook={org?.addressBook || []}
			allApi={allApi}
			getCallData={getCallData}
			ReviewTransactionComponent={(values) => <ReviewTransaction { ...values } />}
		>
			<div className='flex flex-col gap-y-6'>
				<DashboardCard />
				<NewTransaction />
			</div>
		</DashboardProvider>
	);
}
