import { EAfterExecute, ENetwork } from '@common/enum/substrate';
import { createProxy } from '@sdk/polkasafe-sdk/src/create-proxy';

const linkProxy = async ({
	multisigAddress,
	network,
	address,
	signature
}: {
	multisigAddress: string;
	network: ENetwork;
	address: string;
	signature: string;
}) => {
	createProxy({ multisigAddress, network, address, signature });
};

const editProxy = async ({
	newMultisigAddress,
	proxyAddress,
	network,
	address,
	signature
}: {
	newMultisigAddress: string;
	proxyAddress: ENetwork;
	network: ENetwork;
	address: string;
	signature: string;
}) => {
	editProxy({ newMultisigAddress, proxyAddress, network, address, signature });
};

export const AFTER_EXECUTE = {
	[EAfterExecute.LINK_PROXY]: linkProxy,
	[EAfterExecute.EDIT_PROXY]: editProxy
};
