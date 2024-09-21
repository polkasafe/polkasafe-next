import { ENetwork, ETxType, Wallet } from '@common/enum/substrate';
import { IConnectedUser, IGenericObject, ISendTransaction } from '@common/types/substrate';
import { ApiPromise } from '@polkadot/api';
import { IApiAtom } from '@substrate/app/atoms/api/apiAtom';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';

export const newTransaction = async (
	values: ISendTransaction,
	user: IConnectedUser,
	getApi: (network: ENetwork) => IApiAtom | null,
	onSuccess: (data: IGenericObject) => void
) => {
	if (!user) {
		return;
	}
	const { address } = user;
	const { recipients, sender: multisig, selectedProxy } = values;
	const wallet = (localStorage.getItem('logged_in_wallet') as Wallet) || Wallet.POLKADOT;
	const apiAtom = getApi(multisig.network);
	if (!apiAtom) {
		return;
	}
	const { api } = apiAtom as { api: ApiPromise };
	if (!api || !api.isReady) {
		return;
	}
	const data = recipients.map((recipient) => ({
		amount: recipient.amount,
		recipient: recipient.address
	}));
	await initiateTransaction({
		wallet,
		type: ETxType.TRANSFER,
		api,
		data,
		isProxy: Boolean(selectedProxy),
		proxyAddress: selectedProxy,
		multisig,
		sender: address,
		onSuccess
	});
};
