'use client';

import Button from '@common/global-ui-components/Button';
import { SelectNetwork } from '@common/global-ui-components/SelectNetwork';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { ILinkMultisig, IMultisig } from '@common/types/substrate';
import { ERROR_MESSAGES } from '@common/utils/messages';
import { Divider, Spin } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { useState } from 'react';
// use availableSignatories to populate the select options
export const LinkMultisig = ({
	networks,
	linkedMultisig,
	availableMultisig,
	onSubmit,
	onRemoveSubmit,
	fetchMultisig
}: ILinkMultisig) => {
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();

	const handleSubmit = async (values: { multisig: IMultisig }) => {
		try {
			const { multisig } = values;
			if (!multisig) {
				notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED });
				return;
			}
			setLoading(true);
			await onSubmit?.(multisig);
		} catch (e) {
			notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED, description: e || e.message });
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveSubmit = async (values: { multisig: IMultisig }) => {
		try {
			const { multisig } = values;
			if (!multisig) {
				notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED });
				return;
			}
			setLoading(true);
			await onRemoveSubmit?.(multisig);
		} catch (e) {
			notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED, description: e || e.message });
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
				<SelectNetwork
					networks={networks}
					onChange={fetchMultisig}
				/>

				{Boolean(linkedMultisig.length) && <Typography variant={ETypographyVariants.h3}>Linked Multisig</Typography>}

				{linkedMultisig.map((multisig) => (
					<div>
						<div>{multisig.address}</div>
						<Button onClick={() => handleRemoveSubmit({ multisig })}>Remove</Button>
					</div>
				))}
				<Divider />
				<Typography variant={ETypographyVariants.h3}>Available Multisig</Typography>
				{availableMultisig.map((multisig) => (
					<div>
						<div>{multisig.address}</div>
						<Button onClick={() => handleSubmit({ multisig })}>Link</Button>
					</div>
				))}
				<Divider />
			</Spin>
		</div>
	);
};
