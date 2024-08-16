// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { nextApiClientFetch } from '@substrate/app/global/next-api-fetch';
import { IGenericResponse } from '@substrate/app/global/types';

export const clientLogin = async (address: string, signature: string) => {
	const { data, error } = (await nextApiClientFetch({
		url: '/api/v1/userLogin',
		method: 'POST',
		headers: {
			'x-address': address,
			'x-signature': signature
		}
	})) as IGenericResponse<any>;

	return { data, error };
};
