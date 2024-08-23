// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable no-tabs */

'use client';

import AccountSelectionForm from '@common/global-ui-components/AccountSelectionForm';
import Button from '@common/global-ui-components/Button';
import { WalletIcon } from '@common/global-ui-components/Icons';
import Loader from '@common/global-ui-components/Loder';
import WalletButtons from '@common/global-ui-components/WalletButtons';
import React, { useEffect, useState } from 'react';
import { InjectedAccount } from '@polkadot/extension-inject/types';
import { useRouter } from 'next/navigation';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { connectAddress } from '@substrate/app/(Login)/client-actions/connectAddress';
import { queueNotification } from '@common/global-ui-components/QueueNotification';
import { whitelist } from '@substrate/app/(Login)/login/utils/whiteList';
import { ERROR_MESSAGES } from '@substrate/app/global/genericErrors';
import { getSignature } from '@substrate/app/(Login)/login/utils/getSignature';
import { useSetAtom } from 'jotai';
import { TFAForm } from '@substrate/app/(Login)/login/components/TFAForm';
import { clientLogin } from '@substrate/app/(Login)/client-actions/client-login';
import { CREATE_ORGANISATION_URL, ORGANISATION_DASHBOARD_URL } from '@substrate/app/global/end-points';
import { userAtom } from '@substrate/app/atoms/auth/authAtoms';
import { NotificationStatus, Wallet } from '@common/enum/substrate';

export function SubstrateLoginForm() {
	const setAtom = useSetAtom(userAtom);

	const [accounts, setAccounts] = useState<InjectedAccount[]>([]);
	const [showAccountsDropdown, setShowAccountsDropdown] = useState(false);
	const [address, setAddress] = useState<string>('');
	const [loading, setLoading] = useState<boolean>(false);
	const [fetchAccountsLoading, setFetchAccountsLoading] = useState<boolean>(false);
	const [signing, setSigning] = useState<boolean>(false);
	const [noAccounts, setNoAccounts] = useState<boolean>(false);
	const [noExtension, setNoExtension] = useState<boolean>(false);
	const [selectedWallet, setSelectedWallet] = useState<Wallet>(Wallet.POLKADOT);
	const [tfaToken, setTfaToken] = useState<string>('');

	// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
	const [tokenExpired, setTokenExpired] = useState<boolean>(false);

	const router = useRouter();

	const onAccountChange = (a: string) => {
		setAddress(a);
	};

	useEffect(() => {
		if (accounts && accounts.length > 0) {
			setAddress(accounts[0].address);
		}
	}, [accounts]);

	const handleConnectWallet = async () => {
		try {
			const substrateAddress = getSubstrateAddress(address);
			if (!substrateAddress) {
				queueNotification({
					header: 'Failed',
					message: ERROR_MESSAGES.INVALID_SUBSTRATE_ADDRESS,
					status: NotificationStatus.ERROR
				});
				console.log('INVALID SUBSTRATE ADDRESS');
				return;
			}

			setLoading(true);
			const { data: token, error: tokenError } = await connectAddress(substrateAddress);

			if (tokenError) {
				queueNotification({
					header: 'Failed',
					message: ERROR_MESSAGES.UNAUTHORIZED,
					status: NotificationStatus.ERROR
				});
				console.log('ERROR', tokenError);
				setLoading(false);
			} else if (typeof token !== 'string' && token?.tfa_token && token?.tfa_token?.token) {
				setTfaToken(token.tfa_token.token);
				setLoading(false);
			} else {
				let signature = '';
				if (!whitelist.includes(getSubstrateAddress(address))) {
					setSigning(true);
					signature = await getSignature(selectedWallet, token, substrateAddress);
					setSigning(false);
				}
				const { data: userData, error: connectAddressErr } = (await clientLogin(substrateAddress, signature)) as any;

				setLoading(false);
				setSigning(false);

				if (connectAddressErr) {
					setLoading(false);
					setSigning(false);
					queueNotification({
						header: 'Failed',
						message: connectAddressErr,
						status: NotificationStatus.ERROR
					});
				}

				setLoading(false);
				setSigning(false);

				console.log('USER DATA', userData);

				// Update atom state
				setAtom({
					address: substrateAddress,
					signature,
					organisations: userData.organisations
				});

				if (userData.organisations.length > 0) {
					router.push(ORGANISATION_DASHBOARD_URL({ id: userData.organisations[0].id }));
					return;
				}
				router.push(CREATE_ORGANISATION_URL({ address: substrateAddress }));
			}
		} catch (error) {
			console.log('ERROR OCCURED', error);
			setLoading(false);
			setSigning(false);
		}
	};

	const handleSubmitAuthCode = async () => {
		const substrateAddress = getSubstrateAddress(address);
		if (!substrateAddress) {
			console.log('INVALID SUBSTRATE ADDRESS');
			return;
		}

		if (!tfaToken) return;

		setLoading(true);
		try {
			// const { data: token, error: validate2FAError } = await nextApiClientFetch<string>(
			// 	`${SUBSTRATE_API_AUTH_URL}/2fa/validate2FA`,
			// 	{
			// 		authCode,
			// 		tfa_token: tfaToken
			// 	},
			// 	{ address: substrateAddress }
			// );
			// if (validate2FAError) {
			// 	if (validate2FAError === '2FA token expired.') {
			// 		setTokenExpired(true);
			// 	}
			// 	queueNotification({
			// 		header: 'Failed',
			// 		message: validate2FAError,
			// 		status: NotificationStatus.ERROR
			// 	});
			// 	setLoading(false);
			// }
			// if (!validate2FAError && token) {
			// 	const injectedWindow = typeof window !== 'undefined' && (window as Window & InjectedWindow);
			// 	if (!injectedWindow) {
			// 		return;
			// 	}
			// 	const wallet = injectedWindow.injectedWeb3[selectedWallet];
			// 	if (!wallet) {
			// 		setLoading(false);
			// 		return;
			// 	}
			// 	const injected = wallet && wallet.enable && (await wallet.enable(APP_NAME));
			// 	const signRaw = injected && injected.signer && injected.signer.signRaw;
			// 	if (!signRaw) {
			// 		console.error('Signer not available');
			// 		return;
			// 	}
			// 	setSigning(true);
			// 	setTfaToken('');
			// 	const { signature } = await signRaw({
			// 		address: substrateAddress,
			// 		data: stringToHex(token),
			// 		type: 'bytes'
			// 	});
			// 	setSigning(false);
			// 	const { data: userData, error: connectAddressErr } = await userLogin(substrateAddress, signature);
			// 	if (!connectAddressErr && userData) {
			// 		setLoading(false);
			// 		setSigning(false);
			// 		if (typeof window !== 'undefined') {
			// 			localStorage.setItem('signature', signature);
			// 			localStorage.setItem('address', substrateAddress);
			// 			localStorage.setItem('logged_in_wallet', selectedWallet);
			// 		}
			// 		// Update atom state
			// 		// if (!userData?.organisations || userData?.organisations?.length === 0) {
			// 		// 	router.replace('/create-org');
			// 		// } else {
			// 		// 	router.replace('/');
			// 		// }
			// 	}
			// }
		} catch (error) {
			console.log(error);
			setLoading(false);
			setSigning(false);
			queueNotification({
				header: 'Failed',
				message: error,
				status: NotificationStatus.ERROR
			});
		}
	};

	if (tfaToken) {
		return (
			<TFAForm
				onSubmit={handleSubmitAuthCode}
				onCancel={() => {
					setTfaToken('');
					setTokenExpired(false);
				}}
				loginDisabled={(noExtension || noAccounts || !address) && showAccountsDropdown}
				loading={loading}
			/>
		);
	}

	return (
		<div>
			<h2 className='font-bold text-lg text-white'>Get Started</h2>
			<p className='mt-2  text-normal text-sm text-white'>Connect your wallet</p>
			<p className='text-text_secondary text-sm font-normal mt-5'>
				Your first step towards creating a safe & secure MultiSig
			</p>
			{showAccountsDropdown ? (
				<div className='mt-5'>
					<WalletButtons
						setNoAccounts={setNoAccounts}
						setFetchAccountsLoading={setFetchAccountsLoading}
						setNoExtenstion={setNoExtension}
						className='mb-4'
						setWallet={setSelectedWallet}
						setAccounts={setAccounts}
						loggedInWallet={selectedWallet}
					/>
					{fetchAccountsLoading ? (
						<Loader />
					) : noExtension ? (
						<p className='mt-2  text-normal text-sm text-white text-center capitalize'>
							Please Install {selectedWallet} Extension.
						</p>
					) : noAccounts ? (
						<p className='mt-2  text-normal text-sm text-white text-center'>
							No Accounts Found. Please Install the Extension And Add Accounts.
						</p>
					) : (
						<AccountSelectionForm
							disabled={loading}
							accounts={accounts}
							address={address}
							onAccountChange={onAccountChange}
							title='Choose linked account'
						/>
					)}
				</div>
			) : null}
			<Button
				disabled={(noExtension || noAccounts || !address) && showAccountsDropdown}
				icon={<WalletIcon />}
				loading={loading}
				onClick={async () => (showAccountsDropdown ? handleConnectWallet() : setShowAccountsDropdown(true))}
			>
				Connect Wallet
			</Button>
			{signing && <div className='text-white mt-1'>Please Sign This Randomly Generated Text To Login.</div>}
		</div>
	);
}
