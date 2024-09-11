import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { ECreateOrganisationSteps } from '@common/enum/substrate';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import React from 'react';

interface ICreateOrganisationActionButtons {
	loading: boolean;
}

export const CreateOrganisationActionButtons = ({ loading }: ICreateOrganisationActionButtons) => {
	const { step, setStep, onCreateOrganisation } = useOrganisationContext();
	return (
		<div className='flex justify-between'>
			<Button
				htmlType='submit'
				variant={EButtonVariant.PRIMARY}
				className='bg-primary border-primary text-sm'
				disabled={step === ECreateOrganisationSteps.ORGANISATION_DETAILS}
				fullWidth
				loading={Boolean(loading)}
				onClick={() =>
					setStep(
						step === ECreateOrganisationSteps.REVIEW
							? ECreateOrganisationSteps.ADD_MULTISIG
							: ECreateOrganisationSteps.ORGANISATION_DETAILS
					)
				}
			>
				Cancel
			</Button>
			<Button
				htmlType='submit'
				variant={EButtonVariant.PRIMARY}
				className='bg-primary border-primary text-sm'
				fullWidth
				loading={Boolean(loading)}
				onClick={
					step === ECreateOrganisationSteps.REVIEW
						? onCreateOrganisation
						: () =>
								setStep(
									step === ECreateOrganisationSteps.ORGANISATION_DETAILS
										? ECreateOrganisationSteps.ADD_MULTISIG
										: ECreateOrganisationSteps.REVIEW
								)
				}
			>
				Next
			</Button>
		</div>
	);
};
