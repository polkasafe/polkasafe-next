// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ETxType, Wallet } from '@common/enum/substrate';
import { ApiPromise } from '@polkadot/api';
import { BN, u8aToHex } from '@polkadot/util';
import { decodeAddress, encodeAddress, encodeMultiAddress, sortAddresses } from '@polkadot/util-crypto';
import { IDashboardTransaction, IMultisig } from '@common/types/substrate';
import { executeTx } from '@substrate/app/global/utils/executeTransaction';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ERROR_MESSAGES } from '@substrate/app/global/genericErrors';
import { setSigner } from '@substrate/app/global/utils/setSigner';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { calcWeight } from '@substrate/app/global/utils/calculateWeight';
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { IGenericObject } from '@common/types/substrate';

interface IGetTransaction {
	wallet: Wallet;
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
	newThreshold?: number;
	onSuccess?: (data: IGenericObject) => void;
	onFailed?: () => void;
}

export const initiateTransaction = async ({
	wallet,
	type,
	api,
	data,
	multisig,
	proxyAddress,
	isProxy,
	sender: substrateSender,
	calldata,
	callHash,
	newSignatories,
	newThreshold,
	onSuccess,
	onFailed
}: IGetTransaction) => {
	// Multisig info
	const { address, network, threshold, signatories: allSignatories } = multisig;
	const sender = getEncodedAddress(substrateSender, network) || substrateSender;

	// Sort signatories
	const signatories = sortAddresses(
		allSignatories.filter((s) => getSubstrateAddress(s) !== getSubstrateAddress(sender)),
		networkConstants[network].ss58Format
	);

	// Zero weight
	const ZERO_WEIGHT = new Uint8Array(0);

	switch (type) {
		case ETxType.TRANSFER: {
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

			await setSigner(api, wallet);
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
				console.log(tx);
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

			return executeTx({
				api,
				apiReady: true,
				tx: signableTransaction as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: afterSuccess,
				onFailed,
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		case ETxType.APPROVE: {
			if (!calldata) {
				console.log('invalid calldata');
				return;
			}
			const callDataHex = api.createType('Call', calldata);
			const { weight } = await calcWeight(callDataHex, api);

			const info: any = await api.query.multisig.multisigs(multisig.address, callHash);
			const TIME_POINT = info.unwrap().when;

			await setSigner(api, wallet);
			const approveTx = api.tx.multisig.asMulti(threshold, signatories, TIME_POINT, callDataHex, weight);

			const afterSuccess = () => {
				onSuccess && onSuccess({ callHash });
			};

			return executeTx({
				api,
				apiReady: true,
				tx: approveTx as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: afterSuccess,
				onFailed: onFailed,
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		case ETxType.CANCEL: {
			if (!callHash) {
				console.log('invalid callHash');
				return;
			}
			const info: any = await api.query.multisig.multisigs(multisig.address, callHash);
			const TIME_POINT = info.unwrap().when;

			const tx = api.tx.multisig.cancelAsMulti(multisig.threshold, signatories, TIME_POINT, callHash);
			await setSigner(api, wallet);

			const afterSuccess = () => {
				onSuccess && onSuccess({ callHash });
			};

			return executeTx({
				api,
				apiReady: true,
				tx,
				address: sender,
				onSuccess: afterSuccess,
				onFailed: onFailed,
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		case ETxType.FUND: {
			if (!api || !api.isReady) {
				throw new Error(ERROR_MESSAGES.API_NOT_CONNECTED);
			}
			if (isProxy && !proxyAddress) {
				throw new Error(ERROR_MESSAGES.INVALID_TRANSACTION);
			}

			if (!address) {
				throw new Error(ERROR_MESSAGES.INVALID_TRANSACTION);
			}

			const tx = api.tx.balances.transferKeepAlive(isProxy ? proxyAddress : address, new BN(data?.[0]?.amount || '0'));
			await setSigner(api, wallet);
			return executeTx({
				api,
				apiReady: true,
				tx: tx as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: onSuccess,
				onFailed: onFailed,
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		case ETxType.CREATE_PROXY: {
			if (!api || !api.isReady) {
				throw new Error(ERROR_MESSAGES.API_NOT_CONNECTED);
			}
			const proxyTx = api.tx.proxy.createPure('Any', 0, new Date().getMilliseconds());
			const mainTx = api.tx.multisig.asMulti(threshold, signatories, null, proxyTx, ZERO_WEIGHT);
			await setSigner(api, wallet);

			const afterSuccess = (tx: IGenericObject) => {
				console.log(tx);
				const newTransaction = {
					callData: proxyTx.method.toHex(),
					callHash: proxyTx.method.hash.toString(),
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

			return executeTx({
				api,
				apiReady: true,
				tx: mainTx as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: afterSuccess,
				onFailed: onFailed,
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		case ETxType.EDIT_MULTISIG: {
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
				console.log(tx);
				const newTransaction = {
					callData: proxyTx.method.toHex(),
					callHash: proxyTx.method.hash.toString(),
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

			await setSigner(api, wallet);
			return executeTx({
				api,
				apiReady: true,
				tx: mainTx as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: afterSuccess,
				onFailed: onFailed,
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		case ETxType.ADD_PROXY: {
			if (!newThreshold || !newSignatories || newSignatories.length < 2) {
				throw new Error(ERROR_MESSAGES.INVALID_TRANSACTION);
			}
			const encodedSignatories = newSignatories.map((signatory) =>
				encodeAddress(signatory, networkConstants[network].ss58Format)
			);
			const multisigAddress = encodeMultiAddress(encodedSignatories, newThreshold);
			const accountId = getEncodedAddress(multisigAddress, network);
			const addProxyTx = api.tx.proxy.addProxy(accountId, 'Any', 0);

			const proxyTx = api.tx.proxy.proxy(proxyAddress, null, addProxyTx);
			const callData = api.createType('Call', proxyTx.method.toHex());
			const { weight: MAX_WEIGHT } = await calcWeight(callData, api);
			const mainTx = api.tx.multisig.asMulti(threshold, signatories, null, proxyTx, MAX_WEIGHT as any);
			await setSigner(api, wallet);
			return executeTx({
				api,
				apiReady: true,
				tx: mainTx as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: () => {},
				onFailed: () => {},
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		case ETxType.REMOVE_PROXY: {
			const removeProxy = api.tx.proxy.removeProxy(multisig.address, 'Any', 0);
			const proxyTx = api.tx.proxy.proxy(proxyAddress, null, removeProxy);
			const callData = api.createType('Call', proxyTx.method.toHex());
			const { weight: MAX_WEIGHT } = await calcWeight(callData, api);
			const mainTx = api.tx.multisig.asMulti(threshold, signatories, null, proxyTx, MAX_WEIGHT as any);
			await setSigner(api, wallet);
			return executeTx({
				api,
				apiReady: true,
				tx: mainTx as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: () => {},
				onFailed: () => {},
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}

		default: {
			return {};
		}
	}
};
