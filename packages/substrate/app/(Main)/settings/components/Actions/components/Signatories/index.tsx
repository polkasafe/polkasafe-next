import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import { UpdateMultisig } from '@common/modals/UpdateMultisig';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { IMultisig } from '@common/types/substrate';
import { findMultisig } from '@common/utils/findMultisig';
import { Select, Table } from 'antd';
import { useState } from 'react';
import Address from '@common/global-ui-components/Address';
import { organisationAtom } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAtomValue } from 'jotai';

interface ISignatories {
	multisigs: Array<IMultisig>;
}

const columns = [
	{
		title: 'Name',
		dataIndex: 'name',
		key: 'name'
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address'
	},
	{
		title: 'Actions',
		dataIndex: 'actions',
		key: 'actions'
	}
];

export const Signatories = ({ multisigs }: ISignatories) => {
	const organisation = useAtomValue(organisationAtom);
	const addresses = organisation?.addressBook || [];

	const [selectedMultisig, setSelectedMultisig] = useState<IMultisig>(multisigs[0]);
	const [selectedProxy, setSelectedProxy] = useState<string | null>(selectedMultisig?.proxy?.[0]?.address || null);

	const handleUpdateMultisig = async () => {};

	return (
		<div className='flex flex-col gap-4 pt-5'>
			<div className='flex flex-col gap-2'>
				<Typography
					variant={ETypographyVariants.p}
					className='uppercase'
				>
					Manage Signatories
				</Typography>
				<div className='flex gap-5'>
					<Select
						defaultValue={`${selectedMultisig.address}_${selectedMultisig.network}`}
						placeholder='Select a person'
						onChange={(value) => {
							const multisig = findMultisig(multisigs, value) as IMultisig;
							setSelectedMultisig(multisig);
							setSelectedProxy(multisig?.proxy?.filter((proxy) => Boolean(proxy.address))?.[0]?.address || null);
						}}
						options={multisigs.map((multisig) => ({
							value: `${multisig.address}_${multisig.network}`,
							label: (
								<Address
									address={multisig.address}
									network={multisig.network}
									isProxy={false}
									isMultisig={true}
									withBadge={false}
								/>
							)
						}))}
					/>
					{selectedMultisig && selectedMultisig?.proxy && selectedMultisig.proxy.length > 0 && (
						<Select
							placeholder='Select a Proxy'
							value={selectedProxy}
							onChange={(value) => setSelectedProxy(value)}
							options={selectedMultisig.proxy
								.map((proxy) =>
									proxy.address
										? {
												value: `${proxy.address}`,
												label: (
													<Address
														address={proxy.address}
														network={selectedMultisig.network}
														isProxy={true}
														isMultisig={false}
													/>
												)
											}
										: null
								)
								.filter((proxy) => proxy !== null)}
						/>
					)}
					{selectedProxy && (
						<UpdateMultisig
							multisig={selectedMultisig}
							proxyAddress={selectedProxy}
							onSubmit={handleUpdateMultisig}
							addresses={addresses}
						/>
					)}
				</div>
			</div>

			<Table
				rowClassName='bg-bg-main'
				className='w-full bg-bg-main'
				columns={columns}
				dataSource={selectedMultisig.signatories.map((signatory) => ({
					name: DEFAULT_ADDRESS_NAME,
					address: signatory,
					actions: ''
				}))}
				pagination={false}
			/>
		</div>
	);
};
