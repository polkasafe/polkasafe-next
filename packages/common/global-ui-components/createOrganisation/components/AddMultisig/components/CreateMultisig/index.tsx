import { CreateMultisig } from '@common/global-ui-components/CreateMultisig';
import { ICreateMultisig } from '@common/types/substrate';

export const CreateMultisigOrganisation = ({ networks, availableSignatories, onSubmit }: ICreateMultisig) => {
	return (
		<div>
			<CreateMultisig
				networks={networks}
				availableSignatories={availableSignatories}
				onSubmit={onSubmit}
			/>
		</div>
	);
};
