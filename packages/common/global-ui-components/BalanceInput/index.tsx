// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { Form, Input } from 'antd';
import BN from 'bn.js';
import { networkConstants } from '@common/constants/substrateNetworkConstant';

import { ENetwork } from '@common/enum/substrate';
import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import inputToBn from '@common/utils/inputToBn';

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
