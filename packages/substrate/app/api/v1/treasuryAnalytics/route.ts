import { ResponseMessages } from '@common/constants/responseMessage';
import { ORGANISATION_COLLECTION } from '@common/db/collections';
import { ETxnType, ITreasury, ITreasuryTxns } from '@common/enum/substrate';
import { ITransactionFields } from '@common/types/substrate';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { isValidRequest } from '@common/utils/isValidRequest';
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { onChainTreasuryData } from '@substrate/app/api/api-utils/onChainTreasuryData';
import { SUBSCAN_API_HEADERS } from '@substrate/app/api/constants/subscane';
import axios from 'axios';
import dayjs from 'dayjs';
import { NextRequest, NextResponse } from 'next/server';

export const POST = withErrorHandling(async (req: NextRequest) => {
	try {
		const { headers } = req;
		const address = headers.get('x-address');
		const signature = headers.get('x-signature');

		const substrateAddress = getSubstrateAddress(String(address));
		if (!substrateAddress) {
			return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS });
		}

		const { isValid, error } = await isValidRequest(substrateAddress, signature);
		if (!isValid) return NextResponse.json({ error }, { status: 400 });
		const { multisigs, organisationId } = await req.json();
		if (!multisigs || !organisationId) {
			return NextResponse.json({ error: ResponseMessages.MISSING_PARAMS }, { status: 400 });
		}

		const orgTreasury = await onChainTreasuryData({ multisigs, organisationId });

		return NextResponse.json({ data: orgTreasury }, { status: 200 });
	} catch (err) {
		console.log('Error in getAssets:', err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
