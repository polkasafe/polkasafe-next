import React from 'react';
import { Table as AntdTable } from 'antd';
import styled from 'styled-components';

const StyledTable = styled(AntdTable)`
	.ant-table-content {
		background-color: var(--bg-main);
	}
	.ant-table-row > .ant-table-cell-row-hover {
		background-color: var(--bg-main) !important;
	}
`;

type TColumns = {
	title: string;
	dataIndex: string;
	key: string;
};

type TDataSource = {
	asset: string;
	balance: string;
	value: string;
};

interface ITableProps {
	columns: Array<TColumns>;
	dataSource: Array<TDataSource>;
}

function Table({ columns, dataSource }: ITableProps) {
	return (
		<StyledTable
			rowClassName='bg-bg-main'
			pagination={false}
			className='w-full bg-bg-main'
			columns={columns}
			dataSource={dataSource}
		/>
	);
}

export default Table;
