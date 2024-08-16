'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import React, { useState } from 'react';

function FundMultisig() {
	const [openModal, setOpenModal] = useState(false);
	return (
		<div className='w-full'>
			<Button
				variant={EButtonVariant.PRIMARY}
				onClick={() => setOpenModal(true)}
				fullWidth
				className='text-text-outline-primary bg-primary/75'
			>
				Fund Multisig
			</Button>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='Fund Multisig'
			>
				Content
			</Modal>
		</div>
	);
}

export default FundMultisig;
