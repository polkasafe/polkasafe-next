// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { useEffect } from 'react';
import { useAssets } from '@substrate/app/atoms/assets/assetsAtom';
import { useAssetsQuery } from '@substrate/app/global/hooks/queryHooks/useAssetsQuery';

function InitializeAssets() {
	const [, setAssets] = useAssets();
	const { data, isSuccess, refetch } = useAssetsQuery();

	useEffect(() => {
		if (isSuccess && data) {
			setAssets({
				assets: data,
				refetch: () => refetch()
			});
		}
	}, [data]);

	return null;
}

export default InitializeAssets;
