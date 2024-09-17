'use client';

import { Layout } from '@common/global-ui-components/Layout';
import { organisationAtom, useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';
import React, { PropsWithChildren } from 'react';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { logout } from '@sdk/polkasafe-sdk/src/logout';

interface ISubstrateLayout {
	userAddress: string;
}

function SubstrateLayout({ userAddress, children }: PropsWithChildren<ISubstrateLayout>) {
	const [organisation] = useOrganisation();
	const [user] = useUser();
	return (
		<Layout
			userAddress={userAddress}
			organisations={user?.organisations || []}
			logout={() => logout({ address: userAddress, signature: user?.signature || '' })}
			selectedOrganisation={organisation}
		>
			{children}
		</Layout>
	);
}

export default SubstrateLayout;
