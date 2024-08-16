// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IProxy } from '@substrate/app/global/types';
import React from 'react';

interface IOverviewCardProps {
	name: string;
	address: string;
	threshold: number;
	signatories: Array<string>;
	balance: string;
	network: string;
	createdAt: Date;
	updatedAt: Date;
	proxy: Array<IProxy>;
}

function OverviewCard({
	address,
	name,
	threshold,
	signatories,
	balance,
	network,
	createdAt,
	updatedAt,
	proxy
}: IOverviewCardProps) {
	return (
		<div>
			<div>Address: {address}</div>
			<div>name: {name}</div>
			<div>threshold: {threshold}</div>
			<div>
				signatories:{' '}
				{signatories.map((address) => (
					<p>{address}</p>
				))}
			</div>
			<div>balance: {balance}</div>
			<div>network: {network}</div>
			<div>createdAt: {createdAt?.toLocaleString() || ''}</div>
			<div>updatedAt: {updatedAt?.toLocaleString() || ''}</div>
			<div>proxy: {proxy.map((px) => px.address)}</div>
		</div>
	);
}

export default OverviewCard;
