import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { LinkMultisigOrganisation } from '@common/global-ui-components/createOrganisation/components/AddMultisig/components/LinkMultisig';
import { AddMultisig } from '@common/modals/AddMultisig';
import React from 'react';

export const AddMultisigsToOrganisation = () => {
	const {
		networks,
		availableSignatories,
		onCreateMultisigSubmit,
		linkedMultisig,
		multisigs,
		fetchMultisig,
		onLinkedMultisig
	} = useOrganisationContext();
	return (
		<div>
			{linkedMultisig &&
				linkedMultisig.map((multisig) => <div key={multisig.address}>{multisig.name || multisig.address}</div>)}

			<LinkMultisigOrganisation
				networks={networks}
				linkedMultisig={linkedMultisig}
				availableMultisig={multisigs}
				onSubmit={onLinkedMultisig}
				fetchMultisig={fetchMultisig}
			/>

			<AddMultisig
				networks={networks}
				availableSignatories={availableSignatories}
				onSubmit={onCreateMultisigSubmit}
			/>
		</div>
	);
};
