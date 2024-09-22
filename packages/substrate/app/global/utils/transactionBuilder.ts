import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { ETxType, Wallet } from '@common/enum/substrate';
import { IDashboardTransaction, IGenericObject, IMultisig, ISubstrateExecuteProps } from '@common/types/substrate';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { ApiPromise } from '@polkadot/api';
import { SignerOptions, SubmittableExtrinsic } from '@polkadot/api/types';
import { BN, u8aToHex } from '@polkadot/util';
import { decodeAddress, sortAddresses } from '@polkadot/util-crypto';
import { ERROR_MESSAGES } from '@substrate/app/global/genericErrors';

interface IGetTransaction {
	type: ETxType;
	api: ApiPromise;
	data: Array<{
		amount: BN;
		recipient: string;
	}> | null;
	multisig: IMultisig;
	sender: string;
	proxyAddress?: string;
	isProxy?: boolean;
	calldata?: string;
	callHash?: string;
	newSignatories?: Array<string>;
	params?: Partial<SignerOptions>;
	newThreshold?: number;
	onSuccess?: (data: IGenericObject) => void;
	onFailed?: () => void;
}

const transfer = async ({
	api,
	data,
	multisig,
	proxyAddress,
	isProxy,
	params = {},
	sender: substrateSender,
	onSuccess,
	onFailed
}: IGetTransaction) => {
	const { address, network, threshold, signatories: allSignatories } = multisig;
	const sender = getEncodedAddress(substrateSender, network) || substrateSender;

	// Sort signatories
	const signatories = sortAddresses(
		allSignatories.filter((s) => getSubstrateAddress(s) !== getSubstrateAddress(sender)),
		networkConstants[network].ss58Format
	);
	const tx = data?.map((d) => {
		if (!d?.amount || !d?.recipient) {
			throw new Error('Amount and recipient are required');
		}
		const { amount, recipient } = d;
		const accountId = u8aToHex(decodeAddress(recipient));
		return api.tx.balances.transferKeepAlive(accountId, amount);
	});

	if (!tx || tx.length === 0) {
		throw new Error(ERROR_MESSAGES.INVALID_TRANSACTION);
	}

	const getTransaction = (tx: SubmittableExtrinsic<'promise'>) => {
		if (isProxy) {
			return api.tx.proxy.proxy(proxyAddress, null, tx);
		}
		return tx;
	};

	const batchOrSingleTx = tx.length > 1 ? api.tx.utility.batchAll(tx) : tx[0];
	const MAX_WEIGHT = (await batchOrSingleTx.paymentInfo(address)).weight;
	const transaction = getTransaction(batchOrSingleTx);
	const signableTransaction = api.tx.multisig.asMulti(threshold, signatories, null, transaction, MAX_WEIGHT);

	const afterSuccess = (tx: IGenericObject) => {
		const newTransaction = {
			callData: transaction.method.toHex(),
			callHash: transaction.method.hash.toString(),
			network,
			amountToken: data?.[0]?.amount.toString() || '0',
			to: data?.[0]?.recipient || '',
			createdAt: new Date(),
			multisigAddress: address,
			from: address,
			approvals: [sender]
		} as IDashboardTransaction;
		onSuccess && onSuccess({ newTransaction });
	};

	return {
		api,
		apiReady: true,
		tx: signableTransaction as SubmittableExtrinsic<'promise'>,
		address: sender,
		params,
		onSuccess: afterSuccess,
		onFailed,
		network,
		errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
	};
};

const TRANSACTION_BUILDER = {
	[ETxType.TRANSFER]: transfer
};

export { TRANSACTION_BUILDER };
