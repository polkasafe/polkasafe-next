// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import CurrencyDropdown from '../CurrencyDropdown';
import AssetsTable from '../AssetsTable';
import { useAssets } from '@substrate/app/atoms/assets/assetsAtom';
import { Skeleton } from 'antd';
import { useCurrency } from '@substrate/app/atoms/currency/currencyAtom';
import { getCurrencySymbol } from '@common/constants/currencyConstants';

function AssetsTemplate() {
	const [assets] = useAssets();
	const [selectedCurrency, setSelectedCurrency] = useCurrency();

	return (
		<div className='bg-bg-main rounded-xl p-5 h-full gap-5 flex flex-col'>
			<div className='flex justify-between items-center'>
				<h1>Tokens</h1>
				<CurrencyDropdown
					onChange={(val) => {
						setSelectedCurrency(val);
						localStorage.setItem('currency', val);
					}}
				/>
			</div>
			{assets && assets.length > 0 ? (
				<AssetsTable
					dataSource={assets || []}
					currency={String(getCurrencySymbol(selectedCurrency))}
				/>
			) : (
				<Skeleton />
			)}
		</div>
	);
}

export default AssetsTemplate;
