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
