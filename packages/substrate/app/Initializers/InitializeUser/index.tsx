// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { IOrganisation } from '@common/types/substrate';
import { userAtom } from '@substrate/app/atoms/auth/authAtoms';
import { useHydrateAtoms } from 'jotai/utils';

interface IInitializeUserProps {
	userAddress: string;
	signature: string;
	organisations: Array<IOrganisation>;
}

function InitializeUser({ userAddress, signature, organisations }: IInitializeUserProps) {
	useHydrateAtoms([[userAtom, { address: userAddress, signature, organisations }]]);
	return null;
}

export default InitializeUser;
