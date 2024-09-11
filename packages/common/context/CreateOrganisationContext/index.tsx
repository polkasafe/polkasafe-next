import { ECreateOrganisationSteps, ENetwork } from '@common/enum/substrate';
import { IAddressBook, ICreateOrganisationDetails, IMultisig, IMultisigCreate } from '@common/types/substrate';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface ICreateOrganisationProvider extends PropsWithChildren {
	step: ECreateOrganisationSteps;
	setStep: (newStep: ECreateOrganisationSteps) => void;
	onCreateOrganisation: () => Promise<void>;
	multisigs: Array<IMultisig>;
	linkedMultisig: Array<IMultisig>;
	availableSignatories: Array<IAddressBook>;
	networks: Array<ENetwork>;
	organisationDetails: ICreateOrganisationDetails;
	onCreateMultisigSubmit: (values: IMultisigCreate) => Promise<void>;
	onChangeOrganisationDetails: (value: ICreateOrganisationDetails) => void;
	onLinkedMultisig: (multisig: IMultisig) => Promise<void>;
	onRemoveMultisig: (multisig: IMultisig) => Promise<void>;
	fetchMultisig: (network: ENetwork) => Promise<void>;
}

export const CreateOrganisationContext = createContext({} as ICreateOrganisationProvider);

export function CreateOrganisationProvider({
	step,
	setStep,
	onCreateOrganisation,
	multisigs,
	networks,
	availableSignatories,
	onCreateMultisigSubmit,
	fetchMultisig,
	linkedMultisig,
	onLinkedMultisig,
	organisationDetails,
	onRemoveMultisig,
	onChangeOrganisationDetails,
	children
}: ICreateOrganisationProvider) {
	const value = useMemo(
		() => ({
			step,
			setStep,
			onCreateOrganisation,
			multisigs,
			linkedMultisig,
			networks,
			availableSignatories,
			onCreateMultisigSubmit,
			onChangeOrganisationDetails,
			onLinkedMultisig,
			onRemoveMultisig,
			organisationDetails,
			fetchMultisig
		}),
		[
			step,
			setStep,
			onRemoveMultisig,
			availableSignatories,
			fetchMultisig,
			linkedMultisig,
			multisigs,
			onChangeOrganisationDetails,
			networks,
			onCreateMultisigSubmit,
			onLinkedMultisig,
			organisationDetails,
			onCreateOrganisation
		]
	);
	return <CreateOrganisationContext.Provider value={value}>{children}</CreateOrganisationContext.Provider>;
}

export const useOrganisationContext = () => useContext(CreateOrganisationContext);
