// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { ETxType, Wallet } from '@common/enum/substrate';
import DashboardCard from '@common/global-ui-components/DashboardCard';
import { IMultisig, ISendTransaction } from '@common/types/substrate';
import { ApiPromise } from '@polkadot/api';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import { useAtomValue } from 'jotai';
import { DashboardProvider } from '@common/context/DashboarcContext';
import { selectedCurrencyAtom } from '@substrate/app/atoms/currency/currencyAtom';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { BN } from '@polkadot/util';
import NewTransaction from '@common/modals/NewTransaction';

export function DashboardOverview() {
	const assets = useAtomValue(assetsAtom);
	const currency = useAtomValue(selectedCurrencyAtom);
	const [organisation] = useOrganisation();
	const org = organisation;
	const { getApi } = useAllAPI();
	const [user] = useUser();

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
			multisigs={org?.multisigs || []}
		>
			<div className='flex flex-col gap-y-6'>
				<DashboardCard />
				<NewTransaction />
			</div>
		</DashboardProvider>
	);
}
