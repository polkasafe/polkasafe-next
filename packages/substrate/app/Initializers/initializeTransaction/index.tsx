// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useEffect, useState } from 'react';
import { useHistoryAtom, useQueueAtom } from '@substrate/app/atoms/transaction/transactionAtom';
import { useTransactions } from '@substrate/app/global/hooks/queryHooks/useTransactions';
import { ETransactionType } from '@common/enum/substrate';

function InitializeTransaction() {
	const [organisation] = useOrganisation();
	const [queueTransaction, setQueueTransaction] = useQueueAtom();
	const [historyTransaction, setHistoryTransaction] = useHistoryAtom();
	const multisigs = organisation?.multisigs || [];
	const multisigIds = multisigs.map((multisig) => `${multisig.address}_${multisig.network}`);

	const [queueCurrentIndex, setQueueCurrentIndex] = useState<number>(0);
	const [historyCurrentIndex, setHistoryCurrentIndex] = useState<number>(0);

	const { data: historyData, isSuccess: historySuccess } = useTransactions({
		multisigId: multisigIds[historyCurrentIndex],
		type: ETransactionType.HISTORY_TRANSACTION
	});
	const { data: queueData, isSuccess: queueSuccess } = useTransactions({
		multisigId: multisigIds[queueCurrentIndex],
		type: ETransactionType.QUEUE_TRANSACTION
	});

	useEffect(() => {
		if (historySuccess && historyData) {
			const payload = (
				historyTransaction ? [...(historyTransaction?.transactions || []), ...historyData] : historyData
			).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
			setHistoryTransaction({ transactions: payload, currentIndex: historyCurrentIndex });
			// Move to the next ID if there are more left
			if (historyCurrentIndex < multisigIds.length - 1) {
				setHistoryCurrentIndex((prev) => prev + 1);
			}
		}
	}, [historyData, historySuccess, historyCurrentIndex, multisigs.length]);

	useEffect(() => {
		if (queueSuccess && queueData) {
			const payload = (queueTransaction ? [...(queueTransaction?.transactions || []), ...queueData] : queueData).sort(
				(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
			);

			setQueueTransaction({ transactions: payload, currentIndex: queueCurrentIndex });
			// Move to the next ID if there are more left
			if (queueCurrentIndex < multisigIds.length - 1) {
				setQueueCurrentIndex((prev) => prev + 1);
			}
		}
	}, [queueData, queueSuccess, queueCurrentIndex, multisigs.length]);

	useEffect(() => {
		if (!organisation) {
			return;
		}
		// when organisation changes, reset the transaction state
		if (
			historyCurrentIndex === 0 &&
			historyTransaction?.transactions?.length === 0 &&
			queueCurrentIndex === 0 &&
			queueTransaction?.transactions?.length === 0
		) {
			return;
		}
		setHistoryCurrentIndex(0);
		setHistoryTransaction(null);
		setQueueCurrentIndex(0);
		setQueueTransaction(null);
	}, [organisation]);

	return null;
}

export default InitializeTransaction;
