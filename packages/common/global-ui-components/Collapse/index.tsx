import { Collapse as AntdCollapase, CollapseProps } from 'antd';
import { CircleArrowDownIcon } from '@common/global-ui-components/Icons';
import './style.css';

interface ICollapse extends CollapseProps {
	plain?: boolean;
}

function Collapse({ plain = false,  ...props }: ICollapse) {
	return (
		<AntdCollapase
			{...props}
			className={`${plain ? 'plain' : 'border'} ${props.className}`}
			// eslint-disable-next-line react/no-unstable-nested-components
			expandIcon={({ isActive }) => (
				<CircleArrowDownIcon className={`text-primary text-lg ${isActive ? 'rotate-[180deg]' : ''}`} />
			)}
		/>
	);
}

export default Collapse;
