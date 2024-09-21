// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import AssetsCard from '@common/global-ui-components/AssetsCard';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
import { useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Skeleton } from 'antd';

function AssetsOverview() {
	const assets = useAtomValue(assetsAtom);
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}
	if (!assets) {
		return (
			<Skeleton.Button
				size='large'
				active
			/>
		);
	}

	return <AssetsCard assets={assets} />;
}

export default AssetsOverview;
