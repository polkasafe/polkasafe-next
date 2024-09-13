import React, { ReactNode } from 'react';
import { Select, Dropdown as AntdDropdown, DropdownProps } from 'antd';
import { CircleArrowDownIcon } from '@common/global-ui-components/Icons';
import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';

interface IDropdownProps extends DropdownProps {
	children: ReactNode;
}

function Dropdown({ children, ...props }: IDropdownProps) {
	return (
		<AntdDropdown
			trigger={['click']}
			className='border border-primary rounded-lg p-1.5 bg-bg-secondary cursor-pointer min-w-[150px]'
			{...props}
		>
			{children}
		</AntdDropdown>
	);
}

export default Dropdown;
