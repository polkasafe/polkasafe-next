// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
'use client';

import Button from '@common/global-ui-components/Button';
import Link from 'next/link';
import { MULTISIG_TRANSACTION_URL, ORGANISATION_TRANSACTION_URL } from '@substrate/app/global/end-points';
import { ETransactionType } from '@common/enum/substrate';
import { ITransaction } from '@common/types/substrate';
import History from '../History';
import Queue from '../Queue';

interface ITransactionTemplateProps {
	organisationId?: string;
	network?: string;
	address?: string;
	type: ETransactionType;
	transactions: Array<ITransaction>;
	page: number;
	limit: number;
}

function TransactionTemplate({
	organisationId,
	type,
	transactions,
	address,
	network,
	page,
	limit
}: ITransactionTemplateProps) {
	return (
		<div>
			<div>
				<div className='flex gap-2'>
					<Link
						href={
							organisationId
								? ORGANISATION_TRANSACTION_URL({
										organisationId,
										page: page,
										limit: limit,
										type: ETransactionType.QUEUE_TRANSACTION
									})
								: MULTISIG_TRANSACTION_URL({
										multisig: address as string,
										page: page,
										limit: limit,
										network: network as string,
										type: ETransactionType.QUEUE_TRANSACTION
									})
						}
					>
						<Button type='primary'>Queue</Button>
					</Link>
					<Link
						href={
							organisationId
								? ORGANISATION_TRANSACTION_URL({
										organisationId,
										page: page,
										limit: limit,
										type: ETransactionType.HISTORY_TRANSACTION
									})
								: MULTISIG_TRANSACTION_URL({
										multisig: address as string,
										page: page,
										limit: limit,
										network: network as string,
										type: ETransactionType.HISTORY_TRANSACTION
									})
						}
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
