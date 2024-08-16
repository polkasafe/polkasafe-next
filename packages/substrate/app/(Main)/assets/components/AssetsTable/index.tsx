'use client';

import React from 'react'
import Table from '@common/global-ui-components/Table'
import Button from '@common/global-ui-components/Button'

interface IAssetsTableProps {
  dataSource: Array<{asset: string, balance: string, value: string}>
}


function AssetsTable({dataSource}: IAssetsTableProps) {

  const _assetsColumns = [
    {
      title: 'Asset',
      dataIndex: 'asset',
      key: 'asset',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (data: any) => (
        <div>
          <Button type='primary' onClick={()=>console.log(data)}>Send</Button>
        </div>
      )
    }
  ]
  return (
    <Table columns={_assetsColumns} dataSource={dataSource}/>
  )
}

export default AssetsTable