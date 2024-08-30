import axios from 'axios';
import { SUBSCAN_API_HEADERS } from '../utils/constants/subscan_consts';

export const getAllMultisigByAddress = async (address: string, network: string) => {
	const { data } = await axios.post(
		`https://${network}.api.subscan.io/api/v2/scan/search`,
		{
			row: 1,
			key: address
		},
		{
			headers: SUBSCAN_API_HEADERS
		}
	);
	if (data.message === 'Record Not Found') {
		return { status: 200, message: data.message, data: [] };
	}

	const multisigAccounts = data?.data?.account?.multisig?.multi_account;
	if (multisigAccounts) {
		return { status: 200, message: 'success', data: multisigAccounts };
	}
	return { status: 400, error: data };
};
