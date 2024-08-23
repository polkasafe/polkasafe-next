// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { atom } from 'jotai';
import { IMultisigAssets } from '@common/types/substrate';

export const assetsAtom = atom<IMultisigAssets[] | null>(null);
