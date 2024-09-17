// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { IOrganisation } from '@common/types/substrate';
import { getMultisigByOrganisation, getOrganisationsByUser } from '@sdk/polkasafe-sdk/src';
import { userAtom } from '@substrate/app/atoms/auth/authAtoms';
import { useSetAtom } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import { PropsWithChildren, useEffect } from 'react';

interface IInitializeUserProps {
	userAddress: string;
	signature: string;
	organisations: Array<IOrganisation>;
}

function InitializeUser({ userAddress, signature }: IInitializeUserProps) {
	useHydrateAtoms([[userAtom, { address: userAddress, signature, organisations: [] }]]);
	const setAtom = useSetAtom(userAtom);

	useEffect(() => {
		if (!userAddress) {
			return;
		}
		const handleUser = async () => {
			const orgDetails = (await getOrganisationsByUser({
				address: userAddress
			})) as { data: Array<IOrganisation> };
			setAtom({
				address: userAddress,
				signature,
				organisations: orgDetails.data || []
			});
		};
		handleUser();
	}, [userAddress]);

	return null;
}

export default InitializeUser;
