import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import Modal from '@common/global-ui-components/Modal';
import {
	IAddressBook,
	IGenericObject,
	IMultisig,
	IReviewTransaction,
	ISubstrateExecuteProps
} from '@common/types/substrate';
import { UpdateMultisigForm } from '@common/global-ui-components/UpdateMultisigForm';
import { twMerge } from 'tailwind-merge';
import { ETransactionState, ETxType, Wallet } from '@common/enum/substrate';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useQueueAtom } from '@substrate/app/atoms/transaction/transactionAtom';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { ERROR_MESSAGES, INFO_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { useNotification } from '@common/utils/notification';
import { TRANSACTION_BUILDER } from '@substrate/app/global/utils/transactionBuilder';
import { formatBalance } from '@substrate/app/global/utils/formatBalance';
import { setSigner } from '@substrate/app/global/utils/setSigner';
import { executeTx } from '@substrate/app/global/utils/executeTransaction';
import { ReviewTransaction } from '@common/global-ui-components/ReviewTransaction';
import { ApiPromise } from '@polkadot/api';

interface IUpdateMultisig {
	multisig: IMultisig;
	proxyAddress: string;
	addresses: Array<IAddressBook>;
	className?: string;
}

export const UpdateMultisig = ({ multisig, proxyAddress, addresses, className }: IUpdateMultisig) => {
	const [user] = useUser();
	const notification = useNotification();
	const [queueTransaction, setQueueTransactions] = useQueueAtom();
	const [executableTransaction, setExecutableTransaction] = useState<ISubstrateExecuteProps | null>(null);
	const [reviewTransaction, setReviewTransaction] = useState<IReviewTransaction | null>(null);

	const { getApi } = useAllAPI();
	const api = getApi(multisig.network)?.api;

	const [transactionState, setTransactionState] = useState(ETransactionState.BUILD);
	const [openModal, setOpenModal] = useState(false);

	const buildTransaction = async ({
		signatories,
		threshold,
		proxyAddress
	}: {
		signatories: Array<string>;
		threshold: number;
		proxyAddress: string;
	}) => {
		// After successful transaction add the transaction to the queue with the latest transaction on top
		const onSuccess = ({ newTransaction }: IGenericObject) => {
			try {
				if (!queueTransaction) {
					return;
				}
				const payload = [newTransaction, ...(queueTransaction?.transactions || [])];
				setQueueTransactions({ ...queueTransaction, transactions: payload });
				notification(SUCCESS_MESSAGES.TRANSACTION_SUCCESS);
			} catch (error) {
				notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: error || error.message });
			}
		};
		try {
			if (!user) {
				notification({ ...ERROR_MESSAGES.AUTHENTICATION_FAILED });
				return;
			}
			const { address } = user;

			if (!api || !api.isReady) {
				notification({ ...ERROR_MESSAGES.API_NOT_CONNECTED });
				return;
			}
			const payload = {
				api: api as ApiPromise,
				newSignatories: signatories,
				newThreshold: threshold,
				multisig: multisig,
				proxyAddress: proxyAddress,
				sender: user.address,
				onSuccess: onSuccess,
				onFailed: () => {}
			};

			const transaction = (await TRANSACTION_BUILDER[ETxType.EDIT_MULTISIG](payload)) as ISubstrateExecuteProps;

			if (!transaction) {
				notification({ ...ERROR_MESSAGES.TRANSACTION_BUILD_FAILED });
				return;
			}

			const fee = (await transaction.tx.paymentInfo(address)).partialFee;
			console.log(fee.toString());
			const formattedFee = formatBalance(
				fee.toString(),
				{
					numberAfterComma: 3,
					withThousandDelimitor: false
				},
				multisig.network
			);

			const reviewData = {
				tx: transaction.tx.toHuman(),
				from: multisig.address,
				proxyAddress: proxyAddress,
				txCost: formattedFee.toString(),
				network: multisig.network
			} as IReviewTransaction;
			setExecutableTransaction(transaction);
			setReviewTransaction(reviewData);
			setTransactionState(ETransactionState.REVIEW);
		} catch (error) {
			notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: error || error.message });
			console.log(error);
			setTransactionState(ETransactionState.FAILED);
		}
	};
	const signTransaction = async () => {
		try {
			if (!executableTransaction) {
				notification({ ...ERROR_MESSAGES.TRANSACTION_BUILD_FAILED });
				throw new Error('Transaction build failed');
			}

			await setSigner(executableTransaction.api);
			await executeTx(executableTransaction);
			notification({ ...INFO_MESSAGES.TRANSACTION_IN_BLOCK });
			setTransactionState(ETransactionState.CONFIRM);
		} catch (e) {
			setTransactionState(ETransactionState.FAILED);
			notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: e || e.message });
			setTransactionState(ETransactionState.FAILED);
		}
	};

	return (
		<div className={twMerge('w-full mb-4', className)}>
			<Button
				variant={EButtonVariant.PRIMARY}
				icon={<PlusCircleOutlined />}
				onClick={() => setOpenModal(true)}
				size='middle'
			>
				Edit Multisig
			</Button>

			<Modal
				open={openModal}
				onCancel={() => {
					setOpenModal(false);
					setTransactionState(ETransactionState.BUILD);
				}}
				title='Update Multisig'
			>
				{transactionState === ETransactionState.BUILD && (
					<UpdateMultisigForm
						multisig={multisig}
						proxyAddress={proxyAddress}
						onSubmit={buildTransaction}
						addresses={addresses}
					/>
				)}
				{transactionState === ETransactionState.REVIEW && (
					<ReviewTransaction
						onSubmit={signTransaction}
						onClose={() => setTransactionState(ETransactionState.BUILD)}
						reviewTransaction={reviewTransaction as IReviewTransaction}
					/>
				)}
				{transactionState === ETransactionState.CONFIRM && <div>Success</div>}
				{transactionState === ETransactionState.FAILED && <div>Failed</div>}
			</Modal>
		</div>
	);
};
