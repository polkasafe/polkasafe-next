import { request } from '../utils/request';
import { handleHeaders } from '../utils/handleHeaders';

export function loginToPolkasafe({ address, signature }: { address: string; signature: string }) {
	if (!address) {
		throw new Error('Invalid signature, use setSignature method to set the signature');
	}
	const headers = handleHeaders({ address, signature });
	return request('/auth/login', headers, { method: 'POST' });
}
