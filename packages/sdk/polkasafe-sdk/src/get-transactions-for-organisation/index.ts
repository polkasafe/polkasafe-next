import { IGetOrganisationTransactionProps } from '../types';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/pagination';
import { request } from '../utils/request';

export function getTransactionsForOrganisation({
	multisigs,
	page = DEFAULT_PAGE,
	limit = DEFAULT_PAGE_SIZE
}: IGetOrganisationTransactionProps) {
	if (!multisigs) {
		throw new Error('Multisig address is required');
	}
	if (!Number(page)) {
		throw new Error('Invalid request please check you params');
	}
	if (!Number(limit)) {
		throw new Error('Invalid request please check you params');
	}
	const body = JSON.stringify({
		multisigs,
		page,
		limit
	});

	return request('/getTransactionForOrg_test', {}, { method: 'POST', body });
}
