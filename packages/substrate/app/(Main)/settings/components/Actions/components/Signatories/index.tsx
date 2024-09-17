import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import { UpdateMultisig } from '@common/modals/UpdateMultisig';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { IMultisig } from '@common/types/substrate';
import { findMultisig } from '@common/utils/findMultisig';
import { Select, Table } from 'antd';
import { useState } from 'react';
import Address from '@common/global-ui-components/Address';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import { ETxType, Wallet } from '@common/enum/substrate';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { ApiPromise } from '@polkadot/api';

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
	const [organisation] = useOrganisation();
	const [user] = useUser();
	const { getApi } = useAllAPI();
	const addresses = organisation?.addressBook || [];

	const [selectedMultisig, setSelectedMultisig] = useState<IMultisig>(multisigs[0]);
	const [selectedProxy, setSelectedProxy] = useState<string | null>(selectedMultisig?.proxy?.[0]?.address || null);

	const handleUpdateMultisig = async (value: {
		signatories: Array<string>;
		threshold: number;
		proxyAddress?: string;
	}) => {
		const { signatories, threshold, proxyAddress } = value;
		if (
			selectedMultisig.signatories.sort().join(',') === signatories.sort().join(',') &&
			selectedMultisig.threshold === threshold
		) {
			throw new Error('No changes made');
		}

		const api = getApi(selectedMultisig.network);
		if (!api?.api || !user?.address) {
			throw new Error('API not found');
		}

		const wallet = (localStorage.getItem('wallet') as Wallet) || Wallet.POLKADOT;
		// add proxy to new multisig
		await initiateTransaction({
			wallet,
			type: ETxType.ADD_PROXY,
			api: api.api as ApiPromise,
			data: null,
			multisig: selectedMultisig,
			sender: user.address,
			proxyAddress,
			newSignatories: signatories,
			newThreshold: threshold
		});

		// remove proxy from old multisig
		await initiateTransaction({
			wallet,
			type: ETxType.REMOVE_PROXY,
			api: api.api as ApiPromise,
			data: null,
			multisig: selectedMultisig,
			sender: user.address,
			proxyAddress
		});
	};

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
