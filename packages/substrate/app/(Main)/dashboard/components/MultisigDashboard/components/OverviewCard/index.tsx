// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { DEFAULT_MULTISIG_NAME } from '@common/constants/defaults';
import { ENetwork, ETxType, Wallet } from '@common/enum/substrate';
import {
	BrainIcon,
	ChainIcon,
	CopyIcon,
	DonateIcon,
	PolkadotIcon,
	QRIcon,
	SubscanIcon
} from '@common/global-ui-components/Icons';
import NewTransaction from '@common/modals/NewTransaction';
import FundMultisig from '@common/modals/FundMultisig';
import { ICurrency, IMultisig, IProxy, ISendTransaction } from '@common/types/substrate';
import copyText from '@common/utils/copyText';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import shortenAddress from '@common/utils/shortenAddress';
import Identicon from '@polkadot/react-identicon';
import { useAssets } from '@substrate/app/atoms/assets/assetsAtom';
import { Skeleton, Spin, Tooltip } from 'antd';
import { useAtomValue } from 'jotai';
import { DashboardProvider } from '@common/context/DashboarcContext';
import { currencyAtom, selectedCurrencyAtom } from '@substrate/app/atoms/currency/currencyAtom';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';
import { useAllAPI } from '@substrate/app/global/hooks/useAllAPI';
import { useUser } from '@substrate/app/atoms/auth/authAtoms';
import { BN } from '@polkadot/util';
import { ApiPromise } from '@polkadot/api';
import { initiateTransaction } from '@substrate/app/global/utils/initiateTransaction';
import ReviewTransaction from '@substrate/app/(Main)/components/ReviewTransaction';
import { getReviewTxCallData } from '@substrate/app/global/utils/getReviewCallData';
import { newTransaction } from '@substrate/app/global/utils/newTransaction';
import { useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';

const ExternalLink = ({ network, address }: { network: ENetwork; address: string }) => (
	<div className='absolute right-5 top-5'>
		<div className='flex gap-x-4 items-center'>
			<a
				className='w-5'
				target='_blank'
				href='https://polkadot.js.org/apps/#/accounts'
				rel='noreferrer'
			>
				<PolkadotIcon />
			</a>
			<a
				className='w-5'
				target='_blank'
				href={`https://explorer.polkascan.io/${network}/account/${address}`}
				rel='noreferrer'
			>
				<BrainIcon />
			</a>
			<a
				className='w-5'
				target='_blank'
				href={`https://dotscanner.com/${network}/account/${address}?utm_source=polkadotjs`}
				rel='noreferrer'
			>
				<DonateIcon />
			</a>
			<a
				className='w-5'
				target='_blank'
				href={`https://${network}.polkaholic.io/account/${address}?group=overview&chainfilters=all`}
				rel='noreferrer'
			>
				<ChainIcon />
			</a>
			<a
				className='w-5'
				target='_blank'
				href={`https://${network}.subscan.io/account/${address}`}
				rel='noreferrer'
			>
				<SubscanIcon />
			</a>
		</div>
	</div>
);

interface IOverviewCardProps {
	name: string;
	address: string;
	threshold: number;
	signatories: Array<string>;
	network: ENetwork;
	className?: string;
}

function OverviewCard({ address, name, threshold, signatories, network, className }: IOverviewCardProps) {
	const [assets] = useAssets();
	const [user] = useUser();
	const [organisation] = useOrganisation();
	const currency = useAtomValue(selectedCurrencyAtom);
	const currencyValues = useAtomValue(currencyAtom);

	const { getApi, allApi } = useAllAPI();
	const proxyAddress = useSearchParams().get('_proxy');

	const multisig = organisation?.multisigs?.find((item) => item.address === address && item.network === network);
	const allProxies = multisig?.proxy || [];
	const proxy = allProxies.find((item) => item.address === proxyAddress);

	const getCallData = ({
		multisigDetails,
		recipientAndAmount
	}: {
		multisigDetails: { address: string; network: ENetwork; name: string; proxy?: string };
		recipientAndAmount: { recipient: string; amount: BN }[];
	}): string => {
		return getReviewTxCallData({
			multisigDetails,
			recipientAndAmount,
			getApi
		});
	};

	const handleNewTransaction = async (values: ISendTransaction) => {
		if (!user) {
			return;
		}
		await newTransaction(values, user, getApi);
	};

	const handleFundTransaction = async ({
		multisigAddress,
		amount,
		selectedProxy
	}: {
		amount: string;
		multisigAddress: IMultisig;
		selectedProxy?: string;
	}) => {
		if (!user) {
			return;
		}
		const { address } = user;
		const wallet = (localStorage.getItem('logged_in_wallet') as Wallet) || Wallet.POLKADOT;
		const apiAtom = getApi(multisigAddress.network);
		if (!apiAtom) {
			return;
		}
		const { api } = apiAtom as { api: ApiPromise };
		if (!api || !api.isReady) {
			return;
		}
		await initiateTransaction({
			wallet,
			type: ETxType.FUND,
			api,
			data: [{ amount: new BN(amount), recipient: multisigAddress.address }],
			isProxy: !!selectedProxy,
			proxyAddress: selectedProxy,
			multisig: multisigAddress,
			sender: address
		});
	};

	const selectedAddress = proxy?.address || address;
	const multiSigAssets = assets?.find((asset) => asset?.address === selectedAddress && asset?.network === network);

	return (
		<div className='flex flex-col h-full gap-4'>
			<Typography variant={ETypographyVariants.h1}>Overview</Typography>
			<div
				className={twMerge(
					'relative bg-bg-main flex flex-col justify-between rounded-3xl p-5 shadow-lg origin-top-left h-full',
					className
				)}
			>
				<ExternalLink
					address={selectedAddress}
					network={network}
				/>
				<div className='w-full'>
					<div className='flex gap-x-3 items-center'>
						<div className='relative'>
							<Identicon
								className={twMerge(
									`border-2 rounded-full bg-transparent border-primary p-1.5`,
									proxy && 'border-proxy-pink'
								)}
								value={selectedAddress}
								size={50}
								theme='substrate'
							/>
							<div
								className={twMerge(
									`bg-primary text-white text-sm rounded-lg absolute -bottom-0 left-[16px] px-2`,
									proxy && 'bg-proxy-pink'
								)}
							>
								{threshold}/{signatories.length}
							</div>
						</div>
						<div>
							<div className='text-base font-bold text-white flex items-center gap-x-2'>
								{name || DEFAULT_MULTISIG_NAME}
								<div
									className={twMerge(
										`px-2 py-[2px] rounded-md text-xs font-medium bg-primary text-white`,
										proxy && 'bg-proxy-pink text-black'
									)}
								>
									{proxy ? 'Proxy' : 'Multisig'}
								</div>
							</div>
							<div className='flex text-xs'>
								<div
									title={(selectedAddress && getEncodedAddress(selectedAddress, network)) || ''}
									className=' font-normal text-text_secondary'
								>
									{selectedAddress && shortenAddress(getEncodedAddress(selectedAddress, network) || '')}
								</div>
								<button
									className='ml-2 mr-1'
									onClick={() => copyText(selectedAddress, true, network)}
								>
									<CopyIcon className='text-primary' />
								</button>
								<Tooltip
									placement='right'
									className='cursor-pointer'
									title={
										<div className='p-2'>
											{/* <AddressQr
											size={100}
											address={address}
										/> */}
										</div>
									}
								>
									<QRIcon className='text-primary' />
								</Tooltip>
							</div>
						</div>
					</div>
				</div>
				<div className='flex gap-x-5 flex-wrap text-xs'>
					{!signatories ? (
						<Skeleton
							paragraph={{ rows: 1, width: 150 }}
							active
						/>
					) : (
						<>
							<div>
								<div className='text-white'>Signatories</div>
								<div className='font-bold text-lg text-primary'>{signatories.length || 0}</div>
							</div>
							<div>
								<div className='text-white'>Tokens</div>
								<div className='font-bold text-lg text-primary'>
									{!multiSigAssets ? <Spin size='default' /> : multiSigAssets.free}
								</div>
							</div>
						</>
					)}
				</div>
				<div className='flex justify-around w-full mt-5 gap-x-6'>
					<DashboardProvider
						onNewTransaction={handleNewTransaction}
						onFundMultisig={handleFundTransaction}
						assets={assets}
						currency={currency}
						currencyValues={currencyValues || ({} as ICurrency)}
						multisigs={multisig ? [multisig] : []}
						addressBook={organisation?.addressBook || []}
						allApi={allApi}
						getCallData={getCallData}
						ReviewTransactionComponent={(values) => <ReviewTransaction {...values} />}
					>
						<div className='flex w-full gap-6'>
							<NewTransaction />
							<FundMultisig />
						</div>
					</DashboardProvider>
				</div>
			</div>
		</div>
	);
}

export default OverviewCard;
