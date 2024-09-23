import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { ETxType } from '@common/enum/substrate';
import {
	IApproveTransaction,
	ICancelTransaction,
	ICreateProxyTransaction,
	IDashboardTransaction,
	IEditMultisigTransaction,
	IGenericObject,
	ITransferTransaction
} from '@common/types/substrate';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress, encodeMultiAddress, sortAddresses } from '@polkadot/util-crypto';
import { ERROR_MESSAGES } from '@substrate/app/global/genericErrors';
import { calcWeight } from '@substrate/app/global/utils/calculateWeight';
import getMultisigInfo from '@substrate/app/global/utils/getMultisigInfo';

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
}: ITransferTransaction) => {
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
		console.log(tx, 'transaction hash');
		console.log(newTransaction, 'Transaction');
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

const createProxy = async ({
	api,
	multisig,
	sender: substrateSender,
	onSuccess,
	onFailed
}: ICreateProxyTransaction) => {
	// Multisig info
	const { address, network, threshold, signatories: allSignatories } = multisig;
	const sender = getEncodedAddress(substrateSender, network) || substrateSender;
	// Zero weight
	const ZERO_WEIGHT = new Uint8Array(0);

	// Sort signatories
	const signatories = sortAddresses(
		allSignatories.filter((s) => getSubstrateAddress(s) !== getSubstrateAddress(sender)),
		networkConstants[network].ss58Format
	);

	if (!api || !api.isReady) {
		throw new Error(ERROR_MESSAGES.API_NOT_CONNECTED);
	}
	const proxyTx = api.tx.proxy.createPure('Any', 0, new Date().getMilliseconds());
	const mainTx = api.tx.multisig.asMulti(threshold, signatories, null, proxyTx, ZERO_WEIGHT);

	const afterSuccess = (tx: IGenericObject) => {
		const newTransaction = {
			callData: proxyTx.method.toHex(),
			callHash: proxyTx.method.hash.toString(),
			network,
			amountToken: '0',
			createdAt: new Date(),
			multisigAddress: address,
			from: address,
			approvals: [sender]
		} as IDashboardTransaction;
		console.log(newTransaction, 'Transaction');
		onSuccess && onSuccess({ newTransaction });
	};

	return {
		api,
		apiReady: true,
		tx: mainTx as SubmittableExtrinsic<'promise'>,
		address: sender,
		onSuccess: afterSuccess,
		onFailed: onFailed,
		network,
		errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
	};
};

const cancelTransaction = async ({
	api,
	multisig,
	sender: substrateSender,
	callHash,
	onSuccess,
	onFailed
}: ICancelTransaction) => {
	const { network, signatories: allSignatories } = multisig;
	const sender = getEncodedAddress(substrateSender, network) || substrateSender;
	const signatories = sortAddresses(
		allSignatories.filter((s) => getSubstrateAddress(s) !== getSubstrateAddress(sender)),
		networkConstants[network].ss58Format
	);

	if (!callHash) {
		console.log('invalid callHash');
		return;
	}
	const info: any = await api.query.multisig.multisigs(multisig.address, callHash);
	const TIME_POINT = info.unwrap().when;

	const tx = api.tx.multisig.cancelAsMulti(multisig.threshold, signatories, TIME_POINT, callHash);

	const afterSuccess = () => {
		onSuccess && onSuccess({ callHash });
	};

	return {
		api,
		apiReady: true,
		tx: tx as SubmittableExtrinsic<'promise'>,
		address: sender,
		onSuccess: afterSuccess,
		onFailed: onFailed,
		network,
		errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
	};
};

const approveTransaction = async ({
	api,
	multisig,
	sender: substrateSender,
	calldata,
	callHash,
	onSuccess,
	onFailed
}: IApproveTransaction) => {
	const { network, signatories: allSignatories, threshold, address } = multisig;
	const sender = getEncodedAddress(substrateSender, network) || substrateSender;
	const signatories = sortAddresses(
		allSignatories.filter((s) => getSubstrateAddress(s) !== getSubstrateAddress(sender)),
		networkConstants[network].ss58Format
	);

	if (!calldata) {
		console.log('invalid calldata');
		return;
	}
	const callDataHex = api.createType('Call', calldata);
	const { weight } = await calcWeight(callDataHex, api);

	const multisigInfos = await getMultisigInfo(address, api);
	const [, multisigInfo] = multisigInfos?.find(([h]) => h.eq(callHash)) || [null, null];

	if (!multisigInfo) {
		console.log('No multisig info found');
		return;
	}

	const approveTx = api.tx.multisig.asMulti(threshold, signatories, multisigInfo.when, callDataHex, weight);

	const afterSuccess = () => {
		onSuccess && onSuccess({ callHash });
	};

	return {
		api,
		apiReady: true,
		tx: approveTx as SubmittableExtrinsic<'promise'>,
		address: sender,
		onSuccess: afterSuccess,
		onFailed: onFailed,
		network,
		errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
	};
};

const editProxy = async ({
	api,
	newSignatories,
	newThreshold,
	multisig,
	proxyAddress,
	sender: substrateSender,
	onSuccess,
	onFailed
}: IEditMultisigTransaction) => {
	// Multisig info
	const { address, network, threshold, signatories: allSignatories } = multisig;
	const sender = getEncodedAddress(substrateSender, network) || substrateSender;

	// Sort signatories
	const signatories = sortAddresses(
		allSignatories.filter((s) => getSubstrateAddress(s) !== getSubstrateAddress(sender)),
		networkConstants[network].ss58Format
	);

	if (!newThreshold || !newSignatories || newSignatories.length < 2) {
		throw new Error(ERROR_MESSAGES.INVALID_TRANSACTION);
	}
	const encodedSignatories = newSignatories.map((signatory) =>
		encodeAddress(signatory, networkConstants[network].ss58Format)
	);
	const newMultisigAddress = encodeMultiAddress(encodedSignatories, newThreshold);
	const accountId = getEncodedAddress(newMultisigAddress, network);
	const addProxyTx = api.tx.proxy.addProxy(accountId, 'Any', 0);
	const removeProxyTx = api.tx.proxy.removeProxy(address, 'Any', 0);
	const addAndRemoveProxyTx = api.tx.utility.batchAll([addProxyTx, removeProxyTx]);

	const proxyTx = api.tx.proxy.proxy(proxyAddress, null, addAndRemoveProxyTx);
	const callData = api.createType('Call', proxyTx.method.toHex());
	const { weight: MAX_WEIGHT } = await calcWeight(callData, api);
	const mainTx = api.tx.multisig.asMulti(threshold, signatories, null, proxyTx, MAX_WEIGHT as any);

	const afterSuccess = (tx: IGenericObject) => {
		const newTransaction = {
			callData: proxyTx.method.toHex(),
			callHash: proxyTx.method.hash.toString(),
			network,
			amountToken: '0',
			createdAt: new Date(),
			multisigAddress: address,
			from: address,
			approvals: [sender]
		} as IDashboardTransaction;
		console.log(newTransaction, 'Transaction');
		onSuccess && onSuccess({ newTransaction });
	};

	return {
		api,
		apiReady: true,
		tx: mainTx as SubmittableExtrinsic<'promise'>,
		address: sender,
		onSuccess: afterSuccess,
		onFailed: onFailed,
		network,
		errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
	};
};

const TRANSACTION_BUILDER = {
	[ETxType.TRANSFER]: transfer,
	[ETxType.CREATE_PROXY]: createProxy,
	[ETxType.CANCEL]: cancelTransaction,
	[ETxType.APPROVE]: approveTransaction,
	[ETxType.EDIT_PROXY]: editProxy
};

export { TRANSACTION_BUILDER };
