/* eslint-disable sonarjs/no-duplicate-string */
import React, { useState } from 'react';
import { Form, Spin } from 'antd';
import { IMultisig } from '@common/types/substrate';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES, INFO_MESSAGES } from '@common/utils/messages';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { OutlineCloseIcon } from '@common/global-ui-components/Icons';
import BN from 'bn.js';
import Address from '@common/global-ui-components/Address';
import { ENetwork } from '@common/enum/substrate';
import BalanceInput from '@common/global-ui-components/BalanceInput';

import './style.css';
import { MultisigDropdown } from '@common/global-ui-components/MultisigDropdown';
import { RecipientsInputs } from '@common/global-ui-components/RecipientsInputs';

export interface IRecipientAndAmount {
	recipient: string;
	amount: BN;
}

export function NewTransactionForm({ onClose }: { onClose: () => void }) {
	const { multisigs, onNewTransaction, addressBook = [] } = useDashboardContext();
	const [notification, context] = useNotification();
	const [form] = Form.useForm();

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

	const [loading, setLoading] = useState(false);

	const autocompleteAddresses = addressBook.map((item) => ({
		label: (
			<Address
				network={selectedMultisigDetails.network}
				address={item.address}
			/>
		),
		value: item.address
	}));

	const handleSubmit = async () => {
		try {
			const multisigId = `${selectedMultisigDetails.address}_${selectedMultisigDetails.network}`;
			const tip = form.getFieldValue('tipBalance');
			const note = form.getFieldValue('note');
			const recipientAndAmount: Array<IRecipientAndAmount> = form.getFieldValue('recipients');
			console.log(recipientAndAmount, tip);
			const payload = {
				recipients: recipientAndAmount.map((item) => ({ address: item.recipient, amount: item.amount })),
				sender: findMultisig(multisigs, multisigId) as IMultisig,
				selectedProxy: selectedMultisigDetails.proxy,
				note: note || ''
			};
			setLoading(true);
			await onNewTransaction(payload);
			notification.info(INFO_MESSAGES.TRANSACTION_IN_BLOCK);
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
					className='flex flex-col gap-y-6'
					form={form}
				>
					<div>
						<p className='text-label font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'>
							Sending from
						</p>
						<MultisigDropdown
							multisigs={multisigs}
							onChange={(value: { address: string; network: ENetwork; name: string; proxy?: string }) =>
								setSelectedMultisigDetails(value)
							}
						/>
					</div>
					<RecipientsInputs
						form={form}
						autocompleteAddresses={autocompleteAddresses}
						network={selectedMultisigDetails.network}
					/>

					<BalanceInput
						network={selectedMultisigDetails.network}
						label='Tip'
						onChange={(balance) => console.log(balance)}
						formName='tipBalance'
						required={false}
					/>

					<div className='flex items-center gap-x-4 w-full'>
						<div className='w-full'>
							<Button
								fullWidth
								size='large'
								onClick={onClose}
								variant={EButtonVariant.DANGER}
								icon={<OutlineCloseIcon className='text-failure' />}
							>
								Cancel
							</Button>
						</div>
						<div className='w-full'>
							<Button
								fullWidth
								size='large'
								onClick={handleSubmit}
								variant={EButtonVariant.PRIMARY}
							>
								Next
							</Button>
						</div>
					</div>
				</Form>
			</Spin>
		</div>
	);
}
