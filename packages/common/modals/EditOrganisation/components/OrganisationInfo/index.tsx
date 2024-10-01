import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Input from '@common/global-ui-components/Input';
import { ICreateOrganisationDetails } from '@common/types/substrate';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { useNotification } from '@common/utils/notification';
import { Form, Spin } from 'antd';
import { useState } from 'react';

const organisationForm = [
	{
		label: 'Organisation Name',
		name: 'organisationName',
		type: 'text',
		required: true
	},
	{
		label: 'Full Name',
		name: 'fullName',
		type: 'text',
		required: true
	},
	{
		label: 'Address',
		name: 'address',
		type: 'text',
		required: true
	},
	{
		label: 'City',
		name: 'city',
		type: 'text',
		required: true
	},
	{
		label: 'State',
		name: 'state',
		type: 'text',
		required: true
	},
	{
		label: 'Postal Code',
		name: 'postalCode',
		type: 'text',
		required: true
	},
	{
		label: 'Country',
		name: 'country',
		type: 'text',
		required: true
	},
	{
		label: 'Tax Number',
		name: 'taxNumber',
		type: 'text',
		required: false
	}
];

export const OrganisationInfo = ({ onSubmit }: { onSubmit: (value: ICreateOrganisationDetails) => void }) => {
	const [loading, setLoading] = useState(false);
	const notification = useNotification();

	const handleFinish = (value: any) => {
		try {
			setLoading(true);
			console.log(value);
			onSubmit(value);
			notification(SUCCESS_MESSAGES.UPDATE_MULTISIG_SUCCESS);
		} catch (error) {
			notification(ERROR_MESSAGES.UPDATE_MULTISIG_FAILED);
		} finally {
			setLoading(false);
		}
	};
	return (
		<Spin
			className='p-4'
			spinning={loading}
		>
			<Form
				layout='vertical'
				onFinish={handleFinish}
			>
				{organisationForm.map((field) => (
					<Form.Item
						label={field.label}
						name={field.name}
						rules={[{ required: field.required, message: `Please input your ${field.label}` }]}
						key={field.name}
						className='m-2'
					>
						<Input className='bg-bg-main' />
					</Form.Item>
				))}
				<div className='pr-1'>
					<Button
						variant={EButtonVariant.PRIMARY}
						htmlType='submit'
						fullWidth
					>
						Submit
					</Button>
				</div>
			</Form>
		</Spin>
	);
};
