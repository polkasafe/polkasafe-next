import React, { useState } from 'react';
import { Form, Spin } from 'antd';
import { newTransactionFormFields } from '@common/modals/NewTransaction/utils/form';
import ActionButton from '@common/modals/NewTransaction/components/ActionButton';
import { IMultisig, ISendTransactionForm } from '@common/types/substrate';
import SelectAddress from '@common/global-ui-components/SelectAddress';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';

export function NewTransactionForm() {
	const { multisigs, onNewTransaction } = useDashboardContext();
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();
	const handleSubmit = async (values: ISendTransactionForm) => {
		try {
			const { recipient, amount, note, selectedMultisigAddress } = values;
			const payload = {
				recipients: [
					{
						address: recipient,
						amount
					}
				],
				sender: findMultisig(multisigs, selectedMultisigAddress) as IMultisig,
				note
			};
			setLoading(true);
			await onNewTransaction(payload);
			notification.success(SUCCESS_MESSAGES.TRANSACTION_SUCCESS);
		} catch (e) {
			console.log(e);
			notification.error({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: e || e.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full h-full flex flex-col justify-center items-center'>
			{context}
			<Spin
				spinning={loading}
				size='large'
				className='w-full h-full'
			>
				<Form
					layout='vertical'
					onFinish={handleSubmit}
				>
					<SelectAddress multisigs={multisigs} />

					{newTransactionFormFields.map((field) => (
						<Form.Item
							label={field.label}
							name={field.name}
							rules={field.rules}
							key={field.name}
						>
							{field.input}
						</Form.Item>
					))}
					<ActionButton
						disabled={false}
						loading={loading}
					/>
				</Form>
			</Spin>
		</div>
	);
}
