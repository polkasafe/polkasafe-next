'use client';

import { ENetwork } from '@common/enum/substrate';
import ActionButton from '@common/global-ui-components/ActionButton';
import { createMultisigFormFields } from '@common/global-ui-components/CreateMultisig/utils/form';
import { SelectNetwork } from '@common/global-ui-components/SelectNetwork';
import { ICreateMultisig } from '@common/types/substrate';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { Checkbox, Form, Spin } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { useState } from 'react';

// use availableSignatories to populate the select options
export const CreateMultisig = ({ networks, availableSignatories, onSubmit }: ICreateMultisig) => {
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();

	const signatoriesOptions = availableSignatories?.map((signatory) => ({
		label: <p>{signatory.name || signatory.address}</p>,
		value: signatory.address
	}));

	const handleSubmit = async (values: {
		name: string;
		signatories: Array<string>;
		network: ENetwork;
		threshold: number;
	}) => {
		try {
			const { name, signatories, network, threshold } = values;
			if (!signatories) {
				notification.error({ ...ERROR_MESSAGES.CREATE_MULTISIG_FAILED, description: 'Please select signatories' });
				return;
			}
			if (signatories.length < 2) {
				notification.error({
					...ERROR_MESSAGES.CREATE_MULTISIG_FAILED,
					description: 'Please select at least 2 signatories'
				});
				return;
			}
			if (!name) {
				notification.error({ ...ERROR_MESSAGES.CREATE_MULTISIG_FAILED, description: 'Please enter a name' });
				return;
			}
			if (!network) {
				notification.error({ ...ERROR_MESSAGES.CREATE_MULTISIG_FAILED, description: 'Please select a network' });
				return;
			}
			setLoading(true);
			await onSubmit({ name, signatories, network, threshold });
			notification.success(SUCCESS_MESSAGES.CREATE_MULTISIG_SUCCESS);
		} catch (e) {
			notification.error({ ...ERROR_MESSAGES.CREATE_MULTISIG_FAILED, description: e || e.message });
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
					<SelectNetwork
						networks={networks}
						selectedNetwork={ENetwork.POLKADOT}
					/>

					{createMultisigFormFields.map((field) => (
						<Form.Item
							label={field.label}
							name={field.name}
							rules={field.rules}
							key={field.name}
						>
							{field.input}
						</Form.Item>
					))}
					{availableSignatories && (
						<Form.Item
							label='Signatories'
							name='signatories'
							rules={[{ required: true, message: 'Please select signatories' }]}
						>
							<Checkbox.Group options={signatoriesOptions} />
						</Form.Item>
					)}
					<ActionButton
						disabled={false}
						loading={loading}
						label='Create Multisig'
					/>
				</Form>
			</Spin>
		</div>
	);
};
