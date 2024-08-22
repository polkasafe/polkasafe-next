// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ETransactionType } from '@common/enum/substrate';

export const LOGIN_URL = '/login';
export const DASHBOARD_URL = '/dashboard';
export const ASSETS_ORGANISATION_URL = ({ id }: { id: string }) => `/assets?_organisation=${id}`;
export const EXCHANGE_URL = '/exchange';
export const WATCH_LIST_URL = '/watch-list';
export const TRANSACTIONS_URL = '/transactions';
export const SETTINGS_URL = '/settings';
export const APPS_URL = '/apps';
export const NOTIFICATIONS_URL = '/notifications';
export const INVOICES_URL = '/invoices';
export const ADDRESS_BOOK_URL = '/address-book';
export const TREASURY_ANALYTICS_URL = '/treasury-analytics';
export const MULTISIG_TRANSACTION_URL = ({
	multisig,
	page,
	limit,
	network,
	type
}: {
	multisig: string;
	page: number;
	limit: number;
	network: string;
	type: ETransactionType;
}) => `/transactions?_multisig=${multisig}&_page=${page}&_limit=${limit}&_network=${network}&_type=${type}`;
export const MULTISIG_DASHBOARD_URL = ({ multisig, network }: { multisig: string; network: string }) =>
	`/dashboard?_multisig=${multisig}&_network=${network}`;
export const ORGANISATION_DASHBOARD_URL = ({ id }: { id: string }) => `/dashboard?_organisation=${id}`;
export const CREATE_ORGANISATION_URL = ({ address }: { address: string }) => `/create-organisation?address=${address}`;
