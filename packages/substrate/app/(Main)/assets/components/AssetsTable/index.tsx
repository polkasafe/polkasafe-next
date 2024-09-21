// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Address from '@common/global-ui-components/Address';
import Button from '@common/global-ui-components/Button';
import { IMultisigAssets } from '@common/types/substrate';
import { getCurrencySymbol } from '@common/utils/getCurrencySymbol';
import { Table } from 'antd';
import Image from 'next/image';

interface IAssetsTableProps {
	dataSource: Array<IMultisigAssets>;
	currency: string;
}

function AssetsTable({ dataSource, currency }: IAssetsTableProps) {
	const assetsColumns = [
		{
			title: 'Asset',
			dataIndex: 'symbol',
			key: 'symbol'
		},
		{
			title: 'Balance',
			dataIndex: 'free',
			key: 'free'
		},
		{
			title: 'Value',
			dataIndex: 'usd',
			key: 'usd',
			render: (usd: string, allData: IMultisigAssets) => {
				const symbol = getCurrencySymbol(currency);
				return (
					<div className='flex gap-2'>
						{symbol} {allData.allCurrency?.[allData.network]?.[currency.toLowerCase()]?.toFixed(2)}
					</div>
				);
			}
		},
		{
			title: 'Multisig',
			dataIndex: 'address',
			key: 'address',
			render: (address: string, allData: IMultisigAssets) => (
				<div>
					<Address
						address={address}
						network={allData.network}
					/>
				</div>
			)
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
			scroll={{ x: 950, y: 'calc(100vh - 400px)' }}
		/>
	);
}

export default AssetsTable;
