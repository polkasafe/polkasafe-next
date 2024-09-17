// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import { organisationAtom, useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import Address from '@common/global-ui-components/Address';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { DeleteIcon, EditIcon } from '@common/global-ui-components/Icons';
import { StringifyOptions } from 'node:querystring';

const columns = [
	{
		title: 'Name',
		variant: ETypographyVariants.p
	},
	{
		title: 'Address',
		variant: ETypographyVariants.p
	},
	{
		title: 'Action',
		variant: ETypographyVariants.p
	}
];

interface IMembers {
	members: Array<string>;
}

function Members({ members }: IMembers) {
	const [organisation] = useOrganisation();

	const getNameByAddress = (address: string) => {
		const entry = organisation?.addressBook?.find((item) => item.address === address);
		return entry ? entry.name : DEFAULT_ADDRESS_NAME;
	};

	return (
		<>
			<div className='flex bg-bg-secondary my-1 p-3 rounded-lg mr-1'>
				{columns.map((column) => (
					<Typography
						key={column.title}
						variant={column.variant}
						className='basis-2/6 text-base'
					>
						{column.title}
					</Typography>
				))}
			</div>
			<div className='max-h-72 overflow-x-hidden overflow-y-auto flex flex-col gap-3'>
				{members.map((item) => (
					<div className='border-b border-text-secondary p-3 mr-2 flex items-center'>
						<div className='basis-2/6'>{getNameByAddress(item)}</div>
						<div className='basis-2/6'>
							<Address
								address={item}
								onlyAddress
								isMultisig
								withBadge={false}
							/>
						</div>
						<div className='flex gap-x-2 basis-2/6'>
							<Button
								size='small'
								variant={EButtonVariant.SECONDARY}
								onClick={() => {}}
								className='bg bg-[#1A2A42]/[0.1] p-2.5 rounded-lg text-[#3F8CFF] border-none'
							>
								<EditIcon />
							</Button>
							<Button
								size='small'
								variant={EButtonVariant.SECONDARY}
								onClick={() => {}}
								className='bg bg-[#e63946]/[0.1] p-2.5 rounded-lg text-failure border-none'
							>
								<DeleteIcon />
							</Button>
						</div>
					</div>
				))}
			</div>
		</>
	);
}

export default Members;
