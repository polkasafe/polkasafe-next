'use client';
import { ENetwork } from '@common/enum/substrate';
import { Layout } from '@common/global-ui-components/Layout';
import { IMultisigCreate, IOrganisation } from '@common/types/substrate';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';
import { createMultisig } from '@sdk/polkasafe-sdk/src/create-multisig';
import React, { PropsWithChildren } from 'react';

interface ISubstrateLayout {
	userAddress: string;
	organisations: Array<IOrganisation>;
}

function SubstrateLayout({ userAddress, organisations, children }: PropsWithChildren<ISubstrateLayout>) {
	const organisation = useAtomValue(organisationAtom);
	const handleMultisigCreate = async ({ name, signatories, network, threshold }: IMultisigCreate) => {
		await createMultisig({
			multisigName: name,
			signatories,
			network,
			threshold
		});
	};
	return (
		<Layout
			userAddress={userAddress}
			organisations={organisations}
			selectedOrganisation={organisation || organisations[0]}
			networks={Object.values(ENetwork)}
			availableSignatories={[]}
			onMultisigCreate={handleMultisigCreate}
		>
			{children}
		</Layout>
	);
}

export default SubstrateLayout;
