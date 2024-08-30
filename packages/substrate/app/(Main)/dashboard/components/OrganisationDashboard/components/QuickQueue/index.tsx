// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { IDashboardTransaction, IMultisig } from '@common/types/substrate';
import { useQueueTransaction } from '@substrate/app/global/hooks/queryHooks/useQueueTransaction';
import { Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';
import { TransactionList } from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/TransactionList';
import { ETransactionType } from '@common/enum/substrate';

interface IQuickHistory {
	multisigs: Array<IMultisig>;
}

export function QuickQueue({ multisigs }: IQuickHistory) {
	const multisigIds = multisigs.map((multisig) => `${multisig.address}_${multisig.network}`);

	const {
		data: transactions,
		isLoading,
		error
	} = useQueueTransaction({
		multisigIds
	});

	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	if (isLoading) {
		return <Skeleton active />;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}
	return (
		<TransactionList
			transactions={(transactions || []) as Array<IDashboardTransaction>}
			txType={ETransactionType.QUEUE_TRANSACTION}
		/>
	);
}
