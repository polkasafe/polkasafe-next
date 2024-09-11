import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { CreateOrganisationActionButtons } from '@common/global-ui-components/createOrganisation/components/CreateOrganisationActionButtons';

export const ReviewOrganisation = () => {
	const { organisationDetails, linkedMultisig } = useOrganisationContext();
	return (
		<div>
			{linkedMultisig.map((multisig) => (
				<div key={multisig.address}>{multisig.name || multisig.address}</div>
			))}
			{organisationDetails.name}
			<CreateOrganisationActionButtons loading={false} />
		</div>
	);
};
