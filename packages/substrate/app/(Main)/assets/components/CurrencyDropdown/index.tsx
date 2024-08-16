'use client';

import React from 'react'
import Dropdown from '@common/global-ui-components/Dropdown'

export default function CurrencyDropdown({label = true}: {label?: boolean}) {
  return (
    <div>
      {label ? 'Currency:': '' }<Dropdown placeholder='Select Currency' options={[{label: 'USD', value: 'USD'}, {label: 'EUR', value: 'EUR'}, {label: 'JPY', value: 'JPY'}]} value='USD' onChange={(value)=>console.log(value)}/>
    </div>
  )
}
