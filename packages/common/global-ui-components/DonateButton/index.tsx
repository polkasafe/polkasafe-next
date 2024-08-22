// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import React, { useState } from 'react';

import { DollarIcon } from '@common/global-ui-components/Icons';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import Modal from '@common/global-ui-components/Modal';
import DonateInfo from './DonateInfo';

const DonateButton = () => {
	const [openDonateModal, setOpenDonateModal] = useState(false);
	return (
		<SlideInMotion>
			<div className='relative'>
				<Modal
					onCancel={() => setOpenDonateModal(false)}
					title={<h3 className='text-white mb-8 text-lg font-semibold'>Donate Us!</h3>}
					open={openDonateModal}
				>
					<DonateInfo />
				</Modal>
				<button
					onClick={() => setOpenDonateModal(true)}
					className='flex items-center justify-center gap-x-2 outline-none border-none text-white bg-highlight rounded-lg p-2.5 shadow-none text-xs'
				>
					<DollarIcon className='text-sm text-primary' />
					<span className='hidden md:inline-flex text-primary'>Donate</span>
				</button>
			</div>
		</SlideInMotion>
	);
};

export default DonateButton;
