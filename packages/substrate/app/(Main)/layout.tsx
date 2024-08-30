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
import { Provider } from 'jotai';
import Initializers from '@substrate/app/Initializers';
import QueryProvider from '@substrate/app/providers/QueryClient';
import { LayoutWrapper } from '@common/global-ui-components/LayoutWrapper';
// import InitializeAssets from '@substrate/app/Initializers/InializeAssets';
// const inter = Inter({ subsets: ['latin'] })

export default function MainLayout({ children }: PropsWithChildren) {
	const user = getUserFromCookie();
	if (!user) {
		redirect(LOGIN_URL);
	}
	return (
		<html lang='en'>
			<body>
				<Provider>
					<LayoutWrapper>
						<QueryProvider>
							<Initializers
								userAddress={user.address[0]}
								signature={user.signature}
								organisations={user.organisations}
							/>
							<NextTopLoader />
							<Layout
								userAddress={user.address[0]}
								organisations={user.organisations}
							>
								{children}
							</Layout>
						</QueryProvider>
					</LayoutWrapper>
				</Provider>
			</body>
		</html>
	);
}
