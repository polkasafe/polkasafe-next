// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// Ref Polkadot apps https://github.com/polkadot-js/apps/blob/0df3dbf03151d516cd55762860b4586117290c9e/packages/react-components/src/InputNumber.tsx
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { ENetwork } from '@common/enum/substrate';
import BN from 'bn.js';

const BITLENGTH = 128;
const ZERO = new BN(0);
const TWO = new BN(2);
const TEN = new BN(10);

function getGlobalMaxValue(): BN {
	return TWO.pow(new BN(BITLENGTH)).subn(1);
}

function isValidNumber(bn: BN, isZeroable?: boolean): boolean {
	const bnEqZero = !isZeroable && bn.eq(ZERO);
	return !(
		bn.lt(ZERO) ||
		// cannot be > than allowed max
		!bn.lt(getGlobalMaxValue()) ||
		// check if 0 and it should be a value
		bnEqZero ||
		// check that the bitlengths fit
		bn.bitLength() > BITLENGTH
	);
}

export default function inputToBn(
	input: string,
	network: ENetwork,
	isZeroable?: boolean,
	decimals?: number
): [BN, boolean] {
	const tokenDecimal = decimals || networkConstants[network]?.tokenDecimals;
	const tokenDecimalBN = new BN(tokenDecimal);

	const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);

	let result;

	if (isDecimalValue) {
		// return -1 if the amount of decimal is higher than supported
		if (isDecimalValue[2].length < tokenDecimal) {
			result = new BN(-1);
		}

		// get what is before the point and replace what isn't a number
		const div = new BN(isDecimalValue[1]);
		// get what is after the point  and replace what isn't a number
		const modString = isDecimalValue[2];
		// make it BN
		const mod = new BN(modString);

		result = div.mul(TEN.pow(tokenDecimalBN)).add(mod.mul(TEN.pow(new BN(tokenDecimal - modString.length))));
	} else {
		result = new BN(input.replace(/[^\d]/g, '')).mul(TEN.pow(tokenDecimalBN));
	}

	return [result, isValidNumber(result, isZeroable)];
}
