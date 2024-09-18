import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import React from 'react';

interface IConfirmationModal {
	openModal: boolean;
	setOpenModal: (value: boolean) => void;
	title: string;
	message: string;
	onSubmit: () => void;
}

export const ConfirmationModal = ({ openModal, setOpenModal, title, message, onSubmit }: IConfirmationModal) => {
	return (
		<Modal
			open={openModal}
			onCancel={() => setOpenModal(false)}
			title={title}
		>
			<div className='flex flex-col gap-5'>{message}</div>
			<div className='flex justify-end gap-4'>
				<Button
					variant={EButtonVariant.PRIMARY}
					onClick={() => {
						onSubmit();
						setOpenModal(false);
					}}
				>
					Yes
				</Button>
				<Button
					variant={EButtonVariant.SECONDARY}
					onClick={() => setOpenModal(false)}
				>
					No
				</Button>
			</div>
		</Modal>
	);
};
