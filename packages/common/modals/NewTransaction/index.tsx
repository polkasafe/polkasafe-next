'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import React, { useState } from 'react';
import { PlusCircleOutlined } from '@ant-design/icons';
import { NewTransactionForm } from '@common/modals/NewTransaction/components/NewTransactionForm';

function NewTransaction() {
	const [openModal, setOpenModal] = useState(false);
	return (
		<div className='w-full'>
			<Button
				variant={EButtonVariant.PRIMARY}
				fullWidth
				icon={<PlusCircleOutlined />}
				onClick={() => setOpenModal(true)}
				size='large'
			>
				New Transaction
			</Button>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='New Transaction'
			>
				<div className='flex flex-col gap-5'>
					<NewTransactionForm />
				</div>
			</Modal>
		</div>
	);
}

export default NewTransaction;
