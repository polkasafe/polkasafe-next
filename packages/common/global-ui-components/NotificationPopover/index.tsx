import { NotificationIcon } from '@common/global-ui-components/Icons';
import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';

function NotificationPopover() {
	return (
		<SlideInMotion>
			<NotificationIcon className='bg-highlight p-3.5 text-text-primary rounded-lg' />
		</SlideInMotion>
	);
}

export default NotificationPopover;
