import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import Modal from '@common/global-ui-components/Modal';
import { CreateMultisig } from '@common/global-ui-components/CreateMultisig';
import { ENetwork } from '@common/enum/substrate';
import { IAddressBook, IMultisigCreate } from '@common/types/substrate';

interface IAddMultisig {
	networks: Array<ENetwork>;
	availableSignatories: Array<IAddressBook>;
	onSubmit: (values: IMultisigCreate) => Promise<void>;
	userAddress: string;
}

export const AddMultisig = ({ networks, availableSignatories, onSubmit, userAddress }: IAddMultisig) => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<div className='w-full mb-4'>
			<div className='flex justify-between rounded-xl p-6 bg-bg-main'>
				<div className='flex-1 pr-10'>
					<p className='text-white font-bold text-base'>Create MultiSig</p>
				</div>
				<Button
					variant={EButtonVariant.PRIMARY}
					icon={<PlusCircleOutlined />}
					onClick={() => setOpenModal(true)}
					size='large'
				>
					Create Multisig
				</Button>
			</div>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='Create Multisig'
			>
				<div className='flex flex-col gap-5'>
					<CreateMultisig
						userAddress={userAddress}
						networks={networks}
						availableSignatories={availableSignatories}
						onSubmit={onSubmit}
						onClose={() => setOpenModal(false)}
					/>
				</div>
			</Modal>
		</div>
	);
};
