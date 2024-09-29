'use client';

import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { WalletIcon } from '@common/global-ui-components/Icons';
import Modal from '@common/global-ui-components/Modal';
import { FundMultisigForm } from '@common/modals/FundMultisig/components/FundMultisigForm';
import React, { useState } from 'react';

function FundMultisig() {
	const [openModal, setOpenModal] = useState(false);
	return (
		<div className='w-full'>
			<Button
				onClick={() => setOpenModal(true)}
				variant={EButtonVariant.SECONDARY}
				icon={<WalletIcon fill='#8AB9FF' />}
				size='large'
				className='text-sm bg-highlight text-label'
				fullWidth
			>
				Fund Multisig
			</Button>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='Fund Multisig'
			>
				<FundMultisigForm />
			</Modal>
		</div>
	);
}

export default FundMultisig;
