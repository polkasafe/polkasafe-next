// RULES: Enum with values should be in uppercase
// RULES: Enum should have E prefix

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

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum WC_POLKADOT_METHODS {
	POLKADOT_SIGN_TRANSACTION = 'polkadot_signTransaction',
	POLKADOT_SIGN_MESSAGE = 'polkadot_signMessage'
}
