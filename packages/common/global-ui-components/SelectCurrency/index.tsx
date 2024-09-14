'use client';

import { Dropdown } from 'antd';
import { twMerge } from 'tailwind-merge';
import { currencies, currencyProperties, getCurrenciesBySymbol } from '@common/constants/currencyConstants';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { selectedCurrencyAtom } from '@substrate/app/atoms/currency/currencyAtom';
import { CircleArrowDownIcon } from '@common/global-ui-components/Icons';
import { ItemType } from 'antd/es/menu/interface';

export const CurrencyFlag = ({ src, className }: { src: string; className?: string }) => {
	return (
		<Image
			className={twMerge('block rounded-sm', className)}
			height={10}
			width={20}
			src={src}
			alt='Currency Flag'
		/>
	);
};

interface ISelectCurrencyProps {
	transparent?: boolean;
	classNames?: string;
}

function SelectCurrency({ transparent, classNames }: ISelectCurrencyProps) {
	const [currency, setCurrency] = useAtom(selectedCurrencyAtom);

	const currencyOptions: ItemType[] = Object.values(currencies).map((c) => ({
		key: c,
		label: (
			<span className='text-white flex items-center gap-x-2'>
				<CurrencyFlag src={currencyProperties[c]?.logo} />
				{transparent ? currencyProperties[c].symbol : `${c} (${currencyProperties[c].symbol})`}
			</span>
		)
	}));

	const onCurrencyChange = (e: any) => {
		setCurrency(currencyProperties[e.key].symbol);
		if (typeof window !== 'undefined') {
			localStorage.setItem('currency', currencyProperties[e.key].symbol);
		}
	};

	return (
		<Dropdown
			trigger={['click']}
			className={twMerge(
				'cursor-pointer',
				transparent && 'bg-transparent',
				!transparent && 'border border-primary rounded-lg p-2.5 bg-bg-secondary',
				classNames
			)}
			menu={{
				items: currencyOptions,
				onClick: onCurrencyChange
			}}
		>
			<div
				className={twMerge(
					'flex justify-between gap-x-4 items-center',
					transparent && 'text-primary',
					!transparent && 'text-white'
				)}
			>
				<span className='flex items-center gap-x-2'>
					<CurrencyFlag src={currencyProperties[getCurrenciesBySymbol(currency)]?.logo} />
					{transparent
						? currencyProperties[getCurrenciesBySymbol(currency)]?.symbol
						: `${currency} (${currencyProperties[getCurrenciesBySymbol(currency)]?.symbol})`}
				</span>
				<CircleArrowDownIcon className='text-primary' />
			</div>
		</Dropdown>
	);
}

export default SelectCurrency;
