// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Injected, InjectedAccount, InjectedWindow } from '@polkadot/extension-inject/types';
import React, { useCallback, useEffect, useState } from 'react';
import PolkadotWalletIcon from '@common/assets/wallet-icons/polkadotjs-icon.svg';
import SubWalletIcon from '@common/assets/wallet-icons/subwallet-icon.svg';
import TalismanIcon from '@common/assets/wallet-icons/talisman-icon.svg';
import WalletConnectLogo from '@common/assets/wallet-icons/wallet-connect-logo.svg';
import { twMerge } from 'tailwind-merge';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import WalletButton from '@common/global-ui-components/WalletButton';
import APP_NAME from '@common/constants/appName';
import { Wallet } from '@common/enum/substrate';
import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import { useAtomValue } from 'jotai';

interface IWalletButtons {
	loggedInWallet: Wallet;
	setAccounts: React.Dispatch<React.SetStateAction<InjectedAccount[]>>;
	setWallet?: React.Dispatch<React.SetStateAction<Wallet>>;
	className?: string;
	setNoExtenstion?: React.Dispatch<React.SetStateAction<boolean>>;
	setNoAccounts?: React.Dispatch<React.SetStateAction<boolean>>;
	setFetchAccountsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
	wcAtom?: any;
}

const WalletButtons: React.FC<IWalletButtons> = ({
	loggedInWallet,
	setAccounts,
	setWallet,
	className,
	setNoAccounts,
	setNoExtenstion,
	setFetchAccountsLoading,
	wcAtom
}: IWalletButtons) => {
	const [selectedWallet, setSelectedWallet] = useState<Wallet>(Wallet.POLKADOT);

	const { connect, session } = useAtomValue(wcAtom) as { connect: any; session: any };

	const getAccounts = useCallback(
		async (chosenWallet: Wallet): Promise<undefined> => {
			if (typeof window !== 'undefined') {
				const injectedWindow = window as Window & InjectedWindow;

				const wallet = injectedWindow.injectedWeb3[chosenWallet];

				if (!wallet) {
					setNoExtenstion?.(true);
					return;
				}

				setFetchAccountsLoading?.(true);
				let injected: Injected | undefined;
				try {
					injected = await new Promise((resolve, reject) => {
						const timeoutId = setTimeout(() => {
							reject(new Error('Wallet Timeout'));
						}, 60000); // wait 60 sec

						if (wallet && wallet.enable) {
							wallet
								.enable(APP_NAME)
								.then((value) => {
									clearTimeout(timeoutId);
									resolve(value);
								})
								.catch((error) => {
									reject(error);
								});
						}
					});
				} catch (err) {
					setFetchAccountsLoading?.(false);
					console.log(err?.message);
				}
				if (!injected) {
					setFetchAccountsLoading?.(false);
					return;
				}

				const accounts = await injected.accounts.get();

				if (accounts.length === 0) {
					setFetchAccountsLoading?.(false);
					setNoAccounts?.(true);
					return;
				}
				setFetchAccountsLoading?.(false);

				setAccounts(
					accounts.map((account) => ({
						...account,
						address: getSubstrateAddress(account.address) || account.address
					}))
				);
			}
		},
		[setAccounts, setFetchAccountsLoading, setNoAccounts, setNoExtenstion]
	);

	useEffect(() => {
		getAccounts(loggedInWallet);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const handleWalletClick = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, wallet: Wallet) => {
		setAccounts([]);
		setNoAccounts?.(false);
		setNoExtenstion?.(false);
		event.preventDefault();
		setSelectedWallet(wallet);
		setWallet?.(wallet);
		if (wallet === Wallet.WALLET_CONNECT) {
			if (!session) {
				setFetchAccountsLoading?.(true);
				const walletConnectAccounts = await connect();
				setAccounts(
					walletConnectAccounts.map((item: any) => ({
						address: getSubstrateAddress(item) || item,
						name: DEFAULT_ADDRESS_NAME
					})) || []
				);
				setFetchAccountsLoading?.(false);
			} else {
				const walletConnectAccounts = session.namespaces.polkadot.accounts.map((item: any) => ({
					address: item.split(':')[2],
					name: DEFAULT_ADDRESS_NAME
				}));
				setAccounts(walletConnectAccounts);
			}
		} else {
			await getAccounts(wallet);
		}
	};

	return (
		<div className={`mb-2 flex items-center justify-center gap-x-5 ${className}`}>
			<WalletButton
				className={twMerge(
					// eslint-disable-next-line sonarjs/no-duplicate-string
					selectedWallet === Wallet.POLKADOT ? 'border-primary bg-highlight border border-solid' : 'border-none'
				)}
				onClick={(event: any) => handleWalletClick(event as any, Wallet.POLKADOT)}
				icon={<PolkadotWalletIcon />}
			/>
			<WalletButton
				className={twMerge(
					selectedWallet === Wallet.SUBWALLET ? 'border-primary bg-highlight border border-solid' : 'border-none'
				)}
				onClick={(event: any) => handleWalletClick(event as any, Wallet.SUBWALLET)}
				icon={<SubWalletIcon />}
			/>
			<WalletButton
				className={twMerge(
					selectedWallet === Wallet.TALISMAN ? 'border-primary bg-highlight border border-solid' : 'border-none'
				)}
				onClick={(event: any) => handleWalletClick(event as any, Wallet.TALISMAN)}
				icon={<TalismanIcon />}
			/>
			<WalletButton
				className={twMerge(
					selectedWallet === Wallet.WALLET_CONNECT ? 'border-primary bg-highlight border border-solid' : 'border-none'
				)}
				// disabled={!apiReady}
				onClick={(event) => handleWalletClick(event as any, Wallet.WALLET_CONNECT)}
				icon={<WalletConnectLogo />}
				tooltip='Wallet Connect'
			/>
		</div>
	);
};

export default WalletButtons;
