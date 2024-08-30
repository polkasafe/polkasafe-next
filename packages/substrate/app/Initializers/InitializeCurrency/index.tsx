// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useSetAtom } from 'jotai/react';
import { useEffect } from 'react';
import { getCurrencyPrices } from '@sdk/polkasafe-sdk/src';
import { currencyAtom } from '@substrate/app/atoms/currency/currencyAtom';

function InitializeCurrency() {
	const setAtom = useSetAtom(currencyAtom);

	useEffect(() => {
		const handleCurrency = async () => {
			const currencies = await getCurrencyPrices();
			setAtom(currencies.data);
		};
		handleCurrency();
	}, []);

	return null;
}

export default InitializeCurrency;
