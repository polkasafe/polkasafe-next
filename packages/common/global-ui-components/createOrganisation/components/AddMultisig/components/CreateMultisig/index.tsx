import { CreateMultisig } from '@common/global-ui-components/CreateMultisig';
import { ICreateMultisig } from '@common/types/substrate';
import React from 'react';

export const CreateMultisigOrganisation = ({ networks, availableSignatories, onSubmit }: ICreateMultisig) => {
	return (
		<div>
			<CreateMultisig
				networks={networks}
				availableSignatories={availableSignatories}
				onSubmit={onSubmit}
			/>
		</div>
	);
};
