import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import Modal from '@common/global-ui-components/Modal';
import { IAddressBook, IMultisig } from '@common/types/substrate';
import { UpdateMultisigForm } from '@common/modals/UpdateMultisig/components/UpdateMultisigForm';

interface IUpdateMultisig {
	multisig: IMultisig;
	proxyAddress: string;
	addresses: Array<IAddressBook>;
	className?: string;
	onSubmit: (values: any) => Promise<void>;
}

export const UpdateMultisig = ({ multisig, proxyAddress, onSubmit, addresses, className }: IUpdateMultisig) => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<div className={`w-full mb-4 ${className}`}>
			<Button
				variant={EButtonVariant.PRIMARY}
				icon={<PlusCircleOutlined />}
				onClick={() => setOpenModal(true)}
				size='large'
			>
				Edit Multisig
			</Button>

			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='Update Multisig'
			>
				<UpdateMultisigForm
					multisig={multisig}
					proxyAddress={proxyAddress}
					onSubmit={onSubmit}
					addresses={addresses}
				/>
			</Modal>
		</div>
	);
};
