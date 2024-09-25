import { ENetwork, ETransactionOptions, ETransactionType, ETxType } from '@common/enum/substrate';
import Address from '@common/global-ui-components/Address';
import {
	CircleCheckIcon,
	CirclePlusIcon,
	CircleWatchIcon,
	OutlineCheckIcon,
	OutlineCloseIcon
} from '@common/global-ui-components/Icons';
import { ReviewModal } from '@common/global-ui-components/ReviewModal';
import { IReviewTransaction } from '@common/types/substrate';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import shortenAddress from '@common/utils/shortenAddress';
import { Divider, Timeline, Collapse } from 'antd';
import dayjs from 'dayjs';

interface ITransactionDetails {
	type: ETransactionOptions;
	createdAt: Date;
	amountToken: string | number;
	to: Array<{
		address: string;
		amount: number;
		currency: string;
	}>;
	network: ENetwork;
	from: string;
	transactionType: ETransactionType;
	approvals?: string[];
	signatories?: string[];
	threshold: number;
	hasApproved?: boolean;
	callHash: string;
	callData?: string;
	onAction: (actionType: ETxType) => Promise<{ error: boolean }>;
	reviewTransaction: IReviewTransaction | null;
	signTransaction: () => Promise<{ error: boolean }>;
}

export default function TransactionDetails({
	type,
	callHash,
	callData,
	createdAt,
	amountToken,
	to,
	network,
	from,
	transactionType,
	approvals,
	signatories,
	threshold,
	hasApproved,
	onAction,
	reviewTransaction,
	signTransaction
}: ITransactionDetails) {
	console.log(amountToken);
	return (
		<div className='p-4 bg-bg-secondary flex items-start gap-x-4'>
			<div className='rounded-xl p-4 bg-bg-main basis-2/3'>
				<p className='text-text-secondary font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'>
					{type === ETransactionOptions.RECEIVED ? 'RECEIVED FROM' : 'SEND FROM'}
				</p>
				<div className='border border-dashed border-text-disabled hover:border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'>
					<Address
						address={from}
						network={network}
					/>
				</div>
				<Divider className='border-text-disabled' />
				{to.length > 0 && to?.[0]?.address && (
					<p className='text-text-secondary font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'>
						{type === ETransactionOptions.RECEIVED ? 'RECEIVED TO' : 'SEND TO'}
					</p>
				)}
				<div className='flex flex-col gap-2'>
					{to &&
						to.length > 0 &&
						to.map((item, i) =>
							item.address && item.amount ? (
								<div key={`${item}_${i}`}>
									<div className='flex justify-between'>
										<div className='border border-dashed border-text-disabled hover:border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'>
											<Address
												address={item.address}
												network={network}
											/>
										</div>

										<div className='flex items-center justify-between'>
											<span className='text-white'>
												{item.amount} {item.currency}
											</span>
										</div>
									</div>
								</div>
							) : null
						)}
				</div>
				<Divider className='border-text-disabled' />
				<div className='flex flex-col gap-y-2'>
					<div className='flex items-center justify-between'>
						<span className='text-text-secondary'>Txn Hash</span>
						<span className='text-white'>{shortenAddress(callHash)}</span>
					</div>
					{callData && (
						<div className='flex items-center justify-between'>
							<span className='text-text-secondary'>Call Data</span>
							<span className='text-white'>{shortenAddress(callData)}</span>
						</div>
					)}
					<div className='flex items-center justify-between'>
						<span className='text-text-secondary'>Created on</span>
						<span className='text-white'>{dayjs(createdAt).format('DD MMM YYYY, hh:mm:ss A')}</span>
					</div>
				</div>
			</div>
			{type !== ETransactionOptions.RECEIVED && (
				<div className='rounded-xl p-4 bg-bg-main basis-1/3'>
					<div className='p-4'>
						<Timeline className=''>
							<Timeline.Item
								dot={
									<span className='bg-[#06d6a0]/[0.1] flex items-center justify-center p-1 rounded-md h-6 w-6'>
										<CirclePlusIcon className='text-success text-sm' />
									</span>
								}
								className='success'
							>
								<div className='text-white font-normal text-sm leading-[15px]'>Created</div>
							</Timeline.Item>
							<Timeline.Item
								dot={
									<span className='bg-[#06d6a0]/[0.1] flex items-center justify-center p-1 rounded-md h-6 w-6'>
										<CircleCheckIcon className='text-success text-sm' />
									</span>
								}
								className='success'
							>
								<div className='text-white font-normal text-sm leading-[15px]'>
									Confirmations{' '}
									<span className='text-text_secondary'>
										{transactionType === ETransactionType.HISTORY_TRANSACTION ? threshold : approvals?.length} of{' '}
										{threshold}
									</span>
								</div>
							</Timeline.Item>
							<Timeline.Item
								dot={
									<span className='bg-[#ff9f1c]/[0.1] flex items-center justify-center p-1 rounded-md h-6 w-6'>
										<CircleWatchIcon className='text-waiting text-sm' />
									</span>
								}
								className='warning'
							>
								<Collapse
									className='bg-transparent'
									bordered={false}
								>
									<Collapse.Panel
										showArrow={false}
										key={1}
										header={
											<span className='text-primary font-normal text-sm leading-[15px] px-3 py-2 rounded-md bg-highlight max-sm:text-xs'>
												Show All Confirmations
											</span>
										}
									>
										<Timeline>
											{approvals?.map((address, i) => (
												<Timeline.Item
													key={i}
													dot={
														<span className='bg-[#06d6a0]/[0.1] flex items-center justify-center p-1 rounded-md h-6 w-6'>
															<CircleCheckIcon className='text-success text-sm' />
														</span>
													}
													className={`${i === 0 && 'mt-4'} success bg-transaparent`}
												>
													<div className='mb-3 flex items-center gap-x-4 max-sm:text-xs'>
														<Address
															address={address}
															network={network}
														/>
													</div>
												</Timeline.Item>
											))}

											{signatories
												?.filter((item) => {
													const encodedApprovals = approvals?.map((a) => getEncodedAddress(a, network));
													return !encodedApprovals?.includes(getEncodedAddress(item, network));
												})
												.map((address, i) => {
													return (
														<Timeline.Item
															key={i}
															dot={
																<span className='bg-waiting bg-opacity-10 flex items-center justify-center p-1 rounded-md h-6 w-6'>
																	<CircleWatchIcon className='text-waiting text-sm' />
																</span>
															}
															className='warning bg-transaparent'
														>
															<div className='mb-3 flex items-center gap-x-4 relative'>
																<Address
																	address={address}
																	network={network}
																/>
															</div>
														</Timeline.Item>
													);
												})}
										</Timeline>
									</Collapse.Panel>
								</Collapse>
							</Timeline.Item>
							<Timeline.Item
								dot={
									<span className='bg-[#ff9f1c]/[0.1] flex items-center justify-center p-1 rounded-md h-6 w-6'>
										<CircleWatchIcon className='text-waiting text-sm' />
									</span>
								}
								className='warning'
							>
								<div className='text-white font-normal text-sm leading-[15px]'>
									<p>Executed</p>
									<div className='mt-2 text-text-secondary text-sm'>
										The transaction will be executed once the threshold is reached.
									</div>
								</div>
							</Timeline.Item>
						</Timeline>
					</div>
					{transactionType === ETransactionType.QUEUE_TRANSACTION && (
						<div className='mt-2 flex flex-col gap-y-4 px-2'>
							{!hasApproved && (
								<ReviewModal
									buildTransaction={() => onAction(ETxType.APPROVE)}
									reviewTransaction={reviewTransaction}
									signTransaction={signTransaction}
									className='bg-[#06d6a0]/[0.1] text-success'
									buttonIcon={<OutlineCheckIcon className='text-success' />}
								>
									Approve
								</ReviewModal>
							)}
							<ReviewModal
								buildTransaction={() => onAction(ETxType.CANCEL)}
								reviewTransaction={reviewTransaction}
								signTransaction={signTransaction}
								className='bg-[#e63946]/[0.1] text-text-danger'
								buttonIcon={<OutlineCloseIcon className='text-text-danger' />}
							>
								Reject
							</ReviewModal>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
