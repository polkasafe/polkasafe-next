import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { useOrgStepsContext } from '@common/context/CreateOrgStepsContext';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { ArrowLeftCircle, ArrowRightCircle } from '@common/global-ui-components/Icons';
import React from 'react';

interface ICreateOrganisationActionButtons {
	loading: boolean;
}

export const CreateOrganisationActionButtons = ({ loading }: ICreateOrganisationActionButtons) => {
	const { onCreateOrganisation } = useOrganisationContext();
	const { step, setStep } = useOrgStepsContext();
	return (
		<div className='flex w-full justify-between mt-5'>
			<Button
				variant={EButtonVariant.DANGER}
				disabled={step === 0 || loading}
				fullWidth
				loading={loading}
				onClick={() => setStep(step === 2 ? 1 : 0)}
				icon={<ArrowLeftCircle className='text-sm' />}
				size='large'
			>
				Back
			</Button>
			<Button
				htmlType='submit'
				// disabled={
				// 	(step === 0 && !orgName) ||
				// 	(step === 1 && linkedMultisigs.length === 0) ||
				// 	(step === 2 && (!orgName || linkedMultisigs.length === 0))
				// }
				variant={EButtonVariant.PRIMARY}
				fullWidth
				loading={Boolean(loading)}
				onClick={step === 2 ? onCreateOrganisation : () => setStep(step === 0 ? 1 : 2)}
				size='large'
			>
				{step === 2 ? 'Confirm' : 'Next'}
				{step !== 2 && <ArrowRightCircle className='text-sm' />}
			</Button>
		</div>
	);
};
