import { Input } from 'antd';

export const newTransactionFormFields = [
	{
		label: 'Recipient',
		name: 'recipient',
		type: 'text',
		required: true,
		placeholder: 'Enter your address',
		rules: [
			{
				required: true,
				message: 'Please input the recipient address!'
			}
		],
		input: <Input />
	},
	{
		label: 'Amount',
		name: 'amount',
		type: 'number',
		required: true,
		placeholder: 'Enter amount',
		rules: [
			{
				required: true,
				message: 'Please input the amount!'
			}
		],
		input: <Input />
	}
];
