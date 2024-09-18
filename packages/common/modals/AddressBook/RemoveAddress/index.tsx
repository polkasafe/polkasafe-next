import Button from '@common/global-ui-components/Button';
import React, { useState } from 'react';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import { ConfirmationModal } from '@common/modals/ConfirmationModal';

export const RemoveAddress = ({ onSubmit }: { onSubmit: () => Promise<void> }) => {
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();
	const handleRemove = async () => {
		try {
			setLoading(true);
			await onSubmit();
			notification.success(SUCCESS_MESSAGES.REMOVE_ADDRESS_SUCCESS);
		} catch (error) {
			console.error(error);
			notification.error({ ...ERROR_MESSAGES.REMOVE_ADDRESS_FAILED, description: error.message || error });
		} finally {
			setLoading(false);
			setOpenModal(false);
		}
	};
	return (
		<>
			{context}
			<Button
				type='primary'
				onClick={() => setOpenModal(true)}
				loading={loading}
			>
				delete
			</Button>
			<ConfirmationModal
				openModal={openModal}
				setOpenModal={setOpenModal}
				title='Delete Address'
				message='Are you sure you want to delete this address from address book'
				onSubmit={handleRemove}
			/>
		</>
	);
};
