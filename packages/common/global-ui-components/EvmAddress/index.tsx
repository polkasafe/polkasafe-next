// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Identicon from '@polkadot/react-identicon';
import shortenAddress from '../../utils/shortenAddress';
import { EProjectType } from '../../constants/projectConstants';
import styles from './EvmAddress.module.scss';

interface IAddressProps {
	type: EProjectType;
	address: string;
	className?: string;
	disableAddress?: boolean;
	disableIdenticon?: boolean;
	disableExtensionName?: string;
	displayInline?: boolean;
	extensionName?: string;
	identiconSize?: number;
	shortenAddressLength?: number;
}

export const EvmAddress: React.FC<IAddressProps> = ({
	type,
	address,
	className,
	displayInline,
	disableIdenticon,
	disableAddress,
	disableExtensionName,
	extensionName,
	identiconSize,
	shortenAddressLength
}: IAddressProps) => {
	if (type === EProjectType.SUBSTRATE) {
		return (
			<div className={`${styles.container} ${displayInline ?? styles.inlineFlex} ${className}`}>
				{!disableIdenticon ?? (
					<Identicon
						className='image identicon'
						value={address}
						size={identiconSize || 30}
						theme='polkadot'
					/>
				)}
				<p className={styles.textContainer}>
					{!disableExtensionName ? <span className={styles.textActive}>{extensionName}</span> : null}
					{!disableAddress ? (
						<span className={styles.textDisabled}>{shortenAddress(address, shortenAddressLength)}</span>
					) : null}
				</p>
			</div>
		);
	}
	if (type === EProjectType.EVM) {
		return (
			<div className={`${styles.container} ${displayInline ?? styles.inlineFlex} ${className}`}>
				{/* {!disableIdenticon ? (
          <Identicon
            className={styles.imageIdenticon}
            value={address}
            size={identiconSize || 30}
            theme='polkadot'
          />
        ) : null} */}
				<p className={styles.textContainer}>
					{!disableExtensionName ? <span className={styles.textActive}>{extensionName}</span> : null}
					{!disableAddress ? (
						<span className={styles.textDisabled}>{shortenAddress(address, shortenAddressLength)}</span>
					) : null}
				</p>
			</div>
		);
	}
};
