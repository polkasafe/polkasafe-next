// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { Layout } from 'antd';

import Link from 'next/link';

const { Footer: AntdFooter } = Layout;

const Footer: React.FC = () => {
	return (
		<AntdFooter className='flex text-white bg-bg-main flex-row items-center shadow-top'>
			<section className='flex-1 text-xs flex flex-col py-[30px] lg:py-0 lg:items-center lg:flex-row lg:justify-between gap-x-2 gap-y-3'>
				<div className='flex gap-2 md:gap-10 items-center justify-between'>
					<p className='hidden md:block'>
						<sup>&#169;</sup>
						All Rights Reserved
					</p>
					<Link href='/terms-and-conditions'>Terms & Conditions</Link>
					<Link href='/privacy-policy'>Privacy Policy</Link>
					<Link href='/contact-us'>Contact Us</Link>
					<a
						href='https://polkasafe.hellonext.co/b/bugs-feedback'
						target='_blank'
						rel='noreferrer'
					>
						Report Bug
					</a>
					<a
						href='https://polkasafe.hellonext.co/b/bugs-feedback'
						target='_blank'
						rel='noreferrer'
					>
						Feature Request
					</a>
				</div>
				<p className='md:hidden'>
					<sup>&#169;</sup>
					All Rights Reserved
				</p>
			</section>
		</AntdFooter>
	);
};

export default Footer;
