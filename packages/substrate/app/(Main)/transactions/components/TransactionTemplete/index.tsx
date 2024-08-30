// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React from 'react';
import Button from '@common/global-ui-components/Button';
import Link from 'next/link';
import { MULTISIG_TRANSACTION_URL } from '@substrate/app/global/end-points';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '@sdk/polkasafe-sdk/src/constants/pagination';
import { ETransactionType } from '@common/enum/substrate';
import { ITransaction } from '@common/types/substrate';
import History from '../History';
import Queue from '../Queue';

interface ITransactionTemplateProps {
	network: string;
	address: string;
	type: ETransactionType;
	transactions: Array<ITransaction>;
}

function TransactionTemplate({ type, transactions, address, network }: ITransactionTemplateProps) {
	return (
		<div>
			<div>
				<div className='flex gap-2'>
					<Link
						href={MULTISIG_TRANSACTION_URL({
							multisig: address,
							page: DEFAULT_PAGE,
							limit: DEFAULT_PAGE_SIZE,
							network,
							type: ETransactionType.QUEUE_TRANSACTION
						})}
					>
						<Button type='primary'>Queue</Button>
					</Link>
					<Link
						href={MULTISIG_TRANSACTION_URL({
							multisig: address,
							page: DEFAULT_PAGE,
							limit: DEFAULT_PAGE_SIZE,
							network,
							type: ETransactionType.HISTORY_TRANSACTION
						})}
					>
						<Button
							disabled={type === ETransactionType.HISTORY_TRANSACTION}
							type='primary'
						>
							History
						</Button>
					</Link>
				</div>
			</div>
			{type === ETransactionType.QUEUE_TRANSACTION && <Queue transactions={transactions} />}
			{type === ETransactionType.HISTORY_TRANSACTION && <History transactions={transactions} />}
		</div>
	);
}

export default TransactionTemplate;
