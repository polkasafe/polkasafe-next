import { ENetwork, ETxType } from '@common/enum/substrate';
import { IConnectedUser, IGenericObject, ISendTransaction, ISubstrateExecuteProps } from '@common/types/substrate';
import { ApiPromise } from '@polkadot/api';
import { IApiAtom } from '@substrate/app/atoms/api/apiAtom';
import { TRANSACTION_BUILDER } from '@substrate/app/global/utils/transactionBuilder';

export const newTransaction = async (
	values: ISendTransaction,
	user: IConnectedUser,
	getApi: (network: ENetwork) => IApiAtom | null,
	onSuccess: (data: IGenericObject) => void
) => {
	if (!user) {
		return null;
	}
	const { address } = user;
	const { recipients, sender: multisig, selectedProxy } = values;
	const apiAtom = getApi(multisig.network);

	if (!apiAtom) {
		return null;
	}

	const { api } = apiAtom as { api: ApiPromise };
	if (!api || !api.isReady) {
		return null;
	}

	const data = recipients.map((recipient) => ({
		amount: recipient.amount,
		recipient: recipient.address
	}));

	return TRANSACTION_BUILDER.Transfer({
		type: ETxType.TRANSFER,
		api,
		data,
		isProxy: Boolean(selectedProxy),
		proxyAddress: selectedProxy,
		multisig,
		sender: address,
		onSuccess
	}) as Promise<ISubstrateExecuteProps>;
};
