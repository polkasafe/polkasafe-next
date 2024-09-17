// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Button from '@common/global-ui-components/Button';
import { IAsset, IMultisigAssets } from '@common/types/substrate';
import { Table } from 'antd';

interface IAssetsTableProps {
	dataSource: Array<IMultisigAssets>;
}

function AssetsTable({ dataSource }: IAssetsTableProps) {
	const assetsColumns = [
		{
			title: 'Asset',
			dataIndex: 'asset',
			key: 'asset'
		},
		{
			title: 'Balance',
			dataIndex: 'balance',
			key: 'balance'
		},
		{
			title: 'Value',
			dataIndex: 'value',
			key: 'value'
		},
		{
			title: 'Multisig',
			dataIndex: 'multisig',
			key: 'multisig'
		},

		{
			title: 'Actions',
			dataIndex: 'actions',
			key: 'actions',
			render: (data: any) => (
				<div>
					<Button
						type='primary'
						onClick={() => console.log(data)}
					>
						Send
					</Button>
				</div>
			)
		}
	];
	return (
		<Table
			rowClassName='bg-bg-main'
			pagination={false}
			className='w-full bg-bg-main'
			columns={assetsColumns}
			dataSource={dataSource}
		/>
	);
}

export default AssetsTable;
