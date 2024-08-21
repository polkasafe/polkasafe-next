// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IGenericResponse } from '@common/types/substrate';
import { login } from '@sdk/polkasafe-sdk/src';

export const clientLogin = async (address: string, signature: string) => {
	const { data, error } = (await login({ address, signature })) as IGenericResponse<any>;
	console.log('clientLogin', data, error);
	return { data, error };
};
