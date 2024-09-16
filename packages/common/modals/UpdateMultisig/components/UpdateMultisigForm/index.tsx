import { IAddressBook, IMultisig } from '@common/types/substrate';
import { Form, Input, Spin } from 'antd';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { useState } from 'react';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import Address from '@common/global-ui-components/Address';
import { DeleteIcon, EditIcon } from '@common/global-ui-components/Icons';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES } from '@common/utils/messages';
import ActionButton from '@common/global-ui-components/ActionButton';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
// import { AddressInput } from '@common/global-ui-components/AddressInput';

interface IUpdateMultisigForm {
	multisig: IMultisig;
	proxyAddress: string;
	onSubmit: (values: any) => Promise<void>;
	addresses: Array<IAddressBook>;
}

export const UpdateMultisigForm = ({
	multisig,
	proxyAddress,
	onSubmit,
	addresses: addressesOptions
}: IUpdateMultisigForm) => {
	const [notification, context] = useNotification();

	const [addresses, setAddresses] = useState<Array<string>>([...multisig.signatories.map((signatory) => signatory)]);
	const [loading, setLoading] = useState(false);

	const [form] = Form.useForm();
	console.log('multisig', addressesOptions);

	const handleSubmit = async () => {
		const values = form.getFieldsValue();
		const signatories = addresses;
		const { threshold } = values;
		try {
			setLoading(true);
			await onSubmit({
				signatories,
				threshold,
				proxyAddress
			});
		} catch (e) {
			notification.error(ERROR_MESSAGES.UPDATE_MULTISIG_FAILED);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Spin
			className='w-full mb-4 flex flex-col gap-2'
			spinning={loading}
		>
			{context}
			<div className='flex flex-col gap-2 mb-6'>
				<Typography
					variant={ETypographyVariants.h1}
					className='text-lg'
				>
					Signatories
				</Typography>

				{addresses.map((address) => (
					<div className='flex justify-between'>
						<Address
							address={address}
							network={multisig.network}
						/>
						<div className='flex justify-center gap-2'>
							<Button
								size='small'
								variant={EButtonVariant.DANGER}
								onClick={() => {
									form.setFieldsValue({ address });
									setAddresses(addresses.filter((addr) => addr !== address));
								}}
								className='bg-bg-secondary text-white'
							>
								<EditIcon />
							</Button>
							<Button
								size='small'
								variant={EButtonVariant.DANGER}
								onClick={() => {
									if (addresses.length === 2) {
										notification.error({
											...ERROR_MESSAGES.INVALID_ADDRESS,
											description: 'Cannot remove the last 2 signatories'
										});
										return;
									}
									setAddresses(addresses.filter((addr) => addr !== address));
								}}
							>
								<DeleteIcon />
							</Button>
						</div>
					</div>
				))}
			</div>
			<Form
				layout='vertical'
				form={form}
				onFinish={handleSubmit}
			>
				<Form.Item
					label='New Signatory Address'
					name='address'
					rules={[
						() => ({
							validator(_, value) {
								if (getSubstrateAddress(value) === null) {
									return Promise.reject(new Error('Enter a valid address'));
								}
								if (addresses.includes(value)) {
									return Promise.reject(new Error('Address already exists'));
								}
								return Promise.resolve();
							}
						})
					]}
				>
					<div className='flex gap-2'>
						<Input
							placeholder='Enter address'
							name='address'
						/>
						{/* <AddressInput
							addresses={addressesOptions}
							placeholder='Enter Address'
							network={multisig.network}
						/> */}
						<Button
							variant={EButtonVariant.PRIMARY}
							onClick={() => {
								const value = form.getFieldsValue();
								const address = getEncodedAddress(value.address, multisig.network);
								if (!address) {
									notification.error({
										...ERROR_MESSAGES.INVALID_ADDRESS,
										description: 'Please enter a valid address'
									});
									return;
								}
								if (addresses.includes(address)) {
									notification.error({
										...ERROR_MESSAGES.INVALID_ADDRESS,
										description: 'Address already exists'
									});
									return;
								}
								const payload = [...addresses, address];
								setAddresses(payload);
								form.resetFields();
							}}
							disabled={form.getFieldError('address')?.length > 0}
						>
							Add
						</Button>
					</div>
				</Form.Item>
				<Form.Item
					label='Threshold'
					name='threshold'
					initialValue={multisig.threshold}
					rules={[
						{ required: true, message: 'Threshold is required' },
						() => ({
							validator(_, value) {
								if (value < 2) {
									return Promise.reject(new Error('Threshold must be greater than 2'));
								}
								return Promise.resolve();
							}
						}),
						() => ({
							validator(_, value) {
								if (Number.isNaN(value)) {
									return Promise.reject(new Error('Enter a valid number'));
								}
								if (Number(value) > addresses.length) {
									return Promise.reject(new Error('Threshold cannot be greater than the number of signatories'));
								}
								return Promise.resolve();
							}
						})
					]}
				>
					<Input
						placeholder='Enter new threshold'
						name='threshold'
					/>
				</Form.Item>
				<ActionButton
					label='Submit'
					disabled={addresses.length < 2 || form.getFieldError('threshold')?.length > 0}
					loading={loading}
				/>
			</Form>
		</Spin>
	);
};
