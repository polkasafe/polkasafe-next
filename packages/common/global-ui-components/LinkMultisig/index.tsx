'use client';

import { ENetwork } from '@common/enum/substrate';
import Address from '@common/global-ui-components/Address';
import Button from '@common/global-ui-components/Button';
import Collapse from '@common/global-ui-components/Collapse';
import { SelectNetwork } from '@common/global-ui-components/SelectNetwork';
import { ILinkMultisig, IMultisig } from '@common/types/substrate';
import { ERROR_MESSAGES } from '@common/utils/messages';
import { Divider, Empty, Spin } from 'antd';
import useNotification from 'antd/es/notification/useNotification';
import { useState } from 'react';
// use availableSignatories to populate the select options
export const LinkMultisig = ({
	networks,
	linkedMultisig,
	availableMultisig,
	onSubmit,
	onRemoveSubmit,
	fetchMultisig
}: ILinkMultisig) => {
	const [loading, setLoading] = useState(false);
	const [selectedNetwork, setSelectedNetwork] = useState<ENetwork>(ENetwork.POLKADOT);
	const [notification, context] = useNotification();

	const handleSubmit = async (values: { multisig: IMultisig }) => {
		try {
			const { multisig } = values;
			if (!multisig) {
				notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED });
				return;
			}
			setLoading(true);
			await onSubmit?.(multisig);
		} catch (e) {
			notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED, description: e || e.message });
		} finally {
			setLoading(false);
		}
	};

	const handleRemoveSubmit = async (values: { multisig: IMultisig }) => {
		try {
			const { multisig } = values;
			if (!multisig) {
				notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED });
				return;
			}
			setLoading(true);
			await onRemoveSubmit?.(multisig);
		} catch (e) {
			notification.error({ ...ERROR_MESSAGES.LINKED_MULTISIG_FAILED, description: e || e.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='rounded-xl p-6 bg-bg-main'>
			{context}
			<div className='w-full h-full'>
				<p className='text-base font-bold mb-2 text-white flex justify-between w-full items-center'>
					Link MultiSig(s)
					<SelectNetwork
						networks={networks}
						onChange={async (network) => {
							setLoading(true);
							setSelectedNetwork(network);
							await fetchMultisig(network);
							setLoading(false);
						}}
						selectedNetwork={selectedNetwork}
					/>
				</p>
				<p className='text-sm text-text-secondary mb-4'>
					Already have a MultiSig? You can link your existing multisigs with a few simple steps
				</p>

				{/* {Boolean(linkedMultisig.length) && <Typography className='text-text-secondary' variant={ETypographyVariants.h3}>Linked Multisig</Typography>} */}

				<div className='flex flex-col gap-y-3 mb-4'>
					{linkedMultisig.map((multisig) =>
						multisig.proxy && multisig.proxy.length > 0 ? (
							<Collapse
								className='border-none rounded-xl'
								items={[
									{
										key: multisig.address,
										label: (
											<Address
												address={multisig.address}
												name={multisig.name}
												network={multisig.network}
												isMultisig
												withBadge={false}
											/>
										),
										children: multisig.proxy && (
											<div className='flex flex-col gap-y-3 p-4 pl-12 relative'>
												{multisig.proxy.map((item) => (
													<div className='py-3 px-4 rounded-xl border border-text-disabled flex justify-between relative'>
														<div className='absolute w-[24px] h-[50px] rounded-es-[11px] border-b-[2px] border-l-[2px] border-primary left-[-25px] top-[-16px]' />
														<Address
															address={item.address}
															network={multisig.network}
															name={item.name}
															isProxy
															withBadge={false}
														/>
														<Button
															className='bg-bg-secondary border-none text-white'
															onClick={() => handleRemoveSubmit({ multisig })}
														>
															Unlink
														</Button>
													</div>
												))}
											</div>
										),
										extra: (
											<Button
												className='bg-bg-secondary border-none text-white'
												onClick={() => handleRemoveSubmit({ multisig })}
											>
												Unlink Multisig
											</Button>
										)
									}
								]}
							/>
						) : (
							<div className='border border-primary rounded-xl py-3 px-4 flex items-center justify-between'>
								<Address
									address={multisig.address}
									name={multisig.name}
									network={multisig.network}
									isMultisig
									withBadge={false}
								/>
								<Button
									className='bg-bg-secondary border-none text-white'
									onClick={() => handleRemoveSubmit({ multisig })}
								>
									Unlink Multisig
								</Button>
							</div>
						)
					)}
				</div>

				<Spin spinning={loading}>
					<div className='flex flex-col gap-y-2 max-h-80 overflow-x-auto px-3'>
						{availableMultisig.length === 0 && (
							<Empty
								className='text-white'
								image={Empty.PRESENTED_IMAGE_SIMPLE}
								description='No onChain Multisig available on this network'
							/>
						)}
						{availableMultisig.length > 0 &&
							availableMultisig.map((multisig) =>
								multisig.proxy && multisig.proxy.length > 0 ? (
									<Collapse
										className='border-none rounded-xl'
										items={[
											{
												key: multisig.address,
												label: (
													<Address
														address={multisig.address}
														name={multisig.name}
														network={multisig.network}
														isMultisig
														withBadge={false}
													/>
												),
												children: multisig.proxy && (
													<div className='flex flex-col gap-y-3 p-4 pl-12 relative'>
														{[...multisig.proxy, ...multisig.proxy].map((item, i) => (
															<div className='py-3 px-4 rounded-xl border border-text-disabled flex justify-between relative'>
																<div
																	className={`absolute w-[24px] h-[74px] ${i === 0 ? 'h-[74px] top-[-44px]' : 'h-[90px] top-[-60px]'} rounded-es-[11px] border-b-[2px] border-l-[2px] border-primary left-[-25px]`}
																/>
																<Address
																	address={item.address}
																	network={multisig.network}
																	name={item.name}
																	isProxy
																/>
																<Button
																	className='bg-highlight border-none text-label'
																	onClick={() => handleSubmit({ multisig })}
																>
																	Link
																</Button>
															</div>
														))}
													</div>
												),
												extra: (
													<Button
														className='bg-highlight border-none text-label'
														onClick={() => handleSubmit({ multisig })}
													>
														Link Multisig
													</Button>
												)
											}
										]}
									/>
								) : (
									<div className='border border-primary rounded-xl py-3 px-4 flex items-center justify-between'>
										<Address
											address={multisig.address}
											name={multisig.name}
											network={multisig.network}
											isMultisig
											withBadge={false}
										/>
										<Button
											className='bg-highlight border-none text-label'
											onClick={() => handleSubmit({ multisig })}
										>
											Link Multisig
										</Button>
									</div>
								)
							)}
					</div>
				</Spin>
				<Divider />
			</div>
		</div>
	);
};
