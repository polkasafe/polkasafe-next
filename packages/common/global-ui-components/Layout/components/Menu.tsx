// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import Link from 'next/link';
import PolkasafeLogo from '@common/assets/icons/polkasafe.svg';
import { usePathname } from 'next/navigation';
import { menuItems } from '@common/global-ui-components/Layout/utils/menuItems';
import MenuItem from '@common/global-ui-components/Layout/components/MenuItem';
// import Image from 'next/image';
// import emptyImage from '@common/assets/icons/empty-image.png';
// import { CircleArrowDownIcon, UserPlusIcon } from '@common/global-ui-components/Icons';
// import { Dropdown } from 'antd';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai/react';
import AddMultisig from '@common/global-ui-components/AddMultisig';
import MultisigList from '@common/global-ui-components/MultisigList';
import { Skeleton } from 'antd';
import { ScaleMotion } from '@common/global-ui-components/Motion/Scale';

const getPath = (basePath: string) => {
	return basePath;
};

interface IMenuProps {
	userAddress: string;
}

const styles = {
	menu: 'text-xs font-normal text-text-secondary uppercase ml-4'
};

const Menu = ({ userAddress }: IMenuProps) => {
	const pathname = usePathname();
	const organisation = useAtomValue(organisationAtom);
	const { multisigs = [] } = organisation || {};

	return (
		<div className='bg-bg-main flex flex-col h-full py-4 px-3 max-sm:px-0 max-sm:py-0'>
			<div className='flex flex-col mb-3 max-sm:mb-1 overflow-y-hidden overflow-x-hidden'>
				<ScaleMotion>
					<section className='flex mb-7 justify-center w-full'>
						<Link
							className='text-white'
							href={getPath('/')}
						>
							<PolkasafeLogo />
						</Link>
					</section>
				</ScaleMotion>

				<section className='flex-1 flex flex-col overflow-y-hidden overflow-x-hidden'>
					<h2 className={styles.menu}>Menu</h2>
					<ul className='flex flex-1 flex-col py-2 text-white list-none max-sm:h-80'>
						{menuItems.map((item) => {
							return (
								<MenuItem
									key={item.title}
									baseURL={item.baseURL}
									authenticated={Boolean(userAddress)}
									icon={item.icon}
									pathname={pathname}
									isNew={item.isNew}
									title={item.title}
								/>
							);
						})}
					</ul>
				</section>
			</div>
			{organisation ? (
				<MultisigList multisigs={multisigs} />
			) : (
				<Skeleton
					loading
					active
					avatar
				/>
			)}

			{userAddress && <AddMultisig />}
		</div>
	);
};

export default Menu;
