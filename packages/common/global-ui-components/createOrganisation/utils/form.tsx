import { Input } from 'antd';

export const organisationDetailsFormFields = [
	{
		label: 'Name',
		name: 'name',
		type: 'text',
		required: true,
		placeholder: 'Enter organisation name',
		rules: [
			{
				required: true,
				message: 'Please input the organisation name!'
			}
		],
		input: <Input />
	},
	{
		label: 'Description',
		name: 'description',
		type: 'text',
		required: true,
		placeholder: 'Enter organisation description',
		rules: [
			{
				required: true,
				message: 'Please input the organisation description!'
			}
		],
		input: <Input />
	}
];
