'use client';

import { CreateOrganisation } from '@common/global-ui-components/createOrganisation/page';
import { CreateOrganisationProvider } from '@common/context/CreateOrganisationContext';
import { useState } from 'react';
import {
	IConnectedUser,
	ICreateOrganisationDetails,
	IDBMultisig,
	IMultisig,
	IOrganisation
} from '@common/types/substrate';
import { createMultisig } from '@sdk/polkasafe-sdk/src/create-multisig';
import { getMultisigsByAddress } from '@sdk/polkasafe-sdk/src/get-all-multisig-by-address';
import { ENetwork } from '@common/enum/substrate';
import { useWalletAccounts } from '@substrate/app/global/hooks/useWalletAccounts';
import { createOrganisation } from '@sdk/polkasafe-sdk/src/create-organisation';
import { useRouter } from 'next/navigation';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES } from '@common/utils/messages';
import { ORGANISATION_DASHBOARD_URL } from '@substrate/app/global/end-points';
import UserPopover from '@common/global-ui-components/UserPopover';

export default function SubstrateCreateOrganisation({ user }: { user: IConnectedUser }) {
	const availableSignatories = useWalletAccounts();
	const router = useRouter();
	const [notification, context] = useNotification();

	const [multisigs, setMultisigs] = useState<Array<IMultisig>>([]);
	const [linkedMultisigs, setLinkedMultisigs] = useState<Array<IMultisig>>([]);
	const [organisationDetails, setOrganisationDetails] = useState<ICreateOrganisationDetails>({
		name: '',
		description: ''
	});

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
		const payload = multisigs.filter((m) => m.address !== multisig.address);
		setMultisigs(payload);
		setLinkedMultisigs([...linkedMultisigs, multisig]);
	};

	const onRemoveMultisig = async (multisig: IMultisig) => {
		const payload = linkedMultisigs.filter((m) => m.address !== multisig.address);
		setLinkedMultisigs(payload);
	};

	const fetchMultisig = async (network: ENetwork) => {
		console.log('fetchMultisig', network, user);
		if (!user) return;
		const data = (await getMultisigsByAddress({ address: user.address, network })) as { data: Array<IMultisig> };

		const leftMultisig = (data?.data || []).filter(
			(multisig) =>
				!linkedMultisigs.find((linked) => linked.address === multisig.address && linked.network === multisig.network)
		);
		setMultisigs(leftMultisig);
	};

	const handleCreateOrganisation = async () => {
		const payload = {
			name: organisationDetails.name,
			description: organisationDetails.description,
			image: organisationDetails.image,
			multisigs: linkedMultisigs.map((m) => ({
				address: m.address,
				network: m.network,
				threshold: m.threshold,
				signatories: m.signatories,
				name: m.name,
				proxy: m.proxy
			})) as Array<IDBMultisig>,
			address: user.address[0],
			signature: user.signature
		};
		const data = (await createOrganisation(payload)) as { data: IOrganisation };
		console.log('data', data);
		if (data?.data?.id) {
			return router.push(ORGANISATION_DASHBOARD_URL({ id: data?.data.id }));
		}
		notification.error(ERROR_MESSAGES.CREATE_ORGANISATION_FAILED);
	};

	const handleOrganisationDetails = (value: ICreateOrganisationDetails) => {
		console.log('value', value);
		if (value.name === '' || value.description === '') {
			return;
		}
		setOrganisationDetails(value);
	};

	return (
		<div>
			<CreateOrganisationProvider
				onCreateMultisigSubmit={onCreateMultisigSubmit}
				fetchMultisig={fetchMultisig}
				multisigs={multisigs}
				availableSignatories={availableSignatories}
				networks={Object.values(ENetwork)}
				onCreateOrganisation={handleCreateOrganisation}
				linkedMultisig={linkedMultisigs}
				onLinkedMultisig={onLinkedMultisig}
				onRemoveMultisig={onRemoveMultisig}
				organisationDetails={organisationDetails}
				onChangeOrganisationDetails={handleOrganisationDetails}
			>
				{context}
				<div className='flex flex-col'>
					<div className='flex justify-end mb-10 pr-20'>
						{user && user.address && <UserPopover userAddress={user.address} />}
					</div>
					<div className='flex w-full justify-center flex-1 overflow-y-auto'>
						<CreateOrganisation />
					</div>
				</div>
			</CreateOrganisationProvider>
		</div>
	);
}
