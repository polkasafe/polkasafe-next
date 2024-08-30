// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { IOrganisation } from '@common/types/substrate';
import InitializeAPI from '@substrate/app/Initializers/InitializeAPI';
import InitializeCurrency from '@substrate/app/Initializers/InitializeCurrency';
import InitializeOrganisation from '@substrate/app/Initializers/InitializeOrganisation';
import InitializeUser from '@substrate/app/Initializers/InitializeUser';

interface IInitializer {
	userAddress: string;
	signature: string;
	organisations: Array<IOrganisation>;
}

function Initializers({ userAddress, signature, organisations }: IInitializer) {
	return (
		<>
			<InitializeUser
				userAddress={userAddress}
				signature={signature}
				organisations={organisations}
			/>
			<InitializeAPI />
			<InitializeCurrency />
			<InitializeOrganisation />
		</>
	);
}

export default Initializers;
