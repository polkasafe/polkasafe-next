import { IMultisig } from '@common/types/substrate';
import { useState } from 'react';
import { Select } from 'antd';
import { findMultisig } from '@common/utils/findMultisig';

interface IMultisigDropdown {
	multisigs: Array<IMultisig>;
	onChange: (multisig: IMultisig, proxyAddress?: string) => void;
}

export const MultisigDropdown = ({ multisigs, onChange }: IMultisigDropdown) => {
	const [selectedMultisig, setSelectedMultisig] = useState<IMultisig>(multisigs[0]);
	const [selectedProxy, setSelectedProxy] = useState<string | null>(selectedMultisig?.proxy?.[0]?.address || null);

	return (
		<>
			<Select
				defaultValue={`${selectedMultisig.address}_${selectedMultisig.network}`}
				placeholder='Select a person'
				onChange={(value) => {
					setSelectedMultisig(findMultisig(multisigs, value) as IMultisig);
					onChange(selectedMultisig, '');
				}}
				options={multisigs.map((multisig) => ({
					value: `${multisig.address}_${multisig.network}`,
					label: multisig.address
				}))}
			/>
			{selectedMultisig && selectedMultisig?.proxy && (
				<Select
					defaultValue={selectedProxy}
					placeholder='Select a Proxy'
					onChange={(value) => {
						setSelectedProxy(value);
						onChange(selectedMultisig, value);
					}}
					options={selectedMultisig.proxy.map((proxy) => ({
						value: `${proxy.address}`,
						label: proxy.address
					}))}
				/>
			)}
		</>
	);
};
