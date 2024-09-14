// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

'use client';

import { DEFAULT_MULTISIG_NAME } from '@common/constants/defaults';
import { ENetwork } from '@common/enum/substrate';
import AddressQr from '@common/global-ui-components/AddressQR';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import {
	BrainIcon,
	ChainIcon,
	CopyIcon,
	DonateIcon,
	PolkadotIcon,
	QRIcon,
	SubscanIcon,
	WalletIcon
} from '@common/global-ui-components/Icons';
import NewTransaction from '@common/modals/NewTransaction';
import { IProxy } from '@common/types/substrate';
import copyText from '@common/utils/copyText';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import shortenAddress from '@common/utils/shortenAddress';
import Identicon from '@polkadot/react-identicon';
import { assetsAtom } from '@substrate/app/atoms/assets/assetsAtom';
import { Skeleton, Spin, Tooltip } from 'antd';
import { useAtomValue } from 'jotai';

interface IOverviewCardProps {
	name: string;
	address: string;
	threshold: number;
	signatories: Array<string>;
	balance: string;
	network: ENetwork;
	createdAt?: Date;
	updatedAt?: Date;
	proxy?: Array<IProxy>;
	className?: string;
}

function OverviewCard({
	address,
	name,
	threshold,
	signatories,
	balance,
	network,
	createdAt,
	updatedAt,
	proxy,
	className
}: IOverviewCardProps) {
	const assets = useAtomValue(assetsAtom);
	const multiSigAssets = assets?.find((asset) => asset?.address === address && asset?.network === network);

	console.log('assets', assets);
	return (
		<>
			<h2 className='text-base font-bold text-white mb-2'>Overview</h2>
			<div
				className={`${className} relative bg-bg-main flex flex-col justify-between rounded-lg p-5 shadow-lg h-[17rem] scale-90 w-[111%] origin-top-left`}
			>
				<div className='absolute right-5 top-5'>
					<div className='flex gap-x-4 items-center'>
						{/* <Tooltip title='Copy Share Link'>
						<button
							className='text-text_secondary text-lg'
							onClick={() =>
								copyText(`${baseURL}/watch?multisig=${activeMultisig}&network=${currentMultisig?.network}`)
							}
						>
							<ShareAltOutlined />
						</button>
					</Tooltip> */}
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
				<div className='w-full'>
					<div className='flex gap-x-3 items-center'>
						<div className='relative'>
							<Identicon
								className={`border-2 rounded-full bg-transparent ${'border-primary'} p-1.5`}
								value={address}
								size={50}
								theme='polkadot'
							/>
							<div className={`${'bg-primary text-white'} text-sm rounded-lg absolute -bottom-0 left-[16px] px-2`}>
								{threshold}/{signatories.length}
							</div>
						</div>
						<div>
							<div className='text-base font-bold text-white flex items-center gap-x-2'>
								{name || DEFAULT_MULTISIG_NAME}
								<div className={`px-2 py-[2px] rounded-md text-xs font-medium ${'bg-primary text-white'}`}>
									{'Multisig'}
								</div>
								{/* {hasProxy && (
								<Tooltip title='Switch Account'>
									{hasProxy &&
									currentMultisig.proxy &&
									typeof currentMultisig.proxy !== 'string' &&
									currentMultisig.proxy.length > 0 ? (
										<Popover
											placement='bottomLeft'
											trigger='click'
											content={
												<>
													<span
														onClick={(e) => {
															e.stopPropagation();
															setUserDetailsContextState((prev) => ({
																...prev,
																isProxy: false
															}));
														}}
														className='cursor-pointer'
													>
														<AddressComponent
															address={currentMultisig.address}
															showNetworkBadge
															withBadge={false}
															network={currentMultisig?.network}
														/>
													</span>
													{currentMultisig.proxy?.map(({ address, name }) => (
														<>
															<div />
															<span
																onClick={(e) => {
																	e.stopPropagation();
																	setUserDetailsContextState((prev) => ({
																		...prev,
																		isProxy: true,
																		selectedProxy: address
																	}));
																}}
															>
																<AddressComponent
																	address={address}
																	isProxy
																	name={name}
																	showNetworkBadge
																	withBadge={false}
																	network={currentMultisig?.network}
																/>
															</span>
														</>
													))}
												</>
											}
										>
											<Button className='border-none outline-none w-auto rounded-full p-0'>
												<SyncOutlined className='text-text_secondary text-base' />
											</Button>
										</Popover>
									) : (
										<Button
											className='border-none outline-none w-auto rounded-full p-0'
											onClick={() =>
												setUserDetailsContextState((prev) => ({
													...prev,
													isProxy: !prev.isProxy,
													selectedProxy: currentMultisig.proxy as string
												}))
											}
										>
											<SyncOutlined className='text-text_secondary text-base' />
										</Button>
									)}
								</Tooltip>
							)} */}
							</div>
							<div className='flex text-xs'>
								<div
									title={(address && getEncodedAddress(address, network)) || ''}
									className=' font-normal text-text_secondary'
								>
									{address && shortenAddress(getEncodedAddress(address, network) || '')}
								</div>
								<button
									className='ml-2 mr-1'
									onClick={() => copyText(address, true, network)}
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
							{/* <div>
							<div className='text-white'>{currencyProperties[currency].symbol} Amount</div>
							<div className='font-bold text-lg text-primary'>
								{loadingAssets ? (
									<Spin size='default' />
								) : (
									(
										Number(allAssets?.[`${activeMultisig}_${activeNetwork}`]?.fiatTotal || 0) * Number(currencyPrice)
									).toFixed(2) || 'N/A'
								)}
							</div>
						</div> */}
						</>
					)}
				</div>
				<div className='flex justify-around w-full mt-5 gap-x-6'>
					<NewTransaction />
					<div className='w-full'>
						<Button
							variant={EButtonVariant.SECONDARY}
							className='text-sm text-[#8AB9FF] border-none'
							fullWidth
							icon={<WalletIcon fill='#8AB9FF' />}
						>
							Fund Multisig
						</Button>
					</div>
				</div>
			</div>
		</>
	);
}

export default OverviewCard;
