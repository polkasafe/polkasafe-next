// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ECHANNEL, ENetwork, EUserType } from '@common/enum/substrate';
import { ApiPromise } from '@polkadot/api';
import { ApiPromise as AvailApiPromise } from 'avail-js-sdk';
import { SignerOptions, SubmittableExtrinsic, SignerResult } from '@polkadot/api/types';
import { BN } from '@polkadot/util';
import Client from '@walletconnect/sign-client';
import { PairingTypes, SessionTypes } from '@walletconnect/types';

// RULES: Interface should be in PascalCase
// RULES: Interface should have I prefix

export interface ISearchParams {
	[key: string]: string;
}

export interface IProxy {
	name: string;
	address: string;
	createdAt?: Date;
	updatedAt?: Date;
}

export interface IMultisig {
	name: string;
	address: string;
	threshold: number;
	signatories: Array<string>;
	balance: string;
	disabled: boolean;
	network: ENetwork;
	createdAt: Date;
	updatedAt: Date;
	proxy: Array<IProxy>;
	linked?: boolean;
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
	to?: string;
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
	approvals: Array<string>;
}

export interface IChannelPreferences {
	name: ECHANNEL;
	enabled: boolean;
	handle: string;
	verified: boolean;
	verification_token?: string;
}

export interface IAddressBook {
	address: string;
	name: string;
	roles?: Array<string>;
	email?: string;
	discord?: string;
	telegram?: string;
	nickName?: string;
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

export interface ICookieUser {
	address: string;
	signature: string;
	currentOrganisation: string;
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
	multisigId?: string;
}

export interface IMultisigAssets {
	free: string;
	reserved: string;
	frozen: string;
	flags: string;
	usd: number;
	address: string;
	symbol: string;
	network: ENetwork;
	allCurrency: { [network: string]: any };
}

export interface I2FASettings {
	base32_secret: string;
	enabled: boolean;
	url: string;
	verified: boolean;
}

export interface IGenerate2FAResponse {
	base32_secret: string;
	url: string;
}

export interface I2FAToken {
	token: string;
	created_at: Date;
}

export interface IWatchList {
	name: string;
	address: string;
	network: string;
}

export interface IUser {
	userId: string;
	address: any;
	email: string | null;
	created_at: Date;
	notification_preferences?: INotificationPreferences;
	two_factor_auth?: I2FASettings;
	tfa_token?: I2FAToken;
	multisigAddresses: Array<string>;
	type: EUserType;
	watchLists?: Array<IWatchList>;
	linkedAddresses?: string[];
}

export interface IUserResponse {
	address: string;
	type: EUserType;
	signature?: string;
	currentOrganisation?: string;
}
export interface IResponse<T> {
	error?: string | null;
	data: T;
}

export interface IDBMultisig {
	address: string;
	created_at: Date;
	updated_at: Date;
	name: string;
	signatories: Array<string>;
	network: ENetwork;
	threshold: number;
	type: EUserType;
	proxy?: Array<IProxy>;
}

export interface IDBTransaction {
	id: string;
	multisigAddress: string;
	amount_token: string;
	amount_usd: string;
	approvals: string;
	block_number: string;
	callHash: string;
	created_at: string;
	updated_at: string;
	from: string;
	network: string;
	to: string;
	token: string;
	transactionFields: string;
	callData: string;
	note: string;
	status: string;
	initiator: string;
}

export interface IWalletConnect {
	client: Client | undefined;
	session: SessionTypes.Struct | undefined;
	connect: (pairing?: { topic: string }) => Promise<string[]>;
	disconnect?: () => Promise<void>;
	pairings: PairingTypes.Struct[];
}
export interface IDBAssets {
	address: string;
	balance_token: string;
	balance_usd: string;
	logoURI: string;
	name: string;
	symbol: string;
}

export interface IUpdateDBAssetProps extends IDBAssets {
	multisigId: string;
}

export interface ISubstrateExecuteProps {
	api: ApiPromise | AvailApiPromise;
	apiReady: boolean;
	network: string;
	tx: SubmittableExtrinsic<'promise'>;
	address: string;
	params?: Partial<SignerOptions>;
	errorMessageFallback: string;
	onSuccess: (txHash?: string, txIndex?: number) => Promise<void> | void;
	onFailed: (errorMessageFallback?: string) => Promise<void> | void;
	setStatus?: (pre: string) => void;
}

export interface IRecipient {
	address: string;
	amount: BN;
}

export interface ISendTransactionForm {
	recipient: string;
	amount: BN;
	note: string;
	selectedMultisigAddress: string;
	selectedProxy?: string;
}

export interface ISendTransaction {
	recipients: Array<IRecipient>;
	note: string;
	sender: IMultisig;
}

export interface IGenericObject {
	[key: string]: any;
}

export interface IFundMultisig {
	multisigAddress: IMultisig;
	amount: string;
}

export interface IMultisigCreate {
	name: string;
	signatories: Array<string>;
	network: ENetwork;
	threshold: number;
}

export interface IDBOrganisation {
	id?: string;
	members: Array<string>;
	multisigs: Array<string>;
	created_at: Date;
	updated_at: Date;
	organisation_address: string;
	city: string;
	country: string;
	name: string;
	postal_code: string;
	state: string;
	tax_number: string;
	imageURI: string;
	addressBook: Array<IAddressBook>;
}

export interface QrState {
	isQrHashed: boolean;
	qrAddress: string;
	qrPayload: Uint8Array;
	qrResolve?: (result: SignerResult) => void;
	qrReject?: (error: Error) => void;
}

export enum NotificationStatus {
	SUCCESS = 'success',
	ERROR = 'error',
	WARNING = 'warning',
	INFO = 'info'
}

export interface ICreateMultisig {
	networks: Array<ENetwork>;
	availableSignatories: Array<IAddressBook>;
	onSubmit: (values: IMultisigCreate) => Promise<void>;
}

export interface ILinkMultisig {
	networks: Array<ENetwork>;
	linkedMultisig: Array<IMultisig>;
	availableMultisig: Array<IMultisig>;
	onSubmit: (multisigs: IMultisig) => Promise<void>;
	onRemoveSubmit: (multisigs: IMultisig) => Promise<void>;
	fetchMultisig: (network: ENetwork) => Promise<void>;
}

export interface ICreateOrganisationDetails {
	name: string;
	description: string;
	image?: string;
}
