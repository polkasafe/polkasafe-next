'use client';

import { ENetwork } from '@common/enum/substrate';
import ActionButton from '@common/global-ui-components/ActionButton';
import { createMultisigFormFields } from '@common/global-ui-components/CreateMultisig/utils/form';
import { SelectNetwork } from '@common/global-ui-components/SelectNetwork';
import { IMultisigCreate } from '@common/types/substrate';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { Form, Spin } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { useState } from 'react';

interface ICreateMultisig {
	networks: Array<ENetwork>;
	availableSignatories: Array<string>;
	onSubmit: (values: IMultisigCreate) => void;
}

// use availableSignatories to populate the select options
export const CreateMultisig = ({ networks, availableSignatories, onSubmit }: ICreateMultisig) => {
	console.log('CreateMultisig', networks, availableSignatories, onSubmit);
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();
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
					<SelectNetwork networks={networks} />

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
