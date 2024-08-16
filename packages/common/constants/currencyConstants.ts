// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
/* eslint-disable sort-keys */

import aedLogo from '@common/assets/currency-flags/aed.png';
import audLogo from '@common/assets/currency-flags/aud.png';
import cadLogo from '@common/assets/currency-flags/cad.png';
import chfLogo from '@common/assets/currency-flags/chf.png';
import eurLogo from '@common/assets/currency-flags/eur.png';
import gbpLogo from '@common/assets/currency-flags/gbp.png';
import inrLogo from '@common/assets/currency-flags/inr.png';
import jpyLogo from '@common/assets/currency-flags/jpy.png';
import usdLogo from '@common/assets/currency-flags/usd.png';

export type Currency = (typeof currencies)[keyof typeof currencies];
export type CurrencySymbol = (typeof currencySymbol)[keyof typeof currencySymbol];

export interface CurrencyProps {
	logo?: any;
	symbol: CurrencySymbol;
}

export type CurrencyPropType = {
	[index: string]: CurrencyProps;
};

export const currencies = {
	UNITED_STATES_DOLLAR: 'United States Dollar',
	BRITISH_POUND: 'British Pound',
	EURO: 'Euro',
	SWISS_FRANC: 'Swiss Franc',
	UNITED_ARAB_EMIRATES_DIRHAM: 'United Arab Emirates Dirham',
	JAPANESE_YEN: 'Japanese Yen',
	AUSTRALIAN_DOLLAR: 'Australian Dollar',
	CANADIAN_DOLLAR: 'Canadian Dollar',
	INDIAN_RUPEE: 'Indian Rupee'
};

export const currencySymbol = {
	USD: 'USD',
	GBP: 'GBP',
	EUR: 'EUR',
	CHF: 'CHF',
	AED: 'AED',
	JPY: 'JPY',
	AUD: 'AUD',
	CAD: 'CAD',
	INR: 'INR'
};

export const getCurrenciesBySymbol = (symbol: CurrencySymbol) => {
	switch (symbol) {
		case currencySymbol.USD:
			return currencies.UNITED_STATES_DOLLAR;
		case currencySymbol.EUR:
			return currencies.EURO;
		case currencySymbol.GBP:
			return currencies.BRITISH_POUND;
		case currencySymbol.JPY:
			return currencies.JAPANESE_YEN;
		case currencySymbol.INR:
			return currencies.INDIAN_RUPEE;
		case currencySymbol.AUD:
			return currencies.AUSTRALIAN_DOLLAR;
		case currencySymbol.CAD:
			return currencies.CANADIAN_DOLLAR;
		case currencySymbol.CHF:
			return currencies.SWISS_FRANC;
		case currencySymbol.AED:
			return currencies.UNITED_ARAB_EMIRATES_DIRHAM;
		default:
			return currencies.UNITED_STATES_DOLLAR;
	}
};

export const currencyProperties: CurrencyPropType = {
	[currencies.UNITED_STATES_DOLLAR]: {
		logo: usdLogo,
		symbol: currencySymbol.USD
	},
	[currencies.BRITISH_POUND]: {
		logo: gbpLogo,
		symbol: currencySymbol.GBP
	},
	[currencies.EURO]: {
		logo: eurLogo,
		symbol: currencySymbol.EUR
	},
	[currencies.SWISS_FRANC]: {
		logo: chfLogo,
		symbol: currencySymbol.CHF
	},
	[currencies.UNITED_ARAB_EMIRATES_DIRHAM]: {
		logo: aedLogo,
		symbol: currencySymbol.AED
	},
	[currencies.JAPANESE_YEN]: {
		logo: jpyLogo,
		symbol: currencySymbol.JPY
	},
	[currencies.AUSTRALIAN_DOLLAR]: {
		logo: audLogo,
		symbol: currencySymbol.AUD
	},
	[currencies.CANADIAN_DOLLAR]: {
		logo: cadLogo,
		symbol: currencySymbol.CAD
	},
	[currencies.INDIAN_RUPEE]: {
		logo: inrLogo,
		symbol: currencySymbol.INR
	}
};
