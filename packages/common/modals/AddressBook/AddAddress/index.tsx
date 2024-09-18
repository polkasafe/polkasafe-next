'use client';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import Modal from '@common/global-ui-components/Modal';
import { IAddressBook } from '@common/types/substrate';
import { twMerge } from 'tailwind-merge';
import { AddAddressForm } from '@common/modals/AddressBook/AddAddress/components/AddAddressForm';

interface IAddAddress {
	title: string;
	addressBook: IAddressBook;
	className?: string;
	onSubmit: (values: IAddressBook) => Promise<void>;
}

export const AddAddress = ({ onSubmit, title, addressBook, className }: IAddAddress) => {
	const [openModal, setOpenModal] = useState(false);
	return (
		<div className={twMerge('w-full mb-4', className)}>
			<Button
				variant={EButtonVariant.PRIMARY}
				icon={<PlusCircleOutlined />}
				onClick={() => setOpenModal(true)}
				size='large'
			>
				{title}
			</Button>

			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title={`${title} Address`}
			>
				<AddAddressForm
					initialValue={{
						address: addressBook.address,
						name: addressBook.name,
						email: addressBook.email === '-' ? '' : addressBook.email,
						discord: addressBook.discord === '-' ? '' : addressBook.discord,
						telegram: addressBook.telegram === '-' ? '' : addressBook.telegram
					}}
					onSubmit={async (values: IAddressBook) => {
						await onSubmit(values);
						setOpenModal(false);
					}}
				/>
			</Modal>
		</div>
	);
};
