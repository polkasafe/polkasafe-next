// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { IOrganisation } from '@common/types/substrate';
import { getMultisigByOrganisation } from '@sdk/polkasafe-sdk/src';
import { userAtom } from '@substrate/app/atoms/auth/authAtoms';
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';

interface IInitializeUserProps {
	userAddress: string;
	signature: string;
	organisations: Array<IOrganisation>;
}

function InitializeUser({ userAddress, signature, organisations }: IInitializeUserProps) {
	const setAtom = useSetAtom(userAtom);

	useEffect(() => {
		if (!organisations || organisations.length === 0) {
			return;
		}
		const handleUser = async () => {
			const orgDetails = (await getMultisigByOrganisation({
				organisations: organisations.map((org) => org.id)
			})) as Array<IOrganisation>;
			setAtom({
				address: userAddress,
				signature,
				organisations: orgDetails || []
			});
		};
		handleUser();
	}, [organisations]);
	return null;
}

export default InitializeUser;
