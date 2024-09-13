'use client';

import NextTopLoader from 'nextjs-toploader';
import '@common/styles/globals.scss';
import CreateOrganisationLayout from '@common/global-ui-components/CreateOrganisationLayout';
import { PropsWithChildren, useState } from 'react';
import { CreateOrgStepsProvider } from '@common/context/CreateOrgStepsContext';

export default function CreateOrgLayout({ children }: PropsWithChildren) {
	const [step, setStep] = useState<number>(0);
	return (
		<html lang='en'>
			<body>
				<NextTopLoader />
				<CreateOrgStepsProvider step={step} setStep={setStep}>
					<CreateOrganisationLayout>{children}</CreateOrganisationLayout>
				</CreateOrgStepsProvider>
			</body>
		</html>
	);
}
