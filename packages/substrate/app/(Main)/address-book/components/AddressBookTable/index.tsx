'use client';

import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import Button from '@common/global-ui-components/Button';
import { IAddressBook } from '@common/types/substrate';
import { Skeleton, Table } from 'antd';
import { AddAddress } from '@common/modals/AddressBook/AddAddress';
import { RemoveAddress } from '@common/modals/AddressBook/RemoveAddress';
import { addToAddressBook } from '@sdk/polkasafe-sdk/src/add-to-address-book';
import { removeFromAddressBook } from '@sdk/polkasafe-sdk/src/remove-from-address-book';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { useSearchParams } from 'next/navigation';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';

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
			title: 'Address',
			dataIndex: 'address',
			key: 'address'
		},
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name'
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
			render: (data: any, allData: IAddressBook) => (
				<div className='flex gap-2'>
					<AddAddress
						title='Edit'
						onSubmit={handleAddressBook}
						addressBook={allData}
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
		address: item.address,
		name: item.name || DEFAULT_ADDRESS_NAME,
		email: item.email || '-',
		discord: item.discord || '-',
		telegram: item.telegram || '-',
		key: index
	}));

	return (
		<div>
			<AddAddress
				title='Add'
				onSubmit={handleAddressBook}
				addressBook={{
					address: '',
					name: '',
					email: '',
					discord: '',
					telegram: ''
				}}
			/>

			<Table
				pagination={false}
				dataSource={dataSource}
				columns={columns}
			/>
		</div>
	);
};
