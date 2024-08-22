// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IGenericResponse } from '@common/types/substrate';
import { connect } from '@sdk/polkasafe-sdk/src';

export const connectAddress = async (address: string) => {
	try {
		const data = await connect({ address });
		return { data, error: null } as unknown as IGenericResponse<any>;
	} catch (error) {
		return { data: null, error: error.message || error };
	}
};
