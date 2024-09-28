import { ISearchParams } from '@common/types/substrate';
import React from 'react';

interface IInvoices {
	searchParams: ISearchParams;
}


async function Invoices({ searchParams }: IInvoices) {
	const { _organisation } = searchParams;

	return <div>invoices</div>;
}

export default Invoices;
