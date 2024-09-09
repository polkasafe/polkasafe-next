'use client';

import React, { PropsWithChildren } from 'react';
import { Layout as AntDLayout } from 'antd';
import PolkasafeLogo from '@common/assets/icons/polkasafe.svg';
import { LayoutWrapper } from '@common/global-ui-components/LayoutWrapper';

export const CreateOrganisationLayout = ({ children }: PropsWithChildren) => {
	return (
		<LayoutWrapper>
			<AntDLayout className='h-screen'>
				<div className='col-span-7 p-[30px] flex flex-col max-sm:col-span-11 max-sm:p-3'>
					<div className='flex justify-end w-full mb-5'>
						<div className=''>
							<PolkasafeLogo />
						</div>
					</div>
					<AntDLayout.Content className='bg-bg-main p-[30px] h-full rounded-xl'>{children}</AntDLayout.Content>
				</div>
			</AntDLayout>
		</LayoutWrapper>
	);
};
