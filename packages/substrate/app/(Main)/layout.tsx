// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import '@common/styles/globals.scss';
import NextTopLoader from 'nextjs-toploader';
import React, { PropsWithChildren } from 'react';
import { Layout } from '@common/global-ui-components/Layout';
import { getUserFromCookie } from '@substrate/app/global/lib/cookies';
import { LOGIN_URL } from '@substrate/app/global/end-points';
import { redirect } from 'next/navigation';
import InitializeUser from '@substrate/app/Initializers/InitializeUser';
import InitializeOrganisation from '@substrate/app/Initializers/InitializeOrganisation';
import InitializeCurrency from '@substrate/app/Initializers/InitializeCurrency';
import InitializeAPI from '@substrate/app/Initializers/InitializeAPI';

export default function MainLayout({ children }: PropsWithChildren) {
	const user = getUserFromCookie();
	if (!user) {
		redirect(LOGIN_URL);
	}
	return (
		<>
			<InitializeUser
				userAddress={user.address[0]}
				organisations={user.organisations}
				signature={user.signature}
			/>
			<InitializeOrganisation />
			<InitializeCurrency />
			<InitializeAPI />
			{/* <InitializeAssets /> */}
			<NextTopLoader />
			<Layout
				userAddress={user.address[0]}
				organisations={user.organisations}
			>
				{children}
			</Layout>
		</>
	);
}
