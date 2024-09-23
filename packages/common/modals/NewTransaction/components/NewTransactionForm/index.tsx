/* eslint-disable sonarjs/no-duplicate-string */
import React, { useState } from 'react';
import { Form, FormInstance, Spin } from 'antd';
import { IMultisig } from '@common/types/substrate';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { OutlineCloseIcon } from '@common/global-ui-components/Icons';
import BN from 'bn.js';
import Address from '@common/global-ui-components/Address';
import { ENetwork } from '@common/enum/substrate';
import BalanceInput from '@common/global-ui-components/BalanceInput';

import './style.css';
import { MultisigDropdown } from '@common/global-ui-components/MultisigDropdown';
import { RecipientsInputs } from '@common/global-ui-components/RecipientsInputs';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { useNotification } from '@common/utils/notification';
import { ERROR_MESSAGES } from '@common/utils/messages';

export enum ETransactionSteps {
	BUILD_TRANSACTION = 'New Transaction',
	REVIEW_TRANSACTION = 'Review Transaction'
}
export interface IRecipientAndAmount {
	recipient: string;
	amount: BN;
}

export function NewTransactionForm({ onClose, form }: { onClose: () => void; form: FormInstance }) {
	const { multisigs, buildTransaction, addressBook = [], assets } = useDashboardContext();
	const notification = useNotification();
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

	const getFormFieldValues = (field: string) => form.getFieldValue(field);

	const handleSubmit = async () => {
		try {
			const multisigId = `${selectedMultisigDetails.address}_${selectedMultisigDetails.network}`;
			const tip = form.getFieldValue('tipBalance') as string;
			const recipientAndAmount: Array<IRecipientAndAmount> = form.getFieldValue('recipients');
			const checkRecipent = recipientAndAmount.filter((item) => !item.recipient || item.amount.eq(new BN(0)));
			if (checkRecipent.length) {
				notification(ERROR_MESSAGES.NO_RECIPIENT);
				return;
			}
			const payload = {
				recipients: recipientAndAmount.map((item) => ({ address: item.recipient, amount: item.amount })),
				sender: findMultisig(multisigs, multisigId) as IMultisig,
				selectedProxy: selectedMultisigDetails.proxy,
				tip
			};
			setLoading(true);
			await buildTransaction(payload);
		} catch (error) {
			notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: error || error.message });
			console.error(error);
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
					className='flex flex-col gap-y-6'
					form={form}
				>
					<div className='flex flex-col gap-y-6'>
						<div>
							<Typography
								variant={ETypographyVariants.p}
								className='text-label font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'
							>
								Sending from
							</Typography>
							<MultisigDropdown
								multisigs={multisigs}
								onChange={(value: { address: string; network: ENetwork; name: string; proxy?: string }) =>
									setSelectedMultisigDetails(value)
								}
								assets={assets || null}
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
					</div>

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
								disabled={form.getFieldsError().filter(({ errors }) => errors.length).length > 0}
								fullWidth
								size='large'
								onClick={handleSubmit}
								variant={EButtonVariant.PRIMARY}
							>
								Confirm
							</Button>
						</div>
					</div>
				</Form>
			</Spin>
		</div>
	);
}
