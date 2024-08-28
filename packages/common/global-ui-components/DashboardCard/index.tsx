'use client';

import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import FundMultisig from '@common/modals/FundMultisig';
import NewTransaction from '@common/modals/NewTransaction';
import EyeIcon from '@common/assets/icons/eye.svg';
import { getCurrencySymbol } from '@common/utils/getCurrencySymbol';
import SelectCurrency from '@common/global-ui-components/SelectCurrency';
import { useDashboardContext } from '@common/context/DashboarcContext';

function DashboardCard() {
	const { assets, currency } = useDashboardContext();
	const totalBalance = assets?.reduce((acc, asset) => acc + (Number(asset?.usd) || 0), 0);
	const symbol = getCurrencySymbol(currency);

	return (
		<div className='overflow-hidden'>
			<div className='relative'>
				<div className='absolute bg-circle-gradient rounded-full w-[30%] h-80 left-[30%] top-10' />
			</div>
			<div className='bg-custom-gradient rounded-3xl px-7 p-6 text-white shadow-lg w-full flex flex-col gap-5'>
				<div className='flex flex-col gap-2'>
					<div className='flex justify-between items-center'>
						<Typography
							variant={ETypographyVariants.p}
							className='text-sm text-text-secondary capitalize'
						>
							Total Balance
						</Typography>
						<SelectCurrency transparent />
					</div>
					<div className='flex gap-4 items-baseline'>
						<Typography
							variant={ETypographyVariants.p}
							className='text-4xl text-text-primary capitalize font-raleway'
						>
							{symbol}
							{totalBalance}
						</Typography>
						<EyeIcon />
					</div>
				</div>
				<div className='flex gap-3 items-center'>
					{/* <Typography
						variant={ETypographyVariants.p}
						className='text-base text-text-success capitalize font-raleway'
					>
						{lastTransactionsValue > 0 ? '+' : '-'} {symbol}
						{Math.abs(lastTransactionsValue)}
					</Typography> */}
					<Typography
						variant={ETypographyVariants.p}
						className='text-xs text-text-primary border-2 inline-block px-2 py-1 rounded-lg uppercase font-semibold'
					>
						24h
					</Typography>
				</div>

				<div className='flex gap-6'>
					<NewTransaction />
					<FundMultisig />
				</div>
			</div>
		</div>
	);
}

export default DashboardCard;
