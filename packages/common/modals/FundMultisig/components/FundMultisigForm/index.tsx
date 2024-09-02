import React, { useState } from 'react';
import { Form, Spin } from 'antd';
import ActionButton from '@common/global-ui-components/ActionButton';
import { IMultisig } from '@common/types/substrate';
import SelectAddress from '@common/global-ui-components/SelectAddress';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { fundFormFields } from '@common/modals/FundMultisig/utils/form';

export function FundMultisigForm() {
	const { multisigs, onFundMultisig } = useDashboardContext();
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();
	const handleSubmit = async (values: { amount: string; selectedMultisigAddress: string }) => {
		try {
			const { amount, selectedMultisigAddress } = values;
			const payload = {
				amount,
				multisigAddress: findMultisig(multisigs, selectedMultisigAddress) as IMultisig
			};
			setLoading(true);
			await onFundMultisig(payload);
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

					{fundFormFields.map((field) => (
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
						label='Fund Multisig'
					/>
				</Form>
			</Spin>
		</div>
	);
}
