import { DocsIcon } from '@common/global-ui-components/Icons';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import React from 'react';

function DocsButton() {
	return (
		<SlideInMotion>
			<a
				href='https://docs.polkasafe.xyz/'
				target='_blank'
				rel='noreferrer'
				className='flex items-center justify-center gap-x-2 outline-none border-none text-waiting bg-highlight rounded-lg p-2.5 shadow-none text-xs'
			>
				<DocsIcon /> Docs
			</a>
		</SlideInMotion>
	);
}

export default DocsButton;
