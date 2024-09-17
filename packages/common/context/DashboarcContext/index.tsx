import { IAddressBook, ICurrency, IFundMultisig, IMultisig, IMultisigAssets, ISendTransaction } from '@common/types/substrate';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface IDashboardProvider extends PropsWithChildren {
	onNewTransaction: (values: ISendTransaction) => Promise<void>;
	onFundMultisig: (value: IFundMultisig) => Promise<void>;
	assets: Array<IMultisigAssets> | null;
	currency: string;
	currencyValues: ICurrency;
	multisigs: Array<IMultisig>;
	addressBook: IAddressBook[];
}

export const DashboardContext = createContext({} as IDashboardProvider);

export function DashboardProvider({
	onNewTransaction,
	onFundMultisig,
	assets,
	currency,
	currencyValues,
	multisigs,
	children,
	addressBook
}: IDashboardProvider) {
	const value = useMemo(
		() => ({
			onNewTransaction,
			onFundMultisig,
			assets,
			currency,
			multisigs,
			addressBook,
			currencyValues
		}),
		[assets, currency, multisigs, onFundMultisig, onNewTransaction]
	);
	return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboardContext = () => useContext(DashboardContext);
