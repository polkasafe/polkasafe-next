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
	fromBalance?: string | BN;
	onChange: (balance: BN) => void;
	placeholder?: string;
	defaultValue?: string;
	multipleCurrency?: boolean;
	requestedAmount?: string;
	network: ENetwork;
	currencyValues: ICurrency;
}

const BalanceInput: React.FC<Props> = ({
	fromBalance,
	className,
	label = '',
	onChange,
	placeholder = '',
	defaultValue,
	multipleCurrency = false,
	requestedAmount,
	network,
	currencyValues
}: Props) => {
	const [isValidInput, setIsValidInput] = useState(true);
	const [balance, setBalance] = useState<string>(defaultValue || '');
	const [bnBalance, setBnBalance] = useState(new BN(0));

	const [amountLessThanReq, setAmountLessThanReq] = useState(false);

	const [currency, setCurrency] = useState<string>(network);

	const tokenCurrencyPrice = !Object.values(ENetwork).includes(currency as any)
		? Number(currencyValues.tokenUsdPrice[network]?.value) *
			(currencyValues.allCurrencyPrices[currencyProperties[currency]?.symbol]?.value || 1)
		: 1;

	useEffect(() => {
		const value = Number(defaultValue);
		if (Number.isNaN(value)) return;
		if (!value || value <= 0) {
			setIsValidInput(false);
			onChange(new BN(0));
			return;
		}

		const [inputBalance, isValid] = inputToBn(
			`${network === 'astar' ? value.toFixed(13) : network === 'alephzero' ? value.toFixed(11) : value}`,
			network,
			false
		);
		setIsValidInput(isValid);

		if (isValid) {
			setBnBalance(inputBalance);
			onChange(inputBalance);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [network]);

	const onBalanceChange = (value: number | string | null): void => {
		const val = Number(value);

		if (!val || val <= 0) {
			setIsValidInput(false);
			onChange(new BN(0));
			return;
		}

		let balanceInput = val;

		if (currency !== network && !['westend', 'rococo'].includes(network) && multipleCurrency) {
			balanceInput = val / tokenCurrencyPrice;
		}

		const [inputBalance, isValid] = inputToBn(`${balanceInput.toFixed(5)}`, network, false);
		setIsValidInput(isValid);

		if (isValid) {
			setBnBalance(inputBalance);
			onChange(inputBalance);
		}

		if (requestedAmount && balanceInput * tokenCurrencyPrice < Number(requestedAmount)) {
			setAmountLessThanReq(true);
			return;
		}
		setAmountLessThanReq(false);
	};

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

	const onCurrencyChange = (e: any) => {
		setCurrency(e.key);
		onBalanceChange('');
		setBalance('');
	};

	return (
		<section className={`${className}`}>
			<label
				htmlFor='balance'
				className='text-label mb-[5px] block text-xs font-normal leading-[13px]'
			>
				{label}
			</label>
			<div className='flex items-center gap-x-[10px]'>
				<article className='w-full'>
					<Form.Item
						className='my-0 border-0 p-0 outline-0'
						name='balance'
						rules={[{ required: true }]}
						validateStatus={
							!isValidInput || (fromBalance && bnBalance?.gte(new BN(fromBalance))) || amountLessThanReq
								? 'error'
								: 'success'
						}
						help={
							!isValidInput
								? 'Please input a valid value'
								: fromBalance && !bnBalance?.isZero() && bnBalance?.gte(new BN(fromBalance))
									? 'Insufficient Balance in Sender Account.'
									: requestedAmount &&
										amountLessThanReq &&
										`Amount less than Requested ($${formatBalance(requestedAmount)})`
						}
						// initialValue={networkConstants[network]?.existentialDeposit}
					>
						<div className='flex h-[50px] items-center'>
							<Input
								id='balance'
								onChange={(a) => {
									onBalanceChange(a.target.value);
									setBalance(a.target.value);
								}}
								placeholder={`${placeholder} ${
									Object.values(ENetwork).includes(currency as any)
										? networkConstants[network]?.tokenSymbol
										: currencyProperties[currency]?.symbol
								}`}
								defaultValue={defaultValue}
								value={balance}
								className='bg-bg-secondary h-full w-full rounded-lg border-0 p-3 pr-20 text-sm font-normal leading-[15px] text-white outline-0 placeholder:text-[#505050]'
							/>
							{!['westend', 'rococo'].includes(network) && multipleCurrency ? (
								<Dropdown
									trigger={['click']}
									className={className}
									menu={{
										items: currencyOptions,
										onClick: onCurrencyChange
									}}
								>
									{Object.values(ENetwork).includes(currency as any) ? (
										<div className='absolute right-0 flex cursor-pointer items-center justify-center gap-x-1 pr-3 text-white'>
											<ParachainTooltipIcon src={networkConstants[network]?.logo} />
											<span>{networkConstants[network]?.tokenSymbol}</span>
											<CircleArrowDownIcon className='text-primary ml-1' />
										</div>
									) : (
										<div className='absolute right-0 flex cursor-pointer items-center justify-center pr-3 text-white'>
											<CurrencyFlag
												className='mr-2'
												src={currencyProperties[currency]?.logo}
											/>
											<span>{currencyProperties[currency]?.symbol}</span>
											<CircleArrowDownIcon className='text-primary ml-1' />
										</div>
									)}
								</Dropdown>
							) : (
								<div className='absolute right-0 flex items-center justify-center gap-x-1 pr-3 text-white'>
									<ParachainTooltipIcon src={networkConstants[network]?.logo} />
									<span>{networkConstants[network]?.tokenSymbol}</span>
								</div>
							)}
						</div>
						{!Object.values(ENetwork).includes(currency as any) && isValidInput && (
							<span className='text-waiting mt-1 flex items-center gap-x-1 text-xs'>
								You send = {formatBnBalance(bnBalance, { numberAfterComma: 3, withUnit: true }, network)}
								<Tooltip
									title={`1 ${networkConstants[network]?.tokenSymbol} = ${tokenCurrencyPrice?.toFixed(
										2
									)} ${currencyProperties[currency]?.symbol}`}
								>
									<WarningCircleIcon className='text-sm' />
								</Tooltip>
							</span>
						)}
					</Form.Item>
				</article>
			</div>
		</section>
	);
};

export default BalanceInput;
