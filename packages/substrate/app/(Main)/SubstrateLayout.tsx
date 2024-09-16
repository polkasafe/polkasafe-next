'use client';

import { Layout } from '@common/global-ui-components/Layout';
import { IOrganisation } from '@common/types/substrate';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';
import React, { PropsWithChildren } from 'react';
import { userAtom } from '@substrate/app/atoms/auth/authAtoms';

interface ISubstrateLayout {
	userAddress: string;
}

function SubstrateLayout({ userAddress, children }: PropsWithChildren<ISubstrateLayout>) {
	const organisation = useAtomValue(organisationAtom);
	const user = useAtomValue(userAtom);
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
