'use client';
import { Layout } from '@common/global-ui-components/Layout';
import { IOrganisation } from '@common/types/substrate';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';
import React, { PropsWithChildren } from 'react';

interface ISubstrateLayout {
	userAddress: string;
	organisations: Array<IOrganisation>;
}

function SubstrateLayout({ userAddress, organisations, children }: PropsWithChildren<ISubstrateLayout>) {
	const organisation = useAtomValue(organisationAtom);
	return (
		<Layout
			userAddress={userAddress}
			organisations={organisations}
			selectedOrganisation={organisation || organisations[0]}
		>
			{children}
		</Layout>
	);
}

export default SubstrateLayout;
