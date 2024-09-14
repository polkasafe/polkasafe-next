// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DEFAULT_MULTISIG_NAME } from "@common/constants/defaults";
import Address from "@common/global-ui-components/Address";
import Typography, { ETypographyVariants } from "@common/global-ui-components/Typography";
import { IMultisig } from "@common/types/substrate";

const columns = [
	{
		title: 'Name',
		variant: ETypographyVariants.p
	},
	{
		title: 'Address',
		variant: ETypographyVariants.p
	},
];

function QuickMultisigs({ multisigs }: { multisigs: IMultisig[] }) {
	return <>
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
				{multisigs.map((item) => (
					<div className='border-b border-text-secondary p-3 mr-2 flex items-center'>
						<div className="basis-2/6">
							{item.name || DEFAULT_MULTISIG_NAME}
						</div>
						<div className="basis-2/6">
							<Address address={item.address} onlyAddress isMultisig network={item.network} withBadge={false} />
						</div>
					</div>
				))}
			</div>
	</>;
}

export default QuickMultisigs;
