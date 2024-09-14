// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Dropdown from '@common/global-ui-components/Dropdown';

export default function CurrencyDropdown({ label = true }: { label?: boolean }) {
	return (
		<div>
			{label ? 'Currency:' : ''}
			<Dropdown
				placeholder='Select Currency'
				options={[
					{ label: 'USD', value: 'USD' },
					{ label: 'EUR', value: 'EUR' },
					{ label: 'JPY', value: 'JPY' }
				]}
				value='USD'
				onChange={(value) => console.log(value)}
			/>
		</div>
	);
}
