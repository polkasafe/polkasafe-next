// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
export enum ETransactionOptions {
	SEND = 'send',
	RECEIVE = 'receive',
	PROXY = 'proxy',
	REMOVE_SIGNATORY = 'remove_signatory',
	ADD_SIGNATORY = 'add_signatory',
	CREATE_MULTISIG = 'create_multisig'
}

export enum Wallet {
	POLKADOT = 'polkadot-js',
	SUBWALLET = 'subwallet-js',
	TALISMAN = 'talisman',
	METAMASK = 'metamask'
}

export enum EProjectType {
	SUBSTRATE = 'SUBSTRATE',
	EVM = 'EVM'
}

export enum NotificationStatus {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
}

export enum CHANNEL {
	EMAIL = 'email',
	TELEGRAM = 'telegram',
	DISCORD = 'discord',
	ELEMENT = 'element',
	SLACK = 'slack',
	IN_APP = 'in_app'
}

export interface ISearchParams {
	[key: string]: string;
}

export interface IProxy {
	name: string;
	address: string;
	createdAt: Date;
	updatedAt: Date;
}

export interface IMultisig {
	name: string;
	address: string;
	threshold: number;
	signatories: Array<string>;
	balance: string;
	disabled: boolean;
	network: string;
	createdAt: Date;
	updatedAt: Date;
	proxy: Array<IProxy>;
}

export interface ITxnCategory {
	category: string;
	subfields: { [subfield: string]: { name: string; value: string } };
}

export interface IDashboardTransaction {
	callHash: string;
	callData: string;
	amountToken: string;
	network: string;
	createdAt: Date;
	multisigAddress: string;
	from: string;
}

export interface ITransaction {
	id: string;
	from: string;
	to: string[];
	callData: string;
	callHash: string;
	blockNumber: number;
	status: string;
	createdAt: Date;
	updatedAt: Date;
	token: string;
	amountUSD: number;
	amountToken: number;
	network: string;
	transactionFields?: ITxnCategory;
}

export enum ETransactionType {
	HISTORY_TRANSACTION = 'history',
	QUEUE_TRANSACTION = 'queue'
}

export interface IChannelPreferences {
	name: CHANNEL;
	enabled: boolean;
	handle: string;
	verified: boolean;
	verification_token?: string;
}

export interface IAddressBook {
	address: string;
	name: string;
}

export interface ITriggerPreferences {
	name: string;
	enabled: boolean;
	[index: string]: any;
}

export interface INotificationPreferences {
	channelPreferences: { [index: string]: IChannelPreferences };
	triggerPreferences: { [index: string]: ITriggerPreferences };
}

export interface IUserOrganisation {
	id: string;
}

export interface IOrganisation {
	id: string;
	members: Array<string>;
	multisigs: Array<IMultisig>;
	createdAt: Date;
	updatedAt: Date;
	addressBook: Array<IAddressBook>;
	city: string;
	country: string;
	image: string;
	name: string;
	address: string;
	postalCode: string;
	state: string;
	taxNumber: string;
}
export interface IConnectedUser {
	address: string;
	signature: string;
	organisations: Array<IOrganisation>;
}

export interface IGenericResponse<T> {
	data?: T;
	error?: string;
}

export interface ICurrency {
	[symbol: string]: { code: string; value: number };
}

export interface IAsset {
	balanceToken: string;
	balanceUSD: string;
	logoURI: string;
	name: string;
	symbol: string;
}

export interface IMultisigAssets {
	free: string;
	reserved: string;
	frozen: string;
	flags: string;
	usd: number;
	address: string;
	symbol: string;
}
