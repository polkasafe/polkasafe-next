import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import Modal from '@common/global-ui-components/Modal';
import { CreateMultisig } from '@common/global-ui-components/CreateMultisig';
import { ENetwork } from '@common/enum/substrate';
import { IMultisigCreate } from '@common/types/substrate';

interface IAddMultisig {
	networks: Array<ENetwork>;
	availableSignatories: Array<string>;
	onSubmit: (values: IMultisigCreate) => void;
}

export const AddMultisig = ({ networks, availableSignatories, onSubmit }: IAddMultisig) => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<div className='w-full'>
			<Button
				variant={EButtonVariant.PRIMARY}
				className='bg-primary border-primary text-sm'
				fullWidth
				icon={<PlusCircleOutlined />}
				onClick={() => setOpenModal(true)}
			>
				Add Multisig
			</Button>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='New Transaction'
			>
				<div className='flex flex-col gap-5'>
					<CreateMultisig
						networks={networks}
						availableSignatories={availableSignatories}
						onSubmit={onSubmit}
					/>
				</div>
			</Modal>
		</div>
	);
};
