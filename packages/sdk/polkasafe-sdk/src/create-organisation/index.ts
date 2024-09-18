import { IDBMultisig } from '@common/types/substrate';
import { handleHeaders } from '../utils/handleHeaders';
import { request } from '../utils/request';

type Props = {
	signature: string;
	name: string;
	description: string;
	address: string;
	multisigs: Array<IDBMultisig>;
	organisationAddress?: string;
	city?: string;
	country?: string;
	image?: string;
	postalCode?: string;
	state?: string;
	taxNumber?: string;
};

export function createOrganisation({
	address,
	signature,
	multisigs,
	name,
	description,
	organisationAddress,
	city,
	country,
	image,
	postalCode,
	state,
	taxNumber
}: Props) {
	console.log(
		'createOrganisation',
		address,
		signature,
		multisigs,
		name,
		description,
		organisationAddress,
		city,
		country,
		image,
		postalCode,
		state,
		taxNumber
	);
	if (!name) {
		throw new Error('Invalid address or network');
	}

	const body = JSON.stringify({
		name,
		description,
		multisigs,
		organisationAddress,
		city,
		country,
		image,
		postalCode,
		state,
		taxNumber
	});
	return request('/createOrganisation', { ...handleHeaders({ address, signature }) }, { method: 'POST', body });
}
