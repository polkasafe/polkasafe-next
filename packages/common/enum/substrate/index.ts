// RULES: Enum with values should be in uppercase
// RULES: Enum should have E prefix

// ASTAR
// AVAIL
// KHALA
// KUSAMA
// PHALA
// POLKADOT
// ROCOCO
// ROCOCO_ASSETHUB
// STATEMINE
// STATEMINT
// WESTEND

export enum ENetwork {
	ALEPHZERO = 'alephzero',
	ASTAR = 'astar',
	AVAIL = 'avail',
	KHALA = 'khala',
	KUSAMA = 'kusama',
	PHALA = 'phala',
	POLKADOT = 'polkadot',
	ROCOCO = 'rococo',
	ROCOCO_ASSETHUB = 'rococo-asset-hub',
	KUSAMA_ASSETHUB = 'kusama-asset-hub',
	POLKADOT_ASSETHUB = 'polkadot-asset-hub',
	WESTEND = 'westend'
}

export enum ETransactionOptions {
	SENT = 'sent',
	RECEIVED = 'received',
	CREATE_PROXY = 'create_proxy',
	REMOVE_SIGNATORY = 'remove_signatory',
	ADD_SIGNATORY = 'add_signatory',
	CUSTOM = 'custom'
}

export enum Wallet {
	POLKADOT = 'polkadot-js',
	SUBWALLET = 'subwallet-js',
	TALISMAN = 'talisman',
	METAMASK = 'metamask',
	WALLET_CONNECT = 'wallet-connect',
	POLKADOT_VAULT = 'polkadot-vault'
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

export enum ECHANNEL {
	EMAIL = 'email',
	TELEGRAM = 'telegram',
	DISCORD = 'discord',
	ELEMENT = 'element',
	SLACK = 'slack',
	IN_APP = 'in_app'
}

export enum EUserType {
	SUBSTRATE = 'SUBSTRATE',
	EVM = 'EVM'
}

export enum ETransactionType {
	HISTORY_TRANSACTION = 'history',
	QUEUE_TRANSACTION = 'queue'
}

export enum ECurrency {
	USD = 'USD',
	EUR = 'EUR',
	GBP = 'GBP',
	JPY = 'JPY',
	CNY = 'CNY',
	AUD = 'AUD',
	CAD = 'CAD',
	CHF = 'CHF',
	HKD = 'HKD',
	ZAR = 'ZAR',
	SEK = 'SEK',
	NZD = 'NZD',
	KRW = 'KRW',
	SGD = 'SGD',
	NOK = 'NOK',
	MXN = 'MXN',
	INR = 'INR',
	BRL = 'BRL',
	RUB = 'RUB',
	TRY = 'TRY',
	PLN = 'PLN',
	THB = 'THB',
	IDR = 'IDR',
	HUF = 'HUF',
	CZK = 'CZK',
	ILS = 'ILS',
	DKK = 'DKK',
	CLP = 'CLP',
	PHP = 'PHP',
	COP = 'COP',
	PEN = 'PEN',
	SAR = 'SAR',
	AED = 'AED',
	MYR = 'MYR',
	RON = 'RON',
	NGN = 'NGN',
	ARS = 'ARS',
	VND = 'VND',
	ZMW = 'ZMW',
	UGX = 'UGX',
	KES = 'KES',
	EGP = 'EGP',
	BDT = 'BDT',
	MMK = 'MMK',
	IRR = 'IRR',
	ISK = 'ISK',
	LKR = 'LKR',
	GHS = 'GHS',
	AOA = 'AOA'
}

export enum ETxType {
	TRANSFER = 'Transfer',
	APPROVE = 'Approve',
	FUND = 'Fund',
	CANCEL = 'Cancel'
}

export enum ETransactionTab {
	HISTORY = 'history',
	QUEUE = 'queue',
	MEMBERS = 'members',
	ASSETS = 'assets',
	MULTISIGS = 'multisigs'
}

export enum WcPolkadotMethods {
	POLKADOT_SIGN_TRANSACTION = 'polkadot_signTransaction',
	POLKADOT_SIGN_MESSAGE = 'polkadot_signMessage'
}

export enum ECreateOrganisationSteps {
	ORGANISATION_DETAILS = 'organisation_details',
	ADD_MULTISIG = 'add_multisig',
	REVIEW = 'review'
}
