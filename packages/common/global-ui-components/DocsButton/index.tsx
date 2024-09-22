import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { DocsIcon } from '@common/global-ui-components/Icons';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';

function DocsButton() {
	return (
		<SlideInMotion>
			<Button
				icon={<DocsIcon />}
				variant={EButtonVariant.PRIMARY}
				className='outline-none border-none bg-highlight text-xs text-waiting'
			>
				<a
					href='https://docs.polkasafe.xyz/'
					target='_blank'
					rel='noreferrer'
				>
					Docs
				</a>
			</Button>
		</SlideInMotion>
	);
}

export default DocsButton;
