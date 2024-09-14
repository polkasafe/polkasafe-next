import { Table as AntdTable } from 'antd';
import styled from 'styled-components';
import { IAsset } from '@common/types/substrate';

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
	multisig: string;
};

interface ITableProps {
	columns: Array<TColumns>;
	dataSource: Array<IAsset>;
}

function Table({ columns, dataSource }: ITableProps) {
	const data: Array<TDataSource> = dataSource.map((asset) => ({
		asset: asset.symbol,
		balance: asset.balanceToken,
		value: asset.balanceUSD,
		multisig: asset.multisigId?.split('-')?.[0] || ''
	}));
	return (
		<StyledTable
			rowClassName='bg-bg-main'
			pagination={false}
			className='w-full bg-bg-main'
			columns={columns}
			dataSource={data}
		/>
	);
}

export default Table;
