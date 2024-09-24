// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { INotificationPreferences, IOrganisation } from '@common/types/substrate';
import { userAtom, useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useHydrateAtoms } from 'jotai/utils';
import { useEffect } from 'react';
import { notificationPreferences } from '@sdk/polkasafe-sdk/src/notification-preferences';

interface IInitializeUserProps {
	userAddress: string;
	signature: string;
	organisations: Array<IOrganisation>;
}

function InitializeUser({ userAddress, signature, organisations }: IInitializeUserProps) {
	useHydrateAtoms([[userAtom, { address: userAddress, signature, organisations: organisations }]]);
	const [user, setUser] = useUser();
	useEffect(() => {
		if (!user || user.notificationPreferences) {
			return;
		}
		const getNotificationPreferences = async () => {
			const { data } = (await notificationPreferences({ address: userAddress, signature })) as {
				data: INotificationPreferences;
			};
			setUser({ ...user, notificationPreferences: data });
			console.log('Notification Preferences:', data);
		};
		getNotificationPreferences();
	}, [user]);
	console.log('User:', user);
	return null;
}

export default InitializeUser;
