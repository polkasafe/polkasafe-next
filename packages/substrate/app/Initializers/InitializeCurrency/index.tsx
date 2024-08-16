'use client';

import { useSetAtom } from 'jotai/react';
import { useEffect } from 'react';
import { getCurrencyPrices } from '@sdk/polkasafe-sdk/src';
import { currencyAtom } from '@substrate/app/atoms/currency/currencyAtom';

const InitializeCurrency = () => {
	const setAtom = useSetAtom(currencyAtom);

	useEffect(() => {
		const handleCurrency = async () => {
			const currencies = await getCurrencyPrices();
			setAtom(currencies.data);
		};
		handleCurrency();
	}, []);

	return null;
};

export default InitializeCurrency;
