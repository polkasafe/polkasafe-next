// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import type { Metadata } from 'next';
import '@common/styles/globals.scss';
import { LayoutWrapper } from '@common/global-ui-components/LayoutWrapper';
import React, { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import InitializeWalletConnect from '@substrate/app/Initializers/initializeWalletConnect';
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
	return (
		<html lang='en'>
			<body>
				<Provider>
					<LayoutWrapper>
						<InitializeWalletConnect />
						{children}
					</LayoutWrapper>
				</Provider>
			</body>
		</html>
	);
}
