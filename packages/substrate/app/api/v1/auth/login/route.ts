// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { withErrorHandling } from '@substrate/app/api/api-utils';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { INotificationPreferences, IOrganisation, IUser, IUserResponse } from '@common/types/substrate';
import { ECHANNEL, EUserType } from '@common/enum/substrate';
import { ResponseMessages } from '@common/constants/responseMessage';
import { isValidRequest } from '@common/utils/isValidRequest';
import { ORGANISATION_COLLECTION, USER_COLLECTION } from '@common/db/collections';

const getOrganisations = async (address: string) => {
	const organisations = await ORGANISATION_COLLECTION.where('members', 'array-contains', address).get();
	return organisations.docs.map((doc: any) => {
		const data = doc.data();
		return {
			name: data.name,
			id: doc.id,
			image: data.imageUri,
			members: [...new Set(...[data.members])]
		} as IOrganisation;
	});
};

export const POST = withErrorHandling(async (req: NextRequest) => {
	const { headers } = req;
	const address = headers.get('x-address');
	const signature = headers.get('x-signature');
	try {
		// check if address is valid
		const substrateAddress = getSubstrateAddress(String(address));
		if (!substrateAddress) {
			return NextResponse.json({ error: ResponseMessages.INVALID_ADDRESS });
		}

		// check if signature is valid
		const { isValid, error } = await isValidRequest(substrateAddress, signature);
		if (!isValid) return NextResponse.json({ error }, { status: 400 });

		const cookie = cookies();

		// default notification preferences
		const DEFAULT_NOTIFICATION_PREFERENCES: INotificationPreferences = {
			channelPreferences: {
				[ECHANNEL.IN_APP]: {
					name: ECHANNEL.IN_APP,
					enabled: true,
					handle: String(address || ''),
					verified: true
				}
			},
			triggerPreferences: {}
		};

		const userRef = USER_COLLECTION.doc(String(substrateAddress));
		const doc = await userRef.get();

		// check if address doc already exists
		if (doc.exists) {
			const data = doc.data();
			if (data && data.created_at) {
				const organisations = await getOrganisations(substrateAddress);
				const resUser: IUserResponse = {
					address: data?.address || substrateAddress,
					organisations: organisations || null,
					type: EUserType.SUBSTRATE,
					signature: signature as string
				};

				if (!data.notification_preferences) {
					doc.ref.update({
						notification_preferences: DEFAULT_NOTIFICATION_PREFERENCES
					});
				}

				cookie.set('user', JSON.stringify(resUser));
				return NextResponse.json({ data: resUser }, { status: 200 });
			}
		}

		// else create a new user document
		const newUser: IUser = {
			userId: substrateAddress,
			address: [String(substrateAddress)],
			created_at: new Date(),
			email: null,
			notification_preferences: DEFAULT_NOTIFICATION_PREFERENCES,
			// multisigSettings: generateMultisigSettings(), // todo: update this
			multisigAddresses: [],
			type: EUserType.SUBSTRATE
		};
		const newUserResponse: IUserResponse = {
			address: substrateAddress,
			organisations: [],
			type: EUserType.SUBSTRATE,
			signature: signature as string
		};

		await USER_COLLECTION.doc(substrateAddress).set(newUser, { merge: true });

		cookie.set('user', JSON.stringify(newUserResponse));

		return NextResponse.json({ data: newUserResponse }, { status: 200 });
	} catch (err: unknown) {
		console.error(err);
		return NextResponse.json({ error: ResponseMessages.INTERNAL }, { status: 500 });
	}
});
