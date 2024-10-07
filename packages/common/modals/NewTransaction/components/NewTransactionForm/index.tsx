import { FormInstance } from 'antd';
import BN from 'bn.js';
import { ETransactionCreationType } from '@common/enum/substrate';

import './style.css';
import SetIdentity from '@common/modals/NewTransaction/components/NewTransactionForm/components/SetIdentity';
import { Delegation } from '@common/modals/NewTransaction/components/NewTransactionForm/components/Delegation';
import { SendTokens } from '@common/modals/NewTransaction/components/NewTransactionForm/components/SendToken';
import { TeleportAssets } from '@common/modals/NewTransaction/components/NewTransactionForm/components/TeleportAssets';

export enum ETransactionSteps {
	BUILD_TRANSACTION = 'New Transaction',
	REVIEW_TRANSACTION = 'Review Transaction'
}
export interface IRecipientAndAmount {
	recipient: string;
	amount: BN;
	currency: string;
}

export function NewTransactionForm({
	onClose,
	form,
	type
}: {
	onClose: () => void;
	form: FormInstance;
	type: ETransactionCreationType;
}) {
	return (
		<div className='w-full h-full flex flex-col justify-center items-center'>
			{type === ETransactionCreationType.DELEGATE && (
				<Delegation
					onClose={onClose}
					form={form}
				/>
			)}

			{type === ETransactionCreationType.SET_IDENTITY && (
				<SetIdentity
					onClose={onClose}
					form={form}
				/>
			)}
			{type === ETransactionCreationType.TELEPORT && (
				<TeleportAssets
					onClose={onClose}
					form={form}
				/>
			)}
			{type === ETransactionCreationType.SEND_TOKEN && (
				<SendTokens
					onClose={onClose}
					form={form}
				/>
			)}
		</div>
	);
}
