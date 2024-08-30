// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Collapse from '@common/global-ui-components/Collapse';
import { ITransaction } from '@common/types/substrate';
import React from 'react';

interface IQueueProps {
	transactions: Array<ITransaction>;
}

function Queue({ transactions }: IQueueProps) {
	console.log(transactions);
	const collapseItems = transactions.map((tx) => ({
		key: tx.callHash,
		label: <p>{tx.callHash}</p>,
		children: <p>{tx.callData}</p>
	}));
	return (
		<Collapse
			items={collapseItems}
			defaultActiveKey={[]}
		/>
	);
}
export default Queue;
