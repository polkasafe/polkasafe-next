'use client';

import { Layout } from '@common/global-ui-components/Layout';
import { organisationAtom, useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';
import React, { PropsWithChildren } from 'react';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';

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
			selectedOrganisation={organisation}
		>
			{children}
		</Layout>
	);
}

export default SubstrateLayout;
