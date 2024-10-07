import { ETransactionCreationType } from '@common/enum/substrate';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import NewTransaction from '@common/modals/NewTransaction';
import { Dropdown } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import { useState } from 'react';

export const TransactionDropdown = () => {
	const [transactionType, setTransactionType] = useState<ETransactionCreationType>(ETransactionCreationType.SEND_TOKEN);
	const [openModal, setOpenModal] = useState(false);

	const transactionTypes = Object.values(ETransactionCreationType).map((item) => ({
		key: item,
		label: <span className='text-white flex items-center gap-x-2'>{item}</span>
	}));
	return (
		<div className='w-full'>
			<Dropdown
				trigger={['click']}
				menu={{
					items: transactionTypes.filter((item) => item.key !== ETransactionCreationType.TELEPORT),
					onClick: (e) => {
						setOpenModal(true);
						setTransactionType(e.key as ETransactionCreationType);
					}
				}}
			>
				<Button
					variant={EButtonVariant.PRIMARY}
					fullWidth
					icon={<PlusCircleOutlined />}
					size='large'
				>
					New Transaction
				</Button>
			</Dropdown>
			<NewTransaction
				transactionType={transactionType}
				openModal={openModal}
				setOpenModal={setOpenModal}
			/>
		</div>
	);
};
