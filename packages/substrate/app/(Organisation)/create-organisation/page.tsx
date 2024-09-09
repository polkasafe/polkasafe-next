import { getUserFromCookie } from '@substrate/app/global/lib/cookies';
import Secure from '@substrate/app/(Main)/Secure';
import SubstrateCreateOrganisation from '@substrate/app/(Organisation)/create-organisation/components/SubstrateCreateOrganisation';
import { IConnectedUser } from '@common/types/substrate';

export default function CreateOrganisation() {
	const user = getUserFromCookie();

	return (
		<Secure>
			<SubstrateCreateOrganisation user={user as IConnectedUser} />
		</Secure>
	);
}
