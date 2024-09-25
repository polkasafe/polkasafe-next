'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import React, { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NewTransactionForm } from '@common/modals/NewTransaction/components/NewTransactionForm';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { ENetwork, ETransactionState } from '@common/enum/substrate';
import { ReviewTransaction } from '@common/global-ui-components/ReviewTransaction';
import { Form } from 'antd';
import { IReviewTransaction } from '@common/types/substrate';
import { SizeType } from 'antd/es/config-provider/SizeContext';
import TransactionSuccessScreen from '@common/global-ui-components/TransactionSuccessScreen';
import BN from 'bn.js';
import TransactionFailedScreen from '@common/global-ui-components/TransactionFailedScreen';

function NewTransaction({
	label,
	className,
	icon = true,
	size = 'large'
}: {
	label?: string;
	className?: string;
	icon?: React.ReactNode;
	size?: SizeType;
}) {
	const [openModal, setOpenModal] = useState(false);
	const { transactionState, setTransactionState, signTransaction, reviewTransaction } = useDashboardContext();
	const [form] = Form.useForm();

	return (
		<div className='w-full'>
			<Button
				variant={EButtonVariant.PRIMARY}
				fullWidth
				className={className}
				icon={icon && <PlusCircleOutlined />}
				onClick={() => setOpenModal(true)}
				size={size}
			>
				{label || 'New Transaction'}
			</Button>
			<Modal
				open={openModal}
				onCancel={() => {
					setTransactionState(ETransactionState.BUILD);
					setOpenModal(false);
					form.resetFields();
				}}
				title='Send Transaction'
			>
				{transactionState === ETransactionState.BUILD && (
					<div className='flex flex-col gap-5'>
						<NewTransactionForm
							onClose={() => setOpenModal(false)}
							form={form}
						/>
					</div>
				)}
				{transactionState === ETransactionState.REVIEW && (
					<ReviewTransaction
						onSubmit={signTransaction}
						onClose={() => setTransactionState(ETransactionState.BUILD)}
						reviewTransaction={reviewTransaction as IReviewTransaction}
					/>
				)}
				{transactionState === ETransactionState.CONFIRM && (
					<TransactionSuccessScreen
						network={reviewTransaction?.network || ENetwork.POLKADOT}
						successMessage='Transaction in Progress!'
						waitMessage='All Threshold Signatories need to Approve the Transaction.'
						amount={new BN(0)}
						txnHash=''
						created_at={new Date()}
						sender={reviewTransaction?.from || ''}
						recipients={[reviewTransaction?.to || '']}
						onDone={() => {
							setOpenModal(false);
						}}
					/>
				)}
				{transactionState === ETransactionState.FAILED && (
					<TransactionFailedScreen
						onDone={() => {
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
}

export default NewTransaction;
