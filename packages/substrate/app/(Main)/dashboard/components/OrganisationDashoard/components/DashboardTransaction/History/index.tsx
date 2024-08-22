// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import TransactionHead from '@common/global-ui-components/Transaction/TransactionHead';
import { Skeleton } from 'antd';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { IDashboardTransaction } from '@common/types/substrate';
import { getApiAtomByNetwork } from '@substrate/app/global/utils/getApiAtomByNetwork';
import { PrimitiveAtom } from 'jotai';
import { IApiAtom } from '@substrate/app/atoms/api/apiAtom';

interface IHistoryProps {
	transactions: Array<IDashboardTransaction> | null;
}

function History({ transactions = [] }: IHistoryProps) {
	return (
		<>
			<div className='flex bg-bg-secondary my-1 p-3 rounded-lg mr-1'>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/5 text-base'
				>
					Details
				</Typography>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/5 text-base'
				>
					Amount
				</Typography>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/5 text-base'
				>
					Date
				</Typography>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/5 text-base'
				>
					Multisig
				</Typography>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/5 text-base'
				>
					Action
				</Typography>
			</div>
			<div className='max-h-72 overflow-x-hidden overflow-y-auto flex flex-col gap-3'>
				{!transactions ? (
					<Skeleton active />
				) : (
					transactions.map((transaction) => (
						<TransactionHead
							key={`${transaction.callHash}`}
							callData={transaction.callData}
							callHash={transaction.callHash}
							createdAt={transaction.createdAt.toLocaleString()}
							multisigAddress={transaction.multisigAddress}
							network={transaction.network}
							amountToken={transaction.amountToken}
							from={transaction.from}
							apiAtom={getApiAtomByNetwork(transaction.network) as PrimitiveAtom<IApiAtom>}
						/>
					))
				)}
			</div>
		</>
	);
}

export default History;
