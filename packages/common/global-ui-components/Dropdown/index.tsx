import React from 'react';
import { Select } from 'antd';

interface IDropdownProps {
	placeholder: string;
	options: Array<{ label: string; value: string }>;
	value: string;
	onChange: (value: string) => void;
}

function Dropdown({ placeholder, options, value, onChange }: IDropdownProps) {
	return (
		<Select
			className='bg-bg-secondary'
			placeholder={placeholder}
			options={options}
			value={value}
			onChange={onChange}
		/>
	);
}

export default Dropdown;
