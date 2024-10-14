'use client';

import NextTopLoader from 'nextjs-toploader';
import '@common/styles/globals.scss';
import CreateOrganisationLayout from '@common/global-ui-components/CreateOrganisationLayout';
import { PropsWithChildren, useState } from 'react';
import { CreateOrgStepsProvider } from '@common/context/CreateOrgStepsContext';
import { ECreateOrganisationSteps } from '@common/enum/substrate';
import { Metadata } from 'next';

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

export default function CreateOrgLayout({ children }: PropsWithChildren) {
	const [step, setStep] = useState<ECreateOrganisationSteps>(ECreateOrganisationSteps.ORGANISATION_DETAILS);
	return (
		<html lang='en'>
			<body>
				<NextTopLoader />
				<CreateOrgStepsProvider
					step={step}
					setStep={setStep}
				>
					<CreateOrganisationLayout>{children}</CreateOrganisationLayout>
				</CreateOrgStepsProvider>
			</body>
		</html>
	);
}
