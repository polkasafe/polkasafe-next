// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Identicon from '@polkadot/react-identicon';
import { twMerge } from 'tailwind-merge';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { CopyIcon } from '@common/global-ui-components/Icons';
import shortenAddress from '../../utils/shortenAddress';

interface IAddressProps {
	address: string;
	className?: string;
	disableAddress?: boolean;
	disableIdenticon?: boolean;
	disableExtensionName?: string;
	displayInline?: boolean;
	extensionName?: string;
	identiconSize?: number;
	shortenAddressLength?: number;
	copyIcon?: boolean;
}

const styles = {
	container: 'flex items-center gap-x-3',
	textContainer: 'flex flex-col text-xs font-normal leading-13px justify-center',
	textActive: 'text-white',
	textDisabled: 'text-text-secondary'
};

export const SubstrateAddress: React.FC<IAddressProps> = ({
	address,
	className,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	displayInline,
	disableIdenticon = false,
	disableAddress,
	disableExtensionName,
	extensionName,
	identiconSize = 30,
	shortenAddressLength,
	copyIcon
}: IAddressProps) => {
	return (
		<div className={twMerge(styles.container, className)}>
			{!disableIdenticon && (
				<Identicon
					className='image identicon'
					value={getSubstrateAddress(address)}
					size={identiconSize}
					theme='substrate'
				/>
			)}
			<p className={styles.textContainer}>
				{!disableExtensionName ? <span className={styles.textActive}>{extensionName}</span> : null}
				<span>
					{!disableAddress ? (
						<span className={styles.textDisabled}>{shortenAddress(address, shortenAddressLength)}</span>
					) : null}
					{copyIcon && <CopyIcon className='ml-2' />}
				</span>
			</p>
		</div>
	);
};
