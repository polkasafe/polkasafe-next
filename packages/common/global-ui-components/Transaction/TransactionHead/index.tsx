import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import Address from '@common/global-ui-components/Address';
import { ENetwork, ETransactionOptions, ETransactionType, ETxType } from '@common/enum/substrate';
import ReceivedIcon from '@common/assets/icons/arrow-up-right.svg';
import SentIcon from '@common/assets/icons/sent-icon.svg';
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import Button from '@common/global-ui-components/Button';
import { OutlineCheckIcon, OutlineCloseIcon } from '@common/global-ui-components/Icons';
import dayjs from 'dayjs';

interface ITransactionHeadProps {
	type: ETransactionOptions;
	createdAt: Date;
	amountToken: string;
	to: string;
	network: ENetwork;
	from: string;
	label: Array<string>;
	transactionType: ETransactionType;
	onAction: (actionType: ETxType) => void;
	isHomePage?: boolean;
	approvals?: string[];
	threshold?: number;
	hasApproved?: boolean;
}

function TransactionIcon({ type }: { type: ETransactionOptions }) {
	switch (type) {
		case ETransactionOptions.SENT: {
			return (
				<div className='bg bg-[#e63946]/[0.1] p-2.5 rounded-lg text-failure'>
					<SentIcon />
				</div>
			);
		}
		case ETransactionOptions.RECEIVED: {
			return (
				<div className='bg bg-bg-success p-2.5 rounded-lg text-success'>
					<ReceivedIcon />
				</div>
			);
		}
		case ETransactionOptions.CREATE_PROXY: {
			break;
		}
		case ETransactionOptions.REMOVE_SIGNATORY: {
			break;
		}
		case ETransactionOptions.ADD_SIGNATORY: {
			break;
		}
		default: {
			break;
		}
	}
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export function TransactionHead({
	label,
	type,
	amountToken,
	from,
	to,
	createdAt,
	network,
	transactionType,
	onAction,
	isHomePage = false,
	approvals,
	threshold,
	hasApproved
}: ITransactionHeadProps) {
	return (
		<div className={isHomePage ? 'border-b border-text-secondary p-3 mr-2' : ''}>
			<div className='flex items-center max-sm:flex max-sm:flex-wrap max-sm:gap-2'>
				<Typography
					variant={ETypographyVariants.p}
					className='flex items-center gap-x-3 basis-1/5 justify-start text-text-primary'
				>
					<TransactionIcon type={type} />
					{label ? (
						<div className='flex'>
							<Typography
								variant={ETypographyVariants.p}
								className='capitalize text-[10px]'
							>
								{label[0]}.
							</Typography>
							<Typography
								variant={ETypographyVariants.p}
								className='capitalize text-[10px]'
							>
								{label[1]}
							</Typography>
						</div>
					) : (
						<span className='capitalize'>{type}</span>
					)}
				</Typography>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/5 justify-start text-text-primary flex items-center gap-2'
				>
					{Boolean(amountToken) && Number(amountToken) ? (
						<Typography
							variant={ETypographyVariants.p}
							className='flex items-center gap-x-2 justify-start text-text-primary'
						>
							{Boolean(amountToken) && <ParachainTooltipIcon src={networkConstants[network]?.logo} />}
							<span
								className={`font-normal text-xs text-success ${type === ETransactionOptions.SENT && 'text-failure'}`}
							>
								{type === ETransactionOptions.SENT || !amountToken ? '-' : '+'} {Boolean(amountToken) && amountToken}{' '}
								{Boolean(amountToken) || networkConstants[network].tokenSymbol}
							</span>
						</Typography>
					) : (
						<Typography variant={ETypographyVariants.h1}>-</Typography>
					)}
				</Typography>
				{isHomePage && (
					<Typography
						variant={ETypographyVariants.p}
						className='basis-1/5 justify-start text-text-primary flex items-center gap-2'
					>
						<Address
							address={from}
							network={network}
							withBadge={false}
							isMultisig
						/>
					</Typography>
				)}
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/5 justify-start text-text-primary flex items-center gap-2'
				>
					{to ? (
						<Address
							address={to}
							network={network}
							withBadge={false}
							isMultisig
						/>
					) : (
						<Typography variant={ETypographyVariants.h1}>-</Typography>
					)}
				</Typography>
				{!isHomePage && (
					<Typography
						variant={ETypographyVariants.p}
						className='basis-1/5 justify-start text-text-primary flex items-center gap-2'
					>
						{dayjs(createdAt).format('MM/DD/YYYY, hh:mm A')}
					</Typography>
				)}
				{ETransactionType.HISTORY_TRANSACTION === transactionType && (
					<Typography
						variant={ETypographyVariants.p}
						className='flex items-center gap-x-4 basis-1/5 justify-start'
					>
						<span className='text-success'>Success</span>
					</Typography>
				)}
				{ETransactionType.QUEUE_TRANSACTION === transactionType && (
					<div className='flex items-center gap-x-4 basis-1/5 justify-end'>
						<div className='flex items-center gap-x-4'>
							{!isHomePage && (
								<Typography
									variant={ETypographyVariants.p}
									className='text-waiting'
								>
									{!hasApproved ? 'Awaiting your Confirmation' : `(${approvals?.length}/${threshold})`}
								</Typography>
							)}
							{!hasApproved && 
								<Button
									onClick={() => onAction(ETxType.APPROVE)}
									className='text-success bg-[#06d6a0]/[0.1] flex items-center justify-center p-1 sm:p-2 rounded-md sm:rounded-lg text-xs sm:text-sm w-6 h-6 sm:w-8 sm:h-8 border-none outline-none'
								>
									<OutlineCheckIcon />
								</Button>
							}
						</div>
						{isHomePage && (
							<Button
								onClick={() => onAction(ETxType.CANCEL)}
								className='text-failure bg-[#e63946]/[0.1] flex items-center justify-center p-1 sm:p-2 rounded-md sm:rounded-lg text-xs sm:text-sm w-6 h-6 sm:w-8 sm:h-8 border-none outline-none'
							>
								<OutlineCloseIcon />
							</Button>
						)}
					</div>
				)}
			</div>
		</div>
	);
}
