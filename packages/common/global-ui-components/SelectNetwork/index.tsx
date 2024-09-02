import { Form, Select } from 'antd';
import { ENetwork } from '@common/enum/substrate';

interface ISelectNetwork {
	networks: Array<ENetwork>;
	onChange?: (value: string) => void;
}

export function SelectNetwork({ networks, onChange }: ISelectNetwork) {
	return (
		<Form.Item name='network'>
			<Select
				placeholder='Select Network'
				options={networks.map((network) => ({
					value: network,
					label: network
				}))}
				onChange={onChange ?? (() => {})}
			/>
		</Form.Item>
	);
}
