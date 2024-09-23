import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { DocsIcon } from '@common/global-ui-components/Icons';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';
import Link from 'next/link';

function DocsButton() {
	return (
		<SlideInMotion>
			<Link
				href='https://docs.polkasafe.xyz/'
				target='_blank'
				rel='noreferrer'
			>
				<Button
					icon={<DocsIcon />}
					variant={EButtonVariant.PRIMARY}
					className='outline-none border-none bg-highlight text-2xs text-waiting'
				>
					Docs
				</Button>
			</Link>
		</SlideInMotion>
	);
}

export default DocsButton;
