import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import Address from '@common/global-ui-components/Address';
import { ENetwork, ETransactionOptions, ETransactionType, ETxType } from '@common/enum/substrate';
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import {
	ArrowDownLeftIcon,
	ArrowUpRightIcon,
	OutlineCheckIcon,
	OutlineCloseIcon
} from '@common/global-ui-components/Icons';
import dayjs from 'dayjs';
import { ReviewModal } from '@common/global-ui-components/ReviewModal';
import { IReviewTransaction } from '@common/types/substrate';

interface ITransactionHeadProps {
	type: ETransactionOptions;
	createdAt: Date;
	amountToken: number | string;
	to: Array<{
		address: string;
		amount: number;
		currency: string;
	}>;
	network: ENetwork;
	from: string;
	label: string;
	transactionType: ETransactionType;
	isHomePage?: boolean;
	approvals?: string[];
	threshold?: number;
	hasApproved?: boolean;
	onAction: (actionType: ETxType) => Promise<{ error: boolean }>;
	reviewTransaction: IReviewTransaction | null;
	signTransaction: () => Promise<{ error: boolean }>;
	isSignatory?: boolean;
	initiator: boolean;
}

function TransactionIcon({ type }: { type: ETransactionOptions }) {
	switch (type) {
		case ETransactionOptions.SENT: {
			return (
				<div className='bg bg-[#e63946]/[0.1] p-2.5 rounded-lg text-failure'>
					<ArrowUpRightIcon />
				</div>
			);
		}
		case ETransactionOptions.RECEIVED: {
			return (
				<div className='bg bg-bg-success p-2.5 rounded-lg text-success'>
					<ArrowDownLeftIcon />
				</div>
			);
		}
		case ETransactionOptions.CREATE_PROXY: {
			break;
		}
		case ETransactionOptions.EDIT_SIGNATORY: {
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
	isHomePage = false,
	approvals,
	threshold,
	hasApproved,
	onAction,
	reviewTransaction,
	signTransaction,
	isSignatory,
	initiator
}: ITransactionHeadProps) {
	const allRecipes = to?.map((recipe) => recipe.address);
	const allAmountsAndCurrency = to?.map((recipe) => ({ amount: recipe?.amount, currency: recipe?.currency }));
	return (
		<div className={isHomePage ? 'border-b border-text-secondary p-3 mr-2' : ''}>
			<div className='flex items-center max-sm:flex max-sm:flex-wrap max-sm:gap-2'>
				<Typography
					variant={ETypographyVariants.p}
					className='flex items-center gap-x-3 basis-1/5 justify-start'
				>
					<TransactionIcon type={type} />
					{label ? (
						<div className='flex'>
							<Typography
								variant={ETypographyVariants.p}
								className='capitalize text-text-primary text-sm'
							>
								{label}
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
					{allAmountsAndCurrency.length &&
					String(allAmountsAndCurrency?.[0].amount) !== '0' &&
					allAmountsAndCurrency?.[0].currency ? (
						<div className='flex items-center gap-x-2'>
							<span
								className={`font-normal text-xs text-success ${type === ETransactionOptions.SENT && 'text-text-danger'}`}
							>
								{allAmountsAndCurrency?.[0].amount} {allAmountsAndCurrency?.[0]?.currency}
							</span>
							{Boolean(allAmountsAndCurrency.length - 1) && `+${allAmountsAndCurrency.length - 1}`}
						</div>
					) : Boolean(amountToken) && Number(amountToken) ? (
						<Typography
							variant={ETypographyVariants.p}
							className='flex items-center gap-x-2 justify-start text-text-primary'
						>
							<ParachainTooltipIcon src={networkConstants[network]?.logo} />
							<span
								className={`font-normal text-xs text-success ${type === ETransactionOptions.SENT && 'text-text-danger'}`}
							>
								{type === ETransactionOptions.SENT ? '-' : '+'} {amountToken} {networkConstants[network].tokenSymbol}
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
					{allRecipes && allRecipes.length > 0 ? (
						<div className='flex items-center gap-x-2'>
							<Address
								address={allRecipes?.[0]}
								network={network}
								withBadge={false}
								isMultisig
							/>
							{Boolean(allRecipes.length - 1) && `+${allRecipes.length - 1}`}
						</div>
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
				{ETransactionType.QUEUE_TRANSACTION === transactionType && isSignatory ? (
					<div className='flex items-center gap-x-4 basis-1/5 justify-start'>
						{!isHomePage && (
							<div className='flex items-center gap-x-4'>
								{!isHomePage && (
									<Typography
										variant={ETypographyVariants.p}
										className='text-waiting'
									>
										{!hasApproved ? 'Awaiting your Confirmation' : `(${approvals?.length}/${threshold})`}
									</Typography>
								)}
								{!hasApproved && isHomePage && (
									<ReviewModal
										buildTransaction={() => onAction(ETxType.APPROVE)}
										reviewTransaction={reviewTransaction}
										signTransaction={signTransaction}
										className='w-auto min-w-0 bg-[#06d6a0]/[0.1] text-success'
										size='middle'
									>
										<OutlineCheckIcon />
									</ReviewModal>
								)}
							</div>
						)}
						{isHomePage && !hasApproved && (
							<ReviewModal
								buildTransaction={() => onAction(ETxType.APPROVE)}
								reviewTransaction={reviewTransaction}
								signTransaction={signTransaction}
								className='w-auto min-w-0 bg-[#06d6a0]/[0.1] text-success'
								size='middle'
							>
								<OutlineCheckIcon />
							</ReviewModal>
						)}

						{isHomePage && initiator && (
							<ReviewModal
								buildTransaction={() => onAction(ETxType.CANCEL)}
								reviewTransaction={reviewTransaction}
								signTransaction={signTransaction}
								className='w-auto min-w-0 bg-[#e63946]/[0.1] text-text-danger'
								size='middle'
							>
								<OutlineCloseIcon />
							</ReviewModal>
						)}
					</div>
				) : ETransactionType.HISTORY_TRANSACTION !== transactionType ? (
					<Typography
						variant={ETypographyVariants.p}
						className='flex items-center gap-x-4 basis-1/5 '
					>
						Not a signatories
					</Typography>
				) : null}
			</div>
		</div>
	);
}
