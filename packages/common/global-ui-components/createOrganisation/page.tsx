'use client';

import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { ECreateOrganisationSteps } from '@common/enum/substrate';
import { AddMultisigsToOrganisation } from '@common/global-ui-components/createOrganisation/components/AddMultisig';
import { OrganisationDetailForm } from '@common/global-ui-components/createOrganisation/components/OrganisationForm';
import { ReviewOrganisation } from '@common/global-ui-components/createOrganisation/components/ReviewOrganisation';

export const CreateOrganisation = () => {
	const { step } = useOrganisationContext();
	return step === ECreateOrganisationSteps.ORGANISATION_DETAILS ? (
		<OrganisationDetailForm />
	) : step === ECreateOrganisationSteps.ADD_MULTISIG ? (
		<AddMultisigsToOrganisation />
	) : step === ECreateOrganisationSteps.REVIEW ? (
		<ReviewOrganisation />
	) : null;
};
