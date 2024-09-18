// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ESettingsTab, ETransactionTab, ETransactionType } from '@common/enum/substrate';

export const LOGIN_URL = '/login';
export const DASHBOARD_URL = '/dashboard';
export const ASSETS_ORGANISATION_URL = ({ id }: { id: string }) => `/assets?_organisation=${id}`;
export const EXCHANGE_URL = '/exchange';
export const WATCH_LIST_URL = '/watch-list';
export const TRANSACTIONS_URL = '/transactions';
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

export const ORGANISATION_TRANSACTION_URL = ({
	organisationId,
	page,
	limit,
	type
}: {
	organisationId: string;
	page: number;
	limit: number;
	type: ETransactionType;
}) => `/transactions?_organisation=${organisationId}&_page=${page}&_limit=${limit}&_type=${type}`;

export const MULTISIG_DASHBOARD_URL = ({
	multisig,
	network,
	organisationId,
	tab
}: {
	multisig: string;
	network: string;
	organisationId: string;
	tab?: ETransactionTab;
}) =>
	`/dashboard?_organisation=${organisationId}&_multisig=${multisig}&_network=${network}&_tab=${tab || ETransactionTab.QUEUE}`;
export const ORGANISATION_DASHBOARD_URL = ({ id, tab }: { id: string; tab?: ETransactionTab }) =>
	`/dashboard?_organisation=${id}&_tab=${tab || ETransactionTab.QUEUE}`;
export const CREATE_ORGANISATION_URL = `/create-organisation`;
export const SETTINGS_URL = ({ organisationId, tab }: { organisationId: string; tab: ESettingsTab }) =>
	`/settings?_organisation=${organisationId}&_tab=${tab}`;
