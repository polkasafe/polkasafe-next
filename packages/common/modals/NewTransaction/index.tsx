'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import React, { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NewTransactionForm } from '@common/modals/NewTransaction/components/NewTransactionForm';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { ETransactionState } from '@common/enum/substrate';
import { ReviewTransaction } from '@common/global-ui-components/ReviewTransaction';
import { Form } from 'antd';
import { IReviewTransaction } from '@common/types/substrate';

function NewTransaction({ label, className }: { label?: string; className?: string }) {
	const [openModal, setOpenModal] = useState(false);
	const { transactionState, setTransactionState, signTransaction, reviewTransaction } = useDashboardContext();
	const [form] = Form.useForm();

	return (
		<div className='w-full'>
			<Button
				variant={EButtonVariant.PRIMARY}
				fullWidth
				className={className}
				icon={<PlusCircleOutlined />}
				onClick={() => setOpenModal(true)}
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
				{transactionState === ETransactionState.CONFIRM && <div>Success</div>}
				{transactionState === ETransactionState.FAILED && <div>Failed</div>}
			</Modal>
		</div>
	);
}

export default NewTransaction;
