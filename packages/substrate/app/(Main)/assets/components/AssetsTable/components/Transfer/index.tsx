// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { ENetwork } from '@common/enum/substrate';
import NewTransaction from '@common/modals/NewTransaction';
import { SendTransaction } from '@substrate/app/(Main)/components/SendTransaction';

export function TransferByMultisig({
	address,
	network,
	proxyAddress
}: {
	address: string;
	network?: ENetwork;
	proxyAddress: string;
}) {
	return (
		<SendTransaction
			address={address}
			network={network}
			proxyAddress={proxyAddress}
		>
			<NewTransaction
				label='Send'
				className='w-auto min-w-0 px-3 py-2'
				icon={false}
				size='small'
			/>
		</SendTransaction>
	);
}
