import React, { useState } from 'react';
import { Form, Spin } from 'antd';
import { newTransactionFormFields } from '@common/modals/NewTransaction/utils/form';
import ActionButton from '@common/global-ui-components/ActionButton';
import { IMultisig, ISendTransactionForm } from '@common/types/substrate';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { MultisigDropdown } from '@common/global-ui-components/MultisigDropdown';

export function NewTransactionForm() {
	const { multisigs, onNewTransaction } = useDashboardContext();
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();
	const [selectedMultisigAddress, setSelectedMultisigAddress] = useState<string>('');
	const [selectedProxyAddress, setSelectedProxyAddress] = useState<string>('');
	const handleMultisig = (selectedMultisig: IMultisig, proxyAddress?: string) => {
		setSelectedMultisigAddress(selectedMultisig.address);
		setSelectedProxyAddress(proxyAddress || '');
	};
	const handleSubmit = async (values: ISendTransactionForm) => {
		try {
			const { recipient, amount, note } = values;
			const payload = {
				recipients: [
					{
						address: recipient,
						amount
					}
				],
				sender: findMultisig(multisigs, selectedMultisigAddress) as IMultisig,
				selectedProxy: selectedProxyAddress,
				note
			};
			setLoading(true);
			await onNewTransaction(payload);
			notification.info(SUCCESS_MESSAGES.TRANSACTION_SUCCESS);
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
					<MultisigDropdown
						multisigs={multisigs}
						onChange={handleMultisig}
					/>
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
						label='Send Transaction'
					/>
				</Form>
			</Spin>
		</div>
	);
}
