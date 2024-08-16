// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { Metadata } from 'next';
import '@common/styles/globals.scss';
import NextTopLoader from 'nextjs-toploader';
import { LayoutWrapper } from '@common/global-ui-components/LayoutWrapper';
import React, { PropsWithChildren } from 'react';
import { Layout } from '@common/global-ui-components/Layout';
import { getUserFromCookie } from '@substrate/app/global/lib/cookies';
import { LOGIN_URL } from '@substrate/app/global/end-points';
import { redirect } from 'next/navigation';
import InitializeUser from '@substrate/app/Initializers/InitializeUser';
import InitializeOrganisation from '@substrate/app/Initializers/InitializeOrganisation';
import { Provider } from 'jotai';
import InitializeCurrency from '@substrate/app/Initializers/InitializeCurrency';
import InitializeAPI from '@substrate/app/Initializers/InitializeAPI';
// import InitializeAssets from '@substrate/app/Initializers/InializeAssets';
// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	description: 'User friendly Multisig for Polkadot & Kusama ecosystem',
	title: 'Polkasafe',
	viewport: {
		height: 'device-height',
		initialScale: 1,
		maximumScale: 1,
		minimumScale: 1,
		width: 'device-width'
	}
};

export default function RootLayout({ children }: PropsWithChildren) {
	const user = getUserFromCookie();
	if (!user) {
		redirect(LOGIN_URL);
	}
	return (
		<html lang='en'>
			<body>
				<Provider>
					<LayoutWrapper>
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
					</LayoutWrapper>
				</Provider>
			</body>
		</html>
	);
}
