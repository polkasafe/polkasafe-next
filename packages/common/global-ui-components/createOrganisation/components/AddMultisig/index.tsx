import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { useOrgStepsContext } from '@common/context/CreateOrgStepsContext';
import { ECreateOrganisationSteps } from '@common/enum/substrate';
import { LinkMultisigOrganisation } from '@common/global-ui-components/createOrganisation/components/AddMultisig/components/LinkMultisig';
import { CreateOrganisationActionButtons } from '@common/global-ui-components/createOrganisation/components/CreateOrganisationActionButtons';
import { AddMultisig } from '@common/modals/AddMultisig';

export const AddMultisigsToOrganisation = () => {
	const {
		networks,
		availableSignatories,
		onCreateMultisigSubmit,
		linkedMultisig,
		multisigs,
		onRemoveMultisig,
		fetchMultisig,
		onLinkedMultisig
	} = useOrganisationContext();
	const { setStep } = useOrgStepsContext();

	return (
		<div>
			<p className='text-lg font-bold mb-2 text-white'>Create/Link Multisig</p>
			<p className='text-sm text-text-secondary mb-5'>
				MultiSig is a secure digital wallet that requires one or multiple owners to authorize the transaction.
			</p>
			<AddMultisig
				networks={networks}
				availableSignatories={availableSignatories}
				onSubmit={onCreateMultisigSubmit}
			/>

			<LinkMultisigOrganisation
				networks={networks}
				linkedMultisig={linkedMultisig}
				availableMultisig={multisigs}
				onSubmit={onLinkedMultisig}
				fetchMultisig={fetchMultisig}
				onRemoveSubmit={onRemoveMultisig}
			/>

			<CreateOrganisationActionButtons
				loading={false}
				onNextClick={() => setStep(ECreateOrganisationSteps.REVIEW)}
				onCancelClick={() => setStep(ECreateOrganisationSteps.ORGANISATION_DETAILS)}
				nextButtonDisabled={linkedMultisig.length === 0}
			/>
		</div>
	);
};
