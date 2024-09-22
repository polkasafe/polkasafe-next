// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useState } from 'react';

import { DollarIcon } from '@common/global-ui-components/Icons';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import Modal from '@common/global-ui-components/Modal';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import DonateInfo from './DonateInfo';

const DonateButton = () => {
	const [openDonateModal, setOpenDonateModal] = useState(false);
	return (
		<SlideInMotion>
			<Modal
				onCancel={() => setOpenDonateModal(false)}
				title={<h3 className='text-white mb-8 text-lg font-semibold'>Donate Us!</h3>}
				open={openDonateModal}
			>
				<DonateInfo />
			</Modal>
			<Button
				icon={<DollarIcon />}
				variant={EButtonVariant.PRIMARY}
				onClick={() => setOpenDonateModal(true)}
				className='outline-none border-none bg-highlight text-xs text-primary'
			>
				Donate
			</Button>
		</SlideInMotion>
	);
};

export default DonateButton;
