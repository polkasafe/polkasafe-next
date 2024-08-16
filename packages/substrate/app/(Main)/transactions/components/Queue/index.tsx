'use client';
import { ITransaction } from '@substrate/app/global/types';
import Collapse  from '@common/global-ui-components/Collapse';
import React from 'react'

interface IQueueProps {
  transactions: Array<ITransaction>;
}

function Queue({transactions}: IQueueProps) {
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
export default Queue;
