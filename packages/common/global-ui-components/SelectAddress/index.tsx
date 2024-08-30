import { IMultisig } from '@common/types/substrate';
import React, { useState } from 'react';
import { Form, Select } from 'antd';

interface ISelectAddress {
	multisigs: Array<IMultisig>;
}

function SelectAddress({ multisigs }: ISelectAddress) {
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
	const selectedMultisig = multisigs?.find(
		(multisig) => `${multisig.address}_${multisig.network}` === selectedAddressId
	);
	const handleChange = (value: string) => {
		setSelectedAddressId(value);
	};
	return (
		<>
			<Form.Item name='selectedMultisigAddress'>
				<Select
					placeholder='Select a person'
					onChange={handleChange}
					options={multisigs.map((multisig) => ({
						value: `${multisig.address}_${multisig.network}`,
						label: multisig.address
					}))}
				/>
			</Form.Item>
			{selectedMultisig && selectedMultisig?.proxy && (
				<Form.Item name='selectedProxy'>
					<Select
						placeholder='Select a Proxy'
						onChange={handleChange}
						options={selectedMultisig.proxy.map((proxy) => ({
							value: proxy.address,
							label: proxy.address
						}))}
					/>
				</Form.Item>
			)}
		</>
	);
}

export default SelectAddress;
