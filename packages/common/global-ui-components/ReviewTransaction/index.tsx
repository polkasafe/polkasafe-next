import { DEFAULT_ADDRESS_NAME } from '@common/constants/defaults';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { ETransactionState } from '@common/enum/substrate';
import { ActionButtons } from '@common/global-ui-components/ActionButtons';
import Address from '@common/global-ui-components/Address';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { IReviewTransaction } from '@common/types/substrate';
import { useState } from 'react';
import ReactJson from 'react-json-view';
import { Spin } from 'antd';
import { ERROR_MESSAGES } from '@common/utils/messages';
import { useNotification } from '@common/utils/notification';

export const ReviewTransaction = () => {
	const { signTransaction, setTransactionState, reviewTransaction } = useDashboardContext();
	const { tx, from, to, proxyAddress, txCost } = reviewTransaction as IReviewTransaction;
	const [loading, setLoading] = useState(false);
	const notification = useNotification();

	const handleSignTransaction = async () => {
		try {
			setLoading(true);
			await signTransaction();
		} catch (error) {
			notification({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: error || error.message });
			console.error(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Spin spinning={loading}>
			<div className='flex flex-col gap-y-4'>
				<div className='max-h-52 overflow-auto'>
					<div className='p-2 w-full bg-bg-secondary rounded-xl'>
						<ReactJson
							src={tx}
							collapseStringsAfterLength={15}
							theme='bright'
							style={{ background: 'transparent' }}
						/>
					</div>
				</div>
				<div>
					<Typography
						variant={ETypographyVariants.p}
						className='text-label font-normal mb-2 text-xs leading-3 flex items-center justify-between max-sm:w-full'
					>
						Sending from
					</Typography>
					<div className='border border-dashed border-text-disabled hover:border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'>
						<Address
							address={proxyAddress || from.address}
							network={from.network}
							isProxy={Boolean(proxyAddress)}
							showNetworkBadge
							name={from.name || DEFAULT_ADDRESS_NAME}
						/>
					</div>
				</div>
				{to && (
					<div>
						<p className='text-label font-normal mb-2 text-xs leading-3 flex items-center justify-between max-sm:w-full'>
							Sending To
						</p>
						<div className='border border-dashed border-text-disabled hover:border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'>
							<Address
								address={to}
								network={from.network}
							/>
						</div>
					</div>
				)}
				{txCost && (
					<div>
						<p className='text-label font-normal mb-2 text-xs leading-3 flex items-center justify-between max-sm:w-full'>
							Transaction Cost
						</p>
						<div className='border border-dashed border-text-disabled hover:border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'>
							<Typography
								variant={ETypographyVariants.p}
								className='text-text-primary'
							>
								{txCost}
							</Typography>
						</div>
					</div>
				)}
				<div className='flex items-center gap-x-4 w-full'>
					<ActionButtons
						label='Sign Transaction'
						onClick={handleSignTransaction}
						disabled={false}
						onCancel={() => setTransactionState(ETransactionState.BUILD)}
					/>
				</div>
			</div>
		</Spin>
	);
};
