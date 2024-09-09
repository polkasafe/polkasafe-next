'use client';

import { CreateOrganisation } from '@common/global-ui-components/createOrganisation/page';
import { CreateOrganisationProvider } from '@common/context/CreateOrganisationContext';
import { useState } from 'react';
import { IConnectedUser, IMultisig, IOrganisation } from '@common/types/substrate';
import { createMultisig } from '@sdk/polkasafe-sdk/src/create-multisig';
import { getMultisigsByAddress } from '@sdk/polkasafe-sdk/src/get-all-multisig-by-address';
import { ECreateOrganisationSteps, ENetwork } from '@common/enum/substrate';
import { useWalletAccounts } from '@substrate/app/global/hooks/useWalletAccounts';
import { useAtomValue } from 'jotai';
import { userAtom } from '@substrate/app/atoms/auth/authAtoms';
import { IConnectProps } from '@common/types/sdk';

export default function SubstrateCreateOrganisation({ user }: { user: IConnectedUser }) {
	const availableSignatories = useWalletAccounts();

	const [multisigs, setMultisigs] = useState<Array<IMultisig>>([]);
	const [linkedMultisigs, setLinkedMultisigs] = useState<Array<IMultisig>>([]);
	const [step, setStep] = useState(ECreateOrganisationSteps.ADD_MULTISIG);

	const onCreateMultisigSubmit = async ({
		signatories,
		name,
		threshold,
		network
	}: {
		signatories: Array<string>;
		name: string;
		threshold: number;
		network: ENetwork;
	}) => {
		const multisig = {
			name,
			signatories,
			threshold,
			network
		};
		try {
			const newMultisig = (await createMultisig(multisig)) as { data: IMultisig };
			console.log('newMultisigs', newMultisig?.data);
			setMultisigs([...multisigs, { ...newMultisig?.data, linked: true }]);
			setLinkedMultisigs([...linkedMultisigs, newMultisig?.data]);
		} catch (e) {
			console.error('error', e);
		}
	};

	const onLinkedMultisig = async (multisig: IMultisig) => {
		// link multisig
	};

	const fetchMultisig = async (network: ENetwork) => {
		console.log('fetchMultisig', network, user);
		if (!user) return;
		const data = (await getMultisigsByAddress({ address: user.address?.[0], network })) as { data: Array<IMultisig> };

		const leftMultisig = (data?.data || []).filter(
			(multisig) => !linkedMultisigs.find((linked) => linked.address === multisig.address)
		);
		setMultisigs(leftMultisig);
	};

	const handleCreateOrganisation = async (value: IOrganisation) => {
		// create organisation
	};

	return (
		<div>
			<CreateOrganisationProvider
				step={step}
				setStep={setStep}
				onCreateMultisigSubmit={onCreateMultisigSubmit}
				fetchMultisig={fetchMultisig}
				multisigs={multisigs}
				availableSignatories={availableSignatories}
				networks={Object.values(ENetwork)}
				onCreateOrganisation={handleCreateOrganisation}
				linkedMultisig={linkedMultisigs}
				onLinkedMultisig={onLinkedMultisig}
			>
				<CreateOrganisation />
			</CreateOrganisationProvider>
		</div>
	);
}
