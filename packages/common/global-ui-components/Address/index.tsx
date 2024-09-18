// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { ENetwork } from '@common/enum/substrate';
import { CopyIcon, ExternalLinkIcon } from '@common/global-ui-components/Icons';
import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import copyText from '@common/utils/copyText';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import shortenAddress from '@common/utils/shortenAddress';
import Identicon from '@polkadot/react-identicon';
import { Badge } from 'antd';

interface IAddressComponent {
	address: string;
	iconSize?: number;
	withBadge?: boolean;
	name?: string;
	onlyAddress?: boolean;
	isMultisig?: boolean;
	isProxy?: boolean;
	signatories?: number;
	threshold?: number;
	network?: ENetwork;
	showNetworkBadge?: boolean;
	addressLength?: number;
	fullAddress?: boolean;
	withEmail?: boolean;
	email?: string;
}

const Address: React.FC<IAddressComponent> = ({
	address,
	name,
	withBadge = true,
	iconSize = 28,
	onlyAddress,
	isMultisig,
	isProxy,
	signatories,
	threshold,
	network = ENetwork.ROCOCO,
	addressLength,
	fullAddress,
	withEmail,
	showNetworkBadge,
	email // eslint-disable-next-line sonarjs/cognitive-complexity
}: IAddressComponent) => {
	const encodedMultisigAddress = getEncodedAddress(address, network);

	return (
		<div className=' flex items-center gap-x-3'>
			{isProxy ? (
				<Identicon
					className='rounded-full border-2 border-primary bg-transparent p-1'
					value={address}
					size={iconSize}
					theme='polkadot'
				/>
			) : isMultisig ? (
				withBadge ? (
					<Badge
						count='Multisig'
						offset={[-45, 0]}
						className='border-none'
						color='#1573FE'
					>
						<Identicon
							className='border-primary rounded-full border-2 bg-transparent p-1'
							value={address}
							size={iconSize}
							theme='polkadot'
						/>
					</Badge>
				) : (
					<div className='border-2 border-primary p-1 rounded-full flex justify-center items-center relative'>
						<Identicon
							value={address}
							size={iconSize}
							theme='polkadot'
						/>
						{!!threshold && !!signatories && (
							<div className=' bg-primary text-white text-xs rounded-md absolute bottom-0 px-2'>
								{threshold}/{signatories}
							</div>
						)}
					</div>
				)
			) : (
				<Identicon
					value={address}
					size={iconSize}
					theme='polkadot'
				/>
			)}
			{onlyAddress ? (
				<div className='text-text-secondary flex items-center gap-x-3 text-sm font-normal'>
					<span className='text-white'>{name || shortenAddress(address || '', addressLength || 10)}</span>
					<span className='flex items-center gap-x-2 max-sm:gap-0'>
						<button onClick={() => copyText(address, true, network)}>
							<CopyIcon className='hover:text-primary' />
						</button>
						<a
							href={`https://${network || 'polkadot'}.subscan.io/account/${encodedMultisigAddress}`}
							target='_blank'
							rel='noreferrer'
						>
							<ExternalLinkIcon />
						</a>
					</span>
				</div>
			) : (
				<div>
					<div className='font-medium text-sm flex items-center gap-x-3 text-white max-sm:text-xs'>
						{name || DEFAULT_ADDRESS_NAME}
						{network && showNetworkBadge && (
							<div
								style={{ backgroundColor: '#5065E4', fontSize: '9px' }}
								className='rounded-[4px] py-[0px] px-1 text-white flex items-center gap-x-1 bg-network_badge capitalize'
							>
								<ParachainTooltipIcon
									size={6}
									src={networkConstants[network]?.logo}
								/>
								{network}
							</div>
						)}
						{isProxy && withBadge && (
							<div className='rounded-lg py-0 px-[6px] text-highlight flex items-center justify-center bg-proxy-pink text-[10px] font-semibold'>
								Proxy
							</div>
						)}
					</div>
					<div className='text-text-secondary flex items-center gap-x-3 text-xs font-normal max-sm:text-[8px]'>
						<span>
							{fullAddress ? encodedMultisigAddress : shortenAddress(encodedMultisigAddress || '', addressLength)}
						</span>
						<span className='flex items-center gap-x-2'>
							<button onClick={() => copyText(address, true, network)}>
								<CopyIcon className='hover:text-primary' />
							</button>
							<a
								href={`https://${network || 'polkadot'}.subscan.io/account/${encodedMultisigAddress}`}
								target='_blank'
								rel='noreferrer'
							>
								<ExternalLinkIcon />
							</a>
						</span>
						{withEmail && email && (
							<div>
								<span className='text-xs text-text-secondary'>{email}</span>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
};

export default Address;
