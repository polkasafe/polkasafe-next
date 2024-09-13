// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ETxType, Wallet } from '@common/enum/substrate';
import { ApiPromise } from '@polkadot/api';
import { BN, u8aToHex } from '@polkadot/util';
import { decodeAddress } from '@polkadot/util-crypto';
import { IMultisig } from '@common/types/substrate';
import { executeTx } from '@substrate/app/global/utils/executeTransaction';
import { SubmittableExtrinsic } from '@polkadot/api/types';
import { ERROR_MESSAGES } from '@substrate/app/global/genericErrors';
import { setSigner } from '@substrate/app/global/utils/setSigner';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { calcWeight } from '@substrate/app/global/utils/calculateWeight';
import getMultisigInfo from '@substrate/app/global/utils/getMultisigInfo';

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
}

export const initiateTransaction = async ({
	wallet,
	type,
	api,
	data,
	multisig,
	proxyAddress,
	isProxy,
	sender,
	calldata,
	callHash
}: IGetTransaction) => {
	const { address, network, threshold, signatories: allSignatories } = multisig;
	const signatories = allSignatories.filter((s) => getSubstrateAddress(s) !== getSubstrateAddress(sender));

	const getTransaction = async (tx: SubmittableExtrinsic<'promise'>) => {
		const MAX_WEIGHT = (await tx.paymentInfo(address)).weight;
		if (isProxy) {
			const proxyTx = api.tx.proxy.proxy(proxyAddress, null, tx);
			return api.tx.multisig.asMulti(threshold, signatories, null, proxyTx, MAX_WEIGHT);
		}
		return api.tx.multisig.asMulti(threshold, signatories, null, tx, MAX_WEIGHT);
	};

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

			await setSigner(api, wallet, network);

			const mainTx = await getTransaction(tx.length > 1 ? api.tx.utility.batchAll(tx) : tx[0]);
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
		case ETxType.APPROVE: {
			if (!calldata) {
				console.log('invalid calldata');
				return;
			}
			const callDataHex = api.createType('Call', calldata);
			const { weight } = await calcWeight(callDataHex, api);
			const info: any = await api.query.multisig.multisigs(multisig.address, callHash);
			const TIME_POINT = info.unwrap().when;

			await setSigner(api, wallet, network);
			const approveTx = api.tx.multisig.asMulti(threshold, signatories, TIME_POINT, callDataHex, weight);
			return executeTx({
				api,
				apiReady: true,
				tx: approveTx as SubmittableExtrinsic<'promise'>,
				address: sender,
				onSuccess: () => {},
				onFailed: () => {},
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
			console.log(`Time point is: ${TIME_POINT}`);
			const tx = api.tx.multisig.cancelAsMulti(multisig.threshold, signatories, TIME_POINT, callHash);
			await setSigner(api, wallet, network);
			return executeTx({
				api,
				apiReady: true,
				tx,
				address: sender,
				onSuccess: () => {},
				onFailed: () => {},
				network,
				errorMessageFallback: ERROR_MESSAGES.TRANSACTION_FAILED
			});
		}
		case ETxType.FUND: {
			const tx = api.tx.balances.transferKeepAlive(address, new BN(data?.[0]?.amount || '0'));
			await setSigner(api, wallet, network);
			const mainTx = await getTransaction(tx);
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
