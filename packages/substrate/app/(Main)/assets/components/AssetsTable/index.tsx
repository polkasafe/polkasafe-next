// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import React from 'react';
import Table from '@common/global-ui-components/Table';
import Button from '@common/global-ui-components/Button';

interface IAssetsTableProps {
	dataSource: Array<{ asset: string; balance: string; value: string }>;
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
			columns={assetsColumns}
			dataSource={dataSource}
		/>
	);
}

export default AssetsTable;
