import { IMultisig, IOrganisation } from '@common/types/substrate';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

interface ICreateOrganisationProvider extends PropsWithChildren {
	onOrgDetailsChange: (values: IOrganisation) => Promise<void>;
	multisigs: Array<IMultisig>;
}

export const CreateOrganisationContext = createContext({} as ICreateOrganisationProvider);

export function CreateOrganisationProvider({ onOrgDetailsChange, multisigs, children }: ICreateOrganisationProvider) {
	const value = useMemo(
		() => ({
			onOrgDetailsChange,
			multisigs
		}),
		[multisigs, onOrgDetailsChange]
	);
	return <CreateOrganisationContext.Provider value={value}>{children}</CreateOrganisationContext.Provider>;
}

export const useDashboardContext = () => useContext(CreateOrganisationContext);
