import { ENetwork, ETransactionState } from '@common/enum/substrate';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import { IReviewTransaction } from '@common/types/substrate';
import { PropsWithChildren, ReactNode, useState } from 'react';
import { ReviewTransaction } from '@common/global-ui-components/ReviewTransaction';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import TransactionSuccessScreen from '@common/global-ui-components/TransactionSuccessScreen';
import TransactionFailedScreen from '@common/global-ui-components/TransactionFailedScreen';
import BN from 'bn.js';

interface IReviewModal {
	buildTransaction: () => Promise<{ error: boolean }>;
	signTransaction: () => Promise<{ error: boolean }>;
	className?: string;
	size?: SizeType;
	reviewTransaction: IReviewTransaction | null;
	buttonIcon?: ReactNode;
}

export const ReviewModal = ({
	buildTransaction,
	signTransaction,
	reviewTransaction,
	className,
	children,
	buttonIcon,
	size
}: PropsWithChildren<IReviewModal>) => {
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [transactionState, setTransactionState] = useState(ETransactionState.BUILD);

	const actionClicked = async () => {
		setLoading(true);
		const { error } = await buildTransaction();
		if (error) {
			setTransactionState(ETransactionState.FAILED);
			setOpenModal(true);
			setLoading(false);
			return;
		}
		setTransactionState(ETransactionState.REVIEW);

		setOpenModal(true);
		setLoading(false);
	};

	const modalClicked = async () => {
		const { error } = await signTransaction();
		if (error) {
			setTransactionState(ETransactionState.FAILED);
		} else {
			setTransactionState(ETransactionState.CONFIRM);
		}
	};

	return (
		<div className='w-full'>
			<Button
				onClick={actionClicked}
				variant={EButtonVariant.SECONDARY}
				fullWidth
				loading={loading}
				className={className}
				size={size || 'large'}
				icon={buttonIcon}
			>
				{children}
			</Button>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='Review Transaction'
			>
				{transactionState === ETransactionState.REVIEW && (
					<ReviewTransaction
						onSubmit={modalClicked}
						onClose={() => {
							setTransactionState(ETransactionState.BUILD);
							setOpenModal(false);
						}}
						reviewTransaction={reviewTransaction as IReviewTransaction}
					/>
				)}
				{transactionState === ETransactionState.CONFIRM && (
					<TransactionSuccessScreen
						network={reviewTransaction?.network || ENetwork.POLKADOT}
						successMessage='Transaction in Progress!'
						waitMessage='All Threshold Signatories need to Approve the Transaction.'
						txnHash=''
						amount={new BN(0)}
						created_at={new Date()}
						sender={reviewTransaction?.from || ''}
						recipients={[reviewTransaction?.to || '']}
						onDone={() => {
							setTransactionState(ETransactionState.BUILD);
							setOpenModal(false);
						}}
					/>
				)}
				{transactionState === ETransactionState.FAILED && (
					<TransactionFailedScreen
						onDone={() => {
							setTransactionState(ETransactionState.BUILD);
							setOpenModal(false);
						}}
						txnHash=''
						sender={reviewTransaction?.from || ''}
						failedMessage='Oh no! Something went wrong.'
						waitMessage='Your transaction has failed due to some technical error. Please try again...Details of the transaction are included below'
						created_at={new Date()}
					/>
				)}
			</Modal>
		</div>
	);
};
