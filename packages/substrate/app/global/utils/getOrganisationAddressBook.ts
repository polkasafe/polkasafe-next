import { IOrganisation } from '@common/types/substrate';
import React from 'react';

export const getOrganisationAddressBook = (organisation: IOrganisation) => {
	const addressBook = organisation?.addressBook;
	return addressBook;
};
