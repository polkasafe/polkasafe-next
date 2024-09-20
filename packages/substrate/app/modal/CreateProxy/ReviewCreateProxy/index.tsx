import { IMultisig } from '@common/types/substrate';
import ReviewTransaction from '@substrate/app/(Main)/components/ReviewTransaction';

export const ReviewCreateProxy = ({ multisig, callData }: { multisig: IMultisig; callData: string }) => {
	return (
		<ReviewTransaction
			callData={callData}
			from={multisig.address}
			network={multisig.network}
			name={multisig.name}
		/>
	);
};
