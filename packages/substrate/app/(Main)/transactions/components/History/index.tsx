'use client';
import Collapse from '@common/global-ui-components/Collapse';
import { ITransaction } from '@substrate/app/global/types';
import React from 'react'

interface IHistoryProps {
  transactions: Array<ITransaction>;
}

function History({transactions}: IHistoryProps) {
  console.log(transactions)
  const collapseItems = transactions.map((tx, index) => ({
    key: tx.callHash,
    label: <p>{tx.callHash}</p>,
    children: <p>{tx.callData}</p>
  }))
  return (
    <Collapse items={collapseItems} defaultActiveKey={[]}/>
  )
}

export default History