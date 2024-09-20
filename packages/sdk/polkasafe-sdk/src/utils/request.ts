import fetchPonyfill from 'fetch-ponyfill';
import { NEXT_PUBLIC_DEPLOYMENT } from '@common/envs';
import { EDevelopment } from '@common/enum/sdk';

const { fetch: fetchPF } = fetchPonyfill();

export function request<T>(endpoint: string, reqHeaders?: any, options?: RequestInit): Promise<T> {
	const baseUrl =
		NEXT_PUBLIC_DEPLOYMENT === EDevelopment.LOCAL
			? 'http://localhost:3000/api/v1'
			: 'https://polkasafe-a8042.web.app/api/v1';

	console.log('baseUrl', baseUrl);
	const url = `${baseUrl}${endpoint}`;
	const headers = {
		Accept: 'application/json',
		// eslint-disable-next-line @typescript-eslint/naming-convention
		'Content-Type': 'application/json',
		...reqHeaders
	};
	const config = {
		...options,
		headers
	};
	return fetchPF(url, config)
		.then((response) => {
			return response.json();
		})
		.catch((error) => {
			console.log('error', error);
			throw new Error(error.message);
		});
}
