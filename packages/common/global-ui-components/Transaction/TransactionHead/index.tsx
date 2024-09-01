import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import Address from '@common/global-ui-components/Address';
import { ENetwork, ETransactionOptions, ETransactionType } from '@common/enum/substrate';
import ReceivedIcon from '@common/assets/icons/arrow-up-right.svg';
import SentIcon from '@common/assets/icons/sent-icon.svg';
import { networkConstants } from '@common/constants/substrateNetworkConstant';

interface ITransactionHeadProps {
	type: ETransactionOptions;
	createdAt: Date;
	amountToken: string;
	to: string;
	network: ENetwork;
	from: string;
	label: Array<string>;
	transactionType: ETransactionType;
}

function TransactionIcon({ type }: { type: ETransactionOptions }) {
	switch (type) {
		case ETransactionOptions.SENT: {
			return (
				<div className='bg bg-bg-success p-2.5 rounded-lg text-red-500'>
					<SentIcon />
				</div>
			);
		}
		case ETransactionOptions.RECEIVED: {
			return (
				<div className='bg bg-bg-success p-2.5 rounded-lg text-green-500'>
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
	transactionType
}: ITransactionHeadProps) {
	return (
		<div className='bg-bg-secondary rounded-xl p-3 mr-2'>
			<div className='flex items-center max-sm:flex max-sm:flex-wrap max-sm:gap-2'>
				<Typography
					variant={ETypographyVariants.p}
					className='flex items-center gap-x-3 basis-1/6 justify-start text-text-primary'
				>
					<TransactionIcon type={type} />
					{label ? (
						<div className='flex flex-col'>
							<Typography
								variant={ETypographyVariants.p}
								className='capitalize text-[10px]'
							>
								{label[0]}
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
					{Boolean(amountToken) && Number(amountToken) && (
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
					)}
				</Typography>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/6 justify-start text-text-primary flex items-center gap-2'
				>
					<Address
						address={from}
						network={network}
						withBadge={false}
						isMultisig
					/>
				</Typography>
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/6 justify-start text-text-primary flex items-center gap-2'
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
				<Typography
					variant={ETypographyVariants.p}
					className='basis-1/6 justify-start text-text-primary'
				>
					{createdAt.toLocaleString()}
				</Typography>
				{/* TODO: need to add category */}
				<Typography
					variant={ETypographyVariants.p}
					className='flex items-center gap-x-4 basis-1/6 justify-start'
				>
					Category
				</Typography>
				{ETransactionType.HISTORY_TRANSACTION === transactionType && (
					<Typography
						variant={ETypographyVariants.p}
						className='flex items-center gap-x-4 basis-1/6 justify-start'
					>
						<span className='text-success'>Success</span>
					</Typography>
				)}
				{ETransactionType.QUEUE_TRANSACTION === transactionType && (
					<Typography
						variant={ETypographyVariants.p}
						className='flex items-center gap-x-4 basis-1/6 justify-start'
					>
						<span className='text-warning'>Pending</span>
					</Typography>
				)}
			</div>
		</div>
	);
}
