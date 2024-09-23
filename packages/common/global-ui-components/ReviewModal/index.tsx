import { ETransactionState } from '@common/enum/substrate';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import { IReviewTransaction } from '@common/types/substrate';
import { PropsWithChildren, useState } from 'react';
import { ReviewTransaction } from '@common/global-ui-components/ReviewTransaction';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

interface IReviewModal {
	buildTransaction: () => Promise<{ error: boolean }>;
	signTransaction: () => Promise<{ error: boolean }>;
	className?: string;
	size?: SizeType;
	reviewTransaction: IReviewTransaction | null;
}

export const ReviewModal = ({
	buildTransaction,
	signTransaction,
	reviewTransaction,
	className,
	children,
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
				{transactionState === ETransactionState.CONFIRM && <div>Success</div>}
				{transactionState === ETransactionState.FAILED && <div>Failed</div>}
			</Modal>
		</div>
	);
};
