import { ENetwork } from '@common/enum/substrate';
import {
	IAddressBook,
	ICurrency,
	IFundMultisig,
	IMultisig,
	IMultisigAssets,
	ISendTransaction
} from '@common/types/substrate';
import { createContext, PropsWithChildren, ReactNode, useContext, useMemo } from 'react';

interface IDashboardProvider extends PropsWithChildren {
	onNewTransaction: (values: ISendTransaction) => Promise<void>;
	onFundMultisig: (value: IFundMultisig) => Promise<void>;
	assets: Array<IMultisigAssets> | null;
	currency: string;
	currencyValues: ICurrency;
	multisigs: Array<IMultisig>;
	addressBook: IAddressBook[];
	allApi: any;
	getCallData: (data: any) => string;
	ReviewTransactionComponent: (props: {
		callData: string;
		from: string;
		to: string;
		network: ENetwork;
		name: string;
		isProxy?: boolean;
	}) => ReactNode;
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
	addressBook,
	allApi,
	getCallData,
	ReviewTransactionComponent
}: IDashboardProvider) {
	const value = useMemo(
		() => ({
			onNewTransaction,
			onFundMultisig,
			assets,
			currency,
			multisigs,
			addressBook,
			currencyValues,
			allApi,
			getCallData,
			ReviewTransactionComponent
		}),
		[
			ReviewTransactionComponent,
			addressBook,
			allApi,
			assets,
			currency,
			currencyValues,
			getCallData,
			multisigs,
			onFundMultisig,
			onNewTransaction
		]
	);
	return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboardContext = () => useContext(DashboardContext);
