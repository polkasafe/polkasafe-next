'use client';

import { useOrgStepsContext } from '@common/context/CreateOrgStepsContext';
import { AddMultisigsToOrganisation } from '@common/global-ui-components/createOrganisation/components/AddMultisig';
import { OrganisationDetailForm } from '@common/global-ui-components/createOrganisation/components/OrganisationForm';
import { ReviewOrganisation } from '@common/global-ui-components/createOrganisation/components/ReviewOrganisation';

export const CreateOrganisation = () => {
	const { step } = useOrgStepsContext();
	return (
		<div className='w-[50%] h-full max-sm:w-full'>
			{step === 0 ? (
				<OrganisationDetailForm />
			) : step === 1 ? (
				<AddMultisigsToOrganisation />
			) : step === 2 ? (
				<ReviewOrganisation />
			) : null}
		</div>
	);
};
