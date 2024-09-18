'use client';

import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import { IAddressBook } from '@common/types/substrate';
import { ConfigProvider, Skeleton, Table } from 'antd';
import { AddAddress } from '@common/modals/AddressBook/AddAddress';
import { RemoveAddress } from '@common/modals/AddressBook/RemoveAddress';
import { addToAddressBook } from '@sdk/polkasafe-sdk/src/add-to-address-book';
import { removeFromAddressBook } from '@sdk/polkasafe-sdk/src/remove-from-address-book';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useSearchParams } from 'next/navigation';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import Address from '@common/global-ui-components/Address';
import { Input } from 'antd';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { ExportArrowIcon } from '@common/global-ui-components/Icons';
const { Search } = Input;

export const AddressBookTable = () => {
	const [user] = useUser();
	const [organisation, setOrganisation] = useOrganisation();
	const organisationId = useSearchParams().get('_organisation');
	const handleAddressBook = async (value: IAddressBook) => {
		if (!user) {
			throw new Error('User not found');
		}

		if (!organisationId || !organisation) {
			throw new Error('Organisation not found');
		}
		const payload = {
			address: user.address,
			signature: user.signature,
			name: value.name,
			addressToAdd: value.address,
			email: value.email,
			discord: value.discord,
			telegram: value.telegram,
			nickName: value.nickName,
			organisationId
		};
		const { data } = (await addToAddressBook(payload)) as { data: { addressBook: Array<IAddressBook> } };
		if (data.addressBook) {
			console.log(data.addressBook);
			setOrganisation({ ...organisation, addressBook: data.addressBook });
		}
	};

	const handleDeleteAddress = async (address: string) => {
		if (!user) {
			throw new Error('User not found');
		}

		if (!organisationId || !organisation) {
			throw new Error('Organisation not found');
		}
		const payload = {
			address: user.address,
			signature: user.signature,
			addressToDelete: address,
			organisationId
		};
		const { data } = (await removeFromAddressBook(payload)) as { data: { addressBook: Array<IAddressBook> } };
		if (data.addressBook) {
			console.log(data.addressBook);
			setOrganisation({ ...organisation, addressBook: data.addressBook });
		}
	};

	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			fixed: 'left',
			width: 150,
			className: 'bg-[#20252E] text-white',
			render: (text: string) => (
				<span>
					{text.length > 5 ? `${text.substring(0, 7)}...` : text}
				</span>
			)
		},
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'address',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email'
		},
		{
			title: 'discord',
			dataIndex: 'discord',
			key: 'discord'
		},
		{
			title: 'telegram',
			dataIndex: 'telegram',
			key: 'telegram'
		},
		{
			title: 'Actions',
			dataIndex: 'actions',
			key: 'actions',
			fixed: 'right',
			className: 'bg-[#20252E] text-white',
			width: 100,
			render: (data: any, allData: IAddressBook) => (
				<div className='flex items-center justify-start gap-x-2'>
					<AddAddress
						title='Edit'
						onSubmit={handleAddressBook}
						addressBook={allData}
						isUsedInsideTable={true}
					/>
					<RemoveAddress onSubmit={() => handleDeleteAddress(allData.address)} />
				</div>
			)
		}
	];

	if (!organisation) {
		return <Skeleton />;
	}

	const dataSource = organisation?.addressBook.map((item, index) => ({
		address: (
			<Address
				address={item.address}
				onlyAddress
				isMultisig
				withBadge={false}
			/>
		),
		name: item.name || DEFAULT_ADDRESS_NAME,
		email: item.email || '-',
		discord: item.discord || '-',
		telegram: item.telegram || '-',
		key: index
	}));

	return (
		<div className='flex flex-col gap-y-6'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-x-2'>
				<ConfigProvider
					theme={{
						token: {
							colorBgContainer: '#24272E',
							controlHeight: 40,
							colorIcon: '#1573FE'
						}
					}}
				>
					<Search
						placeholder="input search text"
						allowClear
						onSearch={() => {}}
						style={{ width: 420, height: 40 }}
					/>
				</ConfigProvider>
				</div>
				<div className='flex items-center gap-x-3'>
					<Button
						variant={EButtonVariant.PRIMARY}
						disabled={true}
						icon={<ExportArrowIcon />}
						onClick={() => {}}
						className='text-[#1573FE] bg-[#1A2A42]'
						size='large'
					>
						Export
					</Button>
					<Button
						variant={EButtonVariant.PRIMARY}
						disabled={true}
						icon={<ExportArrowIcon className='rotate-180'/>}
						onClick={() => {}}
						className='text-[#1573FE] bg-[#1A2A42]'
						size='large'
					>
						Import
					</Button>
					<AddAddress
						title='Add Address'
						isUsedInsideTable={false}
						onSubmit={handleAddressBook}
						addressBook={{
							address: '',
							name: '',
							email: '',
							discord: '',
							telegram: ''
						}}
					/>
				</div>
			</div>

			<Table
				pagination={false}
				dataSource={dataSource}
				columns={columns}
				scroll={{ x: 1300 }}
			/>
		</div>
	);
};
