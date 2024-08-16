// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { login } from '@sdk/polkasafe-sdk/src';

export const userLogin = async (address: string, signature: string) => {
	return login({ address, signature });
};
