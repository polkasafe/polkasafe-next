import {
	IConnectAddressTokenProps,
	IConnectProps,
	IGetMultisigDataProps,
	IGetMultisigTransactionProps,
	IGetOrganisationProps,
	IGetOrganisationTransactionProps,
	ILoginProps
} from '@common/types/sdk';
import CURRENCY_API_KEY from './constants/currencyApiKey';
import { currencySymbols } from './constants/currencyConstants';
import { getOrganisationById } from './get-organisation-by-id';
import { loginToPolkasafe } from './login-to-polkasafe';
import { connectAddress } from './connect-address';
import { getAssetsForAddress } from './get-assets-for-address';
import { getAddressToken } from './get-connect-address-token';
import { getMultisigDataByMultisigAddress } from './get-multisig-data-by-address';
import { getMultisigQueue } from './get-multisig-queue';
import { getTransactionsForMultisig } from './get-transactions-for-multisig';
import { getOrganisationAsset } from './get-organisation-assets';
import { getTransactionsForOrganisation } from './get-transactions-for-organisation';

export const getConnectAddressToken = ({ address }: IConnectAddressTokenProps) => getAddressToken(address);

export const connect = async ({ address }: IConnectProps) => connectAddress(address);

export const getMultisigData = async ({ address, network }: IGetMultisigDataProps) =>
	getMultisigDataByMultisigAddress({ address, network });

export const getTransactions = async ({ address, network, page, limit }: IGetMultisigTransactionProps) =>
	getTransactionsForMultisig({ address, network, page, limit });

export const getQueueTransactions = async ({ address, network, page, limit }: IGetMultisigTransactionProps) =>
	getMultisigQueue({ address, network, page, limit });

export const getOrganisationTransactions = async ({ multisigs, page, limit }: IGetOrganisationTransactionProps) =>
	getTransactionsForOrganisation({ multisigs, page, limit });

export const getOrganisationQueueTransactions = async ({
	address,
	network,
	page,
	limit
}: IGetMultisigTransactionProps) => getMultisigQueue({ address, network, page, limit });

export const getAssets = async ({ address, network }: IGetMultisigDataProps) =>
	getAssetsForAddress({ address, network });

export const login = async ({ address, signature }: ILoginProps) => loginToPolkasafe(address, signature);

export const getOrganization = async ({ organisationId, address, signature }: IGetOrganisationProps) =>
	getOrganisationById({ organisationId, address, signature });

export const getOrganisationAssets = async ({ organisationId, address, signature }: IGetOrganisationProps) =>
	getOrganisationAsset({ organisationId, address, signature });

export const getCurrencyPrices = async () => {
	const response = await fetch(
		`https://api.currencyapi.com/v3/latest?apikey=${CURRENCY_API_KEY}&currencies=${[...Object.values(currencySymbols)]}`
	);
	return response.json();
};
