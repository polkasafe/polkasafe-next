import { MULTISIG_COLLECTION } from '@common/db/collections';

export const dbProxyData = async (multisigId: string) => {
	const multisig = await MULTISIG_COLLECTION.doc(String(multisigId)).get();
	if (!multisig.exists) {
		return null;
	}
	return multisig.data()?.proxy;
};
