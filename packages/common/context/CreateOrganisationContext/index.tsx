import { ECreateOrganisationSteps, ENetwork } from '@common/enum/substrate';
import { IAddressBook, IMultisig, IMultisigCreate, IOrganisation } from '@common/types/substrate';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface ICreateOrganisationProvider extends PropsWithChildren {
	step: ECreateOrganisationSteps;
	setStep: (newStep: ECreateOrganisationSteps) => void;
	onCreateOrganisation: (values: IOrganisation) => Promise<void>;
	multisigs: Array<IMultisig>;
	linkedMultisig: Array<IMultisig>;
	availableSignatories: Array<IAddressBook>;
	networks: Array<ENetwork>;
	onCreateMultisigSubmit: (values: IMultisigCreate) => Promise<void>;
	onLinkedMultisig: (multisig: IMultisig) => Promise<void>;
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
			onLinkedMultisig,
			fetchMultisig
		}),
		[
			step,
			setStep,
			availableSignatories,
			fetchMultisig,
			linkedMultisig,
			multisigs,
			networks,
			onCreateMultisigSubmit,
			onLinkedMultisig,
			onCreateOrganisation
		]
	);
	return <CreateOrganisationContext.Provider value={value}>{children}</CreateOrganisationContext.Provider>;
}

export const useOrganisationContext = () => useContext(CreateOrganisationContext);
