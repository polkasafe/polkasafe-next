import { useOrgStepsContext } from '@common/context/CreateOrgStepsContext';
import { ECreateOrganisationSteps } from '@common/enum/substrate';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { ArrowLeftCircle, ArrowRightCircle } from '@common/global-ui-components/Icons';

interface ICreateOrganisationActionButtons {
	loading: boolean;
	onCancelClick?: () => void;
	onNextClick?: () => void;
}

export const CreateOrganisationActionButtons = ({
	loading,
	onCancelClick,
	onNextClick
}: ICreateOrganisationActionButtons) => {
	const { step } = useOrgStepsContext();
	return (
		<div className='flex w-full justify-between mt-5'>
			<Button
				variant={EButtonVariant.DANGER}
				disabled={step === ECreateOrganisationSteps.ORGANISATION_DETAILS || loading}
				fullWidth
				loading={loading}
				onClick={onCancelClick}
				icon={<ArrowLeftCircle className='text-sm' />}
				size='large'
			>
				Back
			</Button>
			<Button
				htmlType='submit'
				// disabled={
				// (step === 0 && !orgName) ||
				// (step === 1 && linkedMultisigs.length === 0) ||
				// (step === 2 && (!orgName || linkedMultisigs.length === 0))
				// }
				variant={EButtonVariant.PRIMARY}
				fullWidth
				loading={Boolean(loading)}
				onClick={onNextClick}
				size='large'
			>
				{step === ECreateOrganisationSteps.REVIEW ? 'Confirm' : 'Next'}
				{step !== ECreateOrganisationSteps.REVIEW && <ArrowRightCircle className='text-sm' />}
			</Button>
		</div>
	);
};
