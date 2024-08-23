// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import DashboardCard from '@common/global-ui-components/DashboardCard';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
import { useAtomValue } from 'jotai';

export function DashboardOverview() {
	const assets = useAtomValue(assetsAtom);
	return <DashboardCard assets={assets} />;
}
