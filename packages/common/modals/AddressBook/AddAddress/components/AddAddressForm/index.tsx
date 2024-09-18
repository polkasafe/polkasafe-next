import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { addAddressFormFields } from '@common/modals/AddressBook/AddAddress/utils/form';
import { IAddressBook } from '@common/types/substrate';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { Form, Spin } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { useState } from 'react';

export const AddAddressForm = ({
	initialValue,
	onSubmit
}: {
	initialValue: IAddressBook;
	onSubmit: (value: IAddressBook) => Promise<void>;
}) => {
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();
	const handleSubmit = async (values: IAddressBook) => {
		try {
			const { address, name, email, discord, telegram } = values;
			if (!address || !name) {
				return;
			}

			const payload = {
				address,
				name,
				email: email === '-' ? '' : email,
				discord: discord === '-' ? '' : discord,
				telegram: telegram === '-' ? '' : telegram
			};
			setLoading(true);
			await onSubmit(payload);
			notification.success(SUCCESS_MESSAGES.ADD_ADDRESS_SUCCESS);
		} catch (error) {
			notification.error({ ...ERROR_MESSAGES.ADD_ADDRESS_FAILED, description: error || error.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<Spin spinning={loading}>
			{context}
			<Form
				initialValues={initialValue}
				layout='vertical'
				onFinish={handleSubmit}
			>
				{addAddressFormFields.map((field) => {
					return (
						<Form.Item
							key={field.name}
							name={field.name}
							label={field.label}
							rules={field.rules}
							required={field.required}
						>
							{field.input}
						</Form.Item>
					);
				})}
				<Button
					variant={EButtonVariant.PRIMARY}
					fullWidth
					htmlType='submit'
				>
					Submit
				</Button>
			</Form>
		</Spin>
	);
};
