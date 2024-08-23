// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { ICurrency } from '@common/types/substrate';
import { atom } from 'jotai';
import { currencies } from '@common/constants/currencyConstants';

export const currencyAtom = atom<ICurrency | null>(null);
const preferCurrency =
	window === undefined
		? currencies.UNITED_STATES_DOLLAR
		: localStorage.getItem('currency') || currencies.UNITED_STATES_DOLLAR;
export const selectedCurrencyAtom = atom<string>(preferCurrency);
