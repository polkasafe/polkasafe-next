import React from 'react';
import { Collapse as AntdCollapase, CollapseProps } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

interface ICollapse extends CollapseProps {
	items: Array<any>;
	defaultActiveKey: Array<string>;
}

function Collapse({ items, defaultActiveKey }: ICollapse) {
	return (
		<AntdCollapase
			bordered={false}
			defaultActiveKey={defaultActiveKey}
			// eslint-disable-next-line react/no-unstable-nested-components
			expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
			items={items}
		/>
	);
}

export default Collapse;
