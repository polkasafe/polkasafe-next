import {
	IConnectAddressTokenProps,
	IConnectProps,
	IGetMultisigAssets,
	IGetMultisigDataProps,
	IGetMultisigTransactionProps,
	IGetOrganisationProps,
	IGetOrganisationTransactionProps
} from '@common/types/sdk';
import { ETransactionType } from '@common/enum/sdk';
import CURRENCY_API_KEY from './constants/currencyApiKey';
import { currencySymbols } from './constants/currencyConstants';
import { connectAddress } from './connect-address';
import { getAssetsForAddress } from './get-assets-for-address';
import { getAddressToken } from './get-connect-address-token';
import { getMultisigDataByMultisigAddress } from './get-multisig-data-by-address';
import { getMultisigQueue } from './get-multisig-queue';
import { getTransactionsForMultisig } from './get-transactions-for-multisig';
import { getOrganisationAsset } from './get-organisation-assets';
import { getTransactionsForMultisigs } from './get-transactions-for-multisigs';
import { handleHeaders } from './utils/handleHeaders';
import { request } from './utils/request';

export const getConnectAddressToken = ({ address }: IConnectAddressTokenProps) => getAddressToken(address);

export const connect = async ({ address }: IConnectProps) => connectAddress(address);

export const getMultisigData = async ({ address, network }: IGetMultisigDataProps) =>
	getMultisigDataByMultisigAddress({ address, network });

export const getTransactions = async ({ address, network, page, limit }: IGetMultisigTransactionProps) =>
	getTransactionsForMultisig({ address, network, page, limit });

export const getQueueTransactions = async ({ multisigs, page, limit }: IGetOrganisationTransactionProps) =>
	getTransactionsForMultisigs({ multisigs, page, limit, type: ETransactionType.QUEUE_TRANSACTION });

export const getHistoryTransactions = async ({ multisigs, page, limit }: IGetOrganisationTransactionProps) =>
	getTransactionsForMultisigs({ multisigs, page, limit, type: ETransactionType.HISTORY_TRANSACTION });

export const getOrganisationQueueTransactions = async ({
	address,
	network,
	page,
	limit
}: IGetMultisigTransactionProps) => getMultisigQueue({ address, network, page, limit });

export const getAssets = async ({ multisigIds }: IGetMultisigAssets) => getAssetsForAddress({ multisigIds });

export const getMultisigsByOrganisation = async ({ address, signature, organisationId }: IGetOrganisationProps) => {
	if (!address || !signature || !organisationId) {
		throw new Error('Invalid Params');
	}

	const body = JSON.stringify({
		organisationId
	});

	const headers = handleHeaders({ address, signature });

	return request('/getMultisigsByOrg', headers, { method: 'POST', body });
};

export const getMultisigByOrganisation = async ({ organisations }: { organisations: Array<string> }) => {
	const body = JSON.stringify({
		organisations
	});

	return request('/getMultisigByOrganisation', {}, { method: 'POST', body });
};

export const getOrganisationAssets = async ({ organisationId, address, signature }: IGetOrganisationProps) =>
	getOrganisationAsset({ organisationId, address, signature });

export const getCurrencyPrices = async () => {
	const response = await fetch(
		`https://api.currencyapi.com/v3/latest?apikey=${CURRENCY_API_KEY}&currencies=${[...Object.values(currencySymbols)]}`
	);
	return response.json();
};
