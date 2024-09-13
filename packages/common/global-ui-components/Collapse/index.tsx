import React from 'react';
import { Collapse as AntdCollapase, CollapseProps } from 'antd';
import { CircleArrowDownIcon } from '@common/global-ui-components/Icons';
import './style.css';

function Collapse({ ...props }: CollapseProps) {
	return (
		<AntdCollapase
			{...props}
			className={props.className}
			// eslint-disable-next-line react/no-unstable-nested-components
			expandIcon={({ isActive }) => <CircleArrowDownIcon className={`text-primary text-lg ${isActive ? 'rotate-[180deg]' : ''}`} />}
		/>
	);
}

export default Collapse;
