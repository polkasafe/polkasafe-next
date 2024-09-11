import NextTopLoader from 'nextjs-toploader';
import { CreateOrganisationLayout } from '@common/global-ui-components/CreateOrganisationLayout';
import { PropsWithChildren } from 'react';

export default function CreateOrgLayout({ children }: PropsWithChildren) {
	return (
		<html lang='en'>
			<body>
				<NextTopLoader />
				<CreateOrganisationLayout>{children}</CreateOrganisationLayout>
			</body>
		</html>
	);
}