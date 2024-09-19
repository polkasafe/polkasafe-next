// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Dropdown, Form, Input, Tooltip } from 'antd';
import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { currencies, currencyProperties } from '@common/constants/currencyConstants';
import { networkConstants } from '@common/constants/substrateNetworkConstant';

import { ItemType } from 'antd/es/menu/interface';
import { ENetwork } from '@common/enum/substrate';
import { CircleArrowDownIcon, WarningCircleIcon } from '@common/global-ui-components/Icons';
import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import { CurrencyFlag } from '@common/global-ui-components/SelectCurrency';
import formatBnBalance from '@common/utils/formatBnBalance';
import inputToBn from '@common/utils/inputToBn';
import { ICurrency } from '@common/types/substrate';

function formatBalance(amount: number | string) {
	return Number(amount)
		.toFixed(2)
		.replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

interface Props {
	className?: string;
	label?: string;
	onChange: (balance: BN) => void;
	placeholder?: string;
	defaultValue?: string;
	network: ENetwork;
	formName?: string;
	required?: boolean;
}

const BalanceInput: React.FC<Props> = ({
	className,
	label = '',
	onChange,
	placeholder = '',
	defaultValue,
	network,
	formName,
	required = true
}: Props) => {
	// useEffect(() => {
	// setCurrency(network);
	// setBalance(defaultValue || '');
	// }, [defaultValue, network]);

	// const tokenCurrencyPrice = !Object.values(ENetwork).includes(currency as any)
	// 	? Number(currencyValues.tokenUsdPrice[network]?.value) *
	// 		(currencyValues.allCurrencyPrices[currencyProperties[currency]?.symbol]?.value || 1)
	// 	: 1;

	// useEffect(() => {
	// 	const value = Number(defaultValue);
	// 	if (Number.isNaN(value)) return;
	// 	if (!value || value <= 0) {
	// 		setIsValidInput(false);
	// 		onChange(new BN(0));
	// 		return;
	// 	}

	// 	const [inputBalance, isValid] = inputToBn(
	// 		`${network === 'astar' ? value.toFixed(13) : network === 'alephzero' ? value.toFixed(11) : value}`,
	// 		network,
	// 		false
	// 	);
	// 	setIsValidInput(isValid);

	// 	if (isValid) {
	// 		setBnBalance(inputBalance);
	// 		onChange(inputBalance);
	// 	}
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [network]);

	const currencyOptions: ItemType[] = [
		{
			key: network,
			label: (
				<span className='flex items-center gap-x-2 text-white'>
					<ParachainTooltipIcon src={networkConstants[network]?.logo} />
					{networkConstants[network]?.tokenSymbol}
				</span>
			) as any
		}
	];

	Object.values(currencies).forEach((c) => {
		currencyOptions.push({
			key: c,
			label: (
				<span className='flex items-center gap-x-2 text-white'>
					<CurrencyFlag src={currencyProperties[c]?.logo} />
					{c} ({currencyProperties[c]?.symbol})
				</span>
			) as any
		});
	});

	return (
		<section className={`${className}`}>
			<label
				htmlFor='balance'
				className='text-label mb-[5px] block text-xs font-normal leading-[13px]'
			>
				{label}
			</label>
			<div className='flex items-center gap-x-[10px] relative'>
				<article className='w-full'>
					<Form.Item
						name={formName || 'balance'}
						rules={[
							{ required, message: 'Enter a valid amount' },
							() => ({
								validator(_, value) {
									if (Number.isNaN(Number(value))) {
										return Promise.reject(new Error('Enter a valid number'));
									}
									if (value) {
										const [, isValid] = inputToBn(value, network, false);
										if (!isValid) {
											return Promise.reject(new Error('Enter a valid amount'));
										}
									}
									return Promise.resolve();
								}
							})
						]}
						rootClassName='mb-3'
					>
						<div className='flex h-[50px] items-center'>
							<Input
								id='balance'
								onChange={(a) => {
									const [balance, isValid] = inputToBn(a.target.value, network, false);
									if (isValid) {
										onChange(balance);
									}
								}}
								placeholder={`${placeholder} ${networkConstants[network]?.tokenSymbol}`}
								defaultValue={defaultValue}
								className='bg-bg-secondary h-full w-full rounded-lg border-0 p-3 pr-20 text-sm font-normal leading-[15px] text-white outline-0 placeholder:text-[#505050]'
							/>
							<div className='absolute right-0 flex items-center justify-center gap-x-1 pr-3 text-white'>
								<ParachainTooltipIcon src={networkConstants[network]?.logo} />
								<span>{networkConstants[network]?.tokenSymbol}</span>
							</div>
						</div>
					</Form.Item>
				</article>
			</div>
		</section>
	);
};

export default BalanceInput;
