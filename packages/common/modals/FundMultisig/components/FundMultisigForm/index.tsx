import React, { useState } from 'react';
import { Form, Spin } from 'antd';
import ActionButton from '@common/global-ui-components/ActionButton';
import { IMultisig } from '@common/types/substrate';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { fundFormFields } from '@common/modals/FundMultisig/utils/form';
import { MultisigDropdown } from '@common/global-ui-components/MultisigDropdown';
import { ENetwork } from '@common/enum/substrate';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { notification } from '@common/utils/notification';

export function FundMultisigForm() {
	const { multisigs, onFundMultisig } = useDashboardContext();
	const [loading, setLoading] = useState(false);
	const [selectedMultisigDetails, setSelectedMultisigDetails] = useState<{
		address: string;
		network: ENetwork;
		name: string;
		proxy?: string;
	}>({
		address: multisigs[0].address,
		network: multisigs[0].network,
		name: multisigs[0].name
	});
	const handleSubmit = async (values: { amount: string }) => {
		try {
			const { amount } = values;
			const payload = {
				amount,
				multisigAddress: findMultisig(multisigs, selectedMultisigDetails.address) as IMultisig,
				selectedProxy: selectedMultisigDetails.proxy
			};
			setLoading(true);
			await onFundMultisig(payload);
			notification(SUCCESS_MESSAGES.TRANSACTION_SUCCESS);
		} catch (e) {
			console.log(e);
			notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: e || e.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full h-full flex flex-col justify-center items-center'>
			<Spin
				spinning={loading}
				size='large'
				className='w-full h-full'
			>
				<Form
					layout='vertical'
					onFinish={handleSubmit}
				>
					<div className='flex flex-col gap-4'>
						<div>
							<Typography
								variant={ETypographyVariants.p}
								className='text-label font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'
							>
								Sending Address
							</Typography>
							<MultisigDropdown
								multisigs={multisigs}
								onChange={(value: { address: string; network: ENetwork; name: string; proxy?: string }) =>
									setSelectedMultisigDetails(value)
								}
							/>
						</div>

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
					</div>
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
