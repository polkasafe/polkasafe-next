import { request } from '../utils/request';

type Props = {
	signatories: Array<string>;
	threshold: number;
	multisigName: string;
	network: string;
	proxy?: string;
};

export function createMultisig({ signatories, threshold, multisigName, network }: Props) {
	if (!signatories || !signatories.length) {
		throw new Error('You should have at least one signatories');
	}
	if (!threshold) {
		throw new Error('threshold is required');
	}
	if (threshold > signatories.length + 1) {
		throw new Error('threshold can not be grater than total signatories');
	}
	if (!multisigName) {
		throw new Error('multisig name is required');
	}

	const body = JSON.stringify({
		multisigName,
		signatories,
		network,
		threshold
	});
	return request('/createMultisig', {}, { method: 'POST', body });
}
