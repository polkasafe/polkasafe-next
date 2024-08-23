'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import React, { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';

function NewTransaction() {
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
				New Transaction
			</Button>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='New Transaction'
			>
				Content
			</Modal>
		</div>
	);
}

export default NewTransaction;
