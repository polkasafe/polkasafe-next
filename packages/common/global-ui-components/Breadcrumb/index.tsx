import { SlideInMotion } from '@common/global-ui-components/Motion/SlideIn';

interface IBreadcrumbProps {
	link: string;
	subLink?: string;
}

function Breadcrumb({ link, subLink }: IBreadcrumbProps) {
	return (
		<SlideInMotion>
			<span className='px-2.5 py-2 bg-bg-secondary text-primary text-xl font-bold rounded-xl'>
				{link}
				{subLink ? `/${subLink}` : ''}
			</span>
		</SlideInMotion>
	);
}

export default Breadcrumb;
