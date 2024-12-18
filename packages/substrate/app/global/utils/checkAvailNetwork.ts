// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ENetwork } from '@common/enum/substrate';

export const checkAvailNetwork = (network: ENetwork) => {
	return [ENetwork.AVAIL].includes(network);
};
