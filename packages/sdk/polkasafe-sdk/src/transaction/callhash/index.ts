import { ITxnCategory } from '@common/types/substrate';
import { request } from '../../utils/request';
import { handleHeaders } from '../../utils/handleHeaders';

interface IUpdateTransaction {
	address: string;
	signature: string;
	callhash: string;
	transactionFields: ITxnCategory;
}

export function updateTransaction({ address, signature, callhash, transactionFields }: IUpdateTransaction) {
	if (!address || !signature || !callhash || !transactionFields) {
		throw new Error('Invalid Params');
	}

	const body = JSON.stringify({
		transactionFields
	});
	return request(`/getQueueTransaction/${callhash}`, handleHeaders({ address, signature }), { method: 'POST', body });
}
