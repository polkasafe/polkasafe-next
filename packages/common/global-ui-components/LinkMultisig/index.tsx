'use client';

import ActionButton from '@common/global-ui-components/ActionButton';
import { SelectNetwork } from '@common/global-ui-components/SelectNetwork';
import { ILinkMultisig, IMultisig } from '@common/types/substrate';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { Divider, Form, Spin } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { useState } from 'react';
// use availableSignatories to populate the select options
export const LinkMultisig = ({
	networks,
	linkedMultisig,
	availableMultisig,
	onSubmit,
	fetchMultisig
}: ILinkMultisig) => {
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();

	const handleSubmit = async (values: { multisig: IMultisig }) => {
		try {
			const { multisig } = values;
			if (!multisig) {
				notification.error({ ...ERROR_MESSAGES.CREATE_MULTISIG_FAILED, description: 'Please select signatories' });
				return;
			}
			setLoading(true);
			await onSubmit?.(multisig);
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
						onChange={fetchMultisig}
					/>

					{/* this should be multi select select component add that on form item */}

					{linkedMultisig.map((multisig) => (
						<div>{multisig.address}</div>
					))}
					<Divider />
					{availableMultisig.map((multisig) => (
						<div>{multisig.address}</div>
					))}
					<ActionButton
						disabled={false}
						loading={loading}
						label='Link Multisig'
					/>
				</Form>
			</Spin>
		</div>
	);
};
