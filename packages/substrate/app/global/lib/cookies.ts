// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IConnectedUser } from '@substrate/app/global/types';
import { cookies } from 'next/headers';

export const getUserFromCookie = () => {
	const stringifyUser = cookies().get('user');
	if (!stringifyUser) return null;
	return JSON.parse(stringifyUser.value) as IConnectedUser;
};
