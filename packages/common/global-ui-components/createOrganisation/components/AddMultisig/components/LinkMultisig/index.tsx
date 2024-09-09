import { LinkMultisig } from '@common/global-ui-components/LinkMultisig';
import { ILinkMultisig } from '@common/types/substrate';
import React from 'react';

export const LinkMultisigOrganisation = ({
	networks,
	linkedMultisig,
	availableMultisig,
	onSubmit,
	fetchMultisig
}: ILinkMultisig) => {
	return (
		<div>
			<LinkMultisig
				networks={networks}
				linkedMultisig={linkedMultisig}
				availableMultisig={availableMultisig}
				onSubmit={onSubmit}
				fetchMultisig={fetchMultisig}
			/>
		</div>
	);
};
