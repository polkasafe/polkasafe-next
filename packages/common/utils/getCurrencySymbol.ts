import { currencyProperties, currencySymbol } from '@common/constants/currencyConstants';

export const getCurrencySymbol = (currency: string) => {
	const currencySymbolName = currencyProperties[currency].symbol;
	switch (currencySymbolName) {
		case currencySymbol.USD:
			return '$';
		case currencySymbol.EUR:
			return '€';
		case currencySymbol.GBP:
			return '£';
		case currencySymbol.JPY:
			return '¥';
		case currencySymbol.INR:
			return '₹';
		case currencySymbol.AUD:
			return 'A$';
		case currencySymbol.CAD:
			return 'C$';
		case currencySymbol.CHF:
			return 'CHF';
		case currencySymbol.AED:
			return 'د.إ';
		default:
			return currency;
	}
};
