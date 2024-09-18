// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { ETransactionType } from '@common/enum/substrate';
import { Empty } from '@common/global-ui-components/Empty';
import { IDashboardTransaction, IMultisig } from '@common/types/substrate';
import { TransactionList } from '@substrate/app/(Main)/dashboard/components/OrganisationDashboard/components/ActionsAndDetails/components/TransactionList';
import { useHistoryTransaction } from '@substrate/app/global/hooks/queryHooks/useHistoryTransaction';
import { Skeleton } from 'antd';
import React, { useEffect, useState } from 'react';

interface IQuickHistory {
	multisigs: Array<IMultisig>;
}

export function QuickHistory({ multisigs }: IQuickHistory) {
	const multisigIds = multisigs.map((multisig) => `${multisig.address}_${multisig.network}`);

	const {
		data: transactions,
		isLoading,
		error
	} = useHistoryTransaction({
		multisigIds
	});

	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	if (isLoading || !transactions) {
		return <Skeleton active />;
	}
	if (error) {
		return <div>Error: {error.message}</div>;
	}

	if (transactions.length === 0) {
		return <Empty description='No Transaction Found' />;
	}
	return (
		<TransactionList
			transactions={(transactions || []) as Array<IDashboardTransaction>}
			txType={ETransactionType.HISTORY_TRANSACTION}
		/>
	);
}
