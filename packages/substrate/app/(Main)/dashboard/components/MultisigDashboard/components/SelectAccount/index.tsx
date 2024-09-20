// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import Address from '@common/global-ui-components/Address';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { IMultisig } from '@common/types/substrate';
import { Divider } from 'antd';
import React from 'react';

const SelectAccount = ({ className, multisig }: { className?: string; multisig: IMultisig }) => {
	return (
		<div>
			<h2 className='text-base font-bold text-white mb-2'>Select Account</h2>
			<div
				className={`${className} relative bg-bg-main flex flex-col gap-y-3 rounded-lg p-5 shadow-lg h-[17rem] scale-90 w-[111%] origin-top-left`}
			>
				<div>
					<Address
						address={multisig.address}
						network={multisig.network}
						name={multisig.name}
						showNetworkBadge
						isProxy={false}
						isMultisig
						withBadge={false}
					/>
				</div>
				<Divider className='m-1'></Divider>
				<div className='flex-1 flex flex-col gap-y-3 pl-2 overflow-y-auto'>
					{multisig.proxy &&
						multisig.proxy.length > 0 &&
						multisig.proxy.map((item) => (
							<Address
								address={item.address}
								name={item.name}
								network={multisig.network}
								isProxy
							/>
						))}
				</div>
				<div className='w-full'>
					<Button
						variant={EButtonVariant.SECONDARY}
						className='text-sm text-text-label border-none'
						fullWidth
					>
						Create Proxy
					</Button>
				</div>
			</div>
		</div>
	);
};

export default SelectAccount;
