import { ECreateOrganisationSteps } from '@common/enum/substrate';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import React from 'react';

interface ICreateOrganisationActionButtons {
	step: ECreateOrganisationSteps;
	loading: boolean;
	onStepUpdate: (newStep: ECreateOrganisationSteps) => void;
}

export const CreateOrganisationActionButtons = ({ step, loading, onStepUpdate }: ICreateOrganisationActionButtons) => {
	return (
		<div className='flex justify-between'>
			<Button
				htmlType='submit'
				variant={EButtonVariant.PRIMARY}
				className='bg-primary border-primary text-sm'
				disabled={step === ECreateOrganisationSteps.ORGANISATION_DETAILS}
				fullWidth
				loading={Boolean(loading)}
			>
				Cancel
			</Button>
			<Button
				htmlType='submit'
				variant={EButtonVariant.PRIMARY}
				className='bg-primary border-primary text-sm'
				fullWidth
				loading={Boolean(loading)}
				onClick={() => onStepUpdate(ECreateOrganisationSteps.ADD_MULTISIG)}
			>
				Next
			</Button>
		</div>
	);
};
