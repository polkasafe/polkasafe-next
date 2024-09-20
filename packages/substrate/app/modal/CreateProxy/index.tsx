import { ETransactionCalls, ETxType, Wallet } from '@common/enum/substrate';
import { ActionButtons } from '@common/global-ui-components/ActionButtons';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Modal from '@common/global-ui-components/Modal';
import { IMultisig } from '@common/types/substrate';
import { ApiPromise } from '@polkadot/api';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { ERROR_CODES } from '@substrate/app/global/genericErrors';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { generateCallData } from '@substrate/app/global/utils/generateCallData';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import { ReviewCreateProxy } from '@substrate/app/modal/CreateProxy/ReviewCreateProxy';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { notification } from '@common/utils/notification';
import { ERROR_MESSAGES } from '@common/utils/messages';

interface ICreateProxyModal {
	multisig: IMultisig;
}

export const CreateProxyModal = ({ multisig }: ICreateProxyModal) => {
	const [openModal, setOpenModal] = useState(false);
	const [loading, setLoading] = useState(false);
	const [callData, setCallData] = useState<string | null>(null);
	const [user] = useUser();

	const { getApi } = useAllAPI();

	const api = getApi(multisig.network)?.api;

	const handleCreate = async () => {
		if (!api || !api.isReady) {
			throw new Error(ERROR_CODES.API_NOT_CONNECTED);
		}
		if (!callData) {
			throw new Error(ERROR_CODES.TRANSACTION_FAILED);
		}
		if (!user) {
			throw new Error(ERROR_CODES.USER_NOT_FOUND_ERROR);
		}
		try {
			setLoading(true);
			const wallet = localStorage.getItem('logged_in_wallet') as Wallet;
			if (!wallet) {
				throw new Error('Wallet not found');
			}
			await initiateTransaction({
				wallet,
				type: ETxType.CREATE_PROXY,
				api: api as ApiPromise,
				data: null,
				multisig,
				sender: user.address,
				isProxy: false,
				calldata: callData
			});
			setOpenModal(false);
		} catch (error) {
			notification(ERROR_MESSAGES.CREATE_MULTISIG_FAILED);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		console.log('callData', callData);
		if (callData || !api || !api.isReady) {
			return;
		}
		(async () => {
			const callData = await generateCallData({
				multisig: multisig.address,
				api: api as ApiPromise,
				type: ETransactionCalls.PROXY
			});

			setCallData(callData);
		})();
	}, [callData, api]);

	return (
		<div className='w-full'>
			<Button
				onClick={() => setOpenModal(true)}
				variant={EButtonVariant.SECONDARY}
				className='text-sm text-text-label border-none'
				fullWidth
				size='large'
			>
				Create Proxy
			</Button>
			<Modal
				open={openModal}
				onCancel={() => setOpenModal(false)}
				title='Create Proxy'
			>
				<Spin spinning={loading || !callData}>
					<div className='flex flex-col gap-5 justify-between items-stretch'>
						{callData && (
							<ReviewCreateProxy
								multisig={multisig}
								callData={callData}
							/>
						)}
						<ActionButtons
							label='Create Proxy'
							disabled={!callData || loading}
							loading={loading}
							onClick={handleCreate}
						/>
					</div>
				</Spin>
			</Modal>
		</div>
	);
};
