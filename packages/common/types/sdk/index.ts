export interface IConnectProps {
	address: string;
}

export interface IConnectAddressTokenProps {
	address: string;
}

export interface IGetMultisigDataProps {
	address: string;
	network: string;
}

export interface IGetMultisigTransactionProps {
	address: string;
	network: string;
	page?: number;
	limit?: number;
}

export interface ILoginProps extends IConnectProps {
	signature: string;
}

export interface IGetOrganisationProps {
	organisationId: string;
	address: string;
	signature: string;
}

export interface IGetOrganisationTransactionProps {
	multisigs: Array<string>;
	page?: number;
	limit?: number;
}

export interface IGetMultisigAssets {
	multisigIds: Array<string>;
}
