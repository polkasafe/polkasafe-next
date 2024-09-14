'use client';

import { ENetwork } from '@common/enum/substrate';
import Address from '@common/global-ui-components/Address';
import Button from '@common/global-ui-components/Button';
import Collapse from '@common/global-ui-components/Collapse';
import { SelectNetwork } from '@common/global-ui-components/SelectNetwork';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { ILinkMultisig, IMultisig } from '@common/types/substrate';
import { ERROR_MESSAGES } from '@common/utils/messages';
import { Divider, Spin } from 'antd';
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
			<Spin
				spinning={loading}
				size='large'
				className='w-full h-full'
			>
				<p className='text-base font-bold mb-2 text-white flex justify-between w-full items-center'>
					Link MultiSig(s)
					<SelectNetwork
						networks={networks}
						onChange={(network) => {
							setSelectedNetwork(network);
							fetchMultisig(network);
						}}
						selectedNetwork={selectedNetwork}
					/>
				</p>
				<p className='text-sm text-text-secondary'>
					Already have a MultiSig? You can link your existing multisigs with a few simple steps
				</p>

				{Boolean(linkedMultisig.length) && <Typography variant={ETypographyVariants.h3}>Linked Multisig</Typography>}

				{linkedMultisig.map((multisig) => (
					<div>
						<div>{multisig.address}</div>
						<Button onClick={() => handleRemoveSubmit({ multisig })}>Remove</Button>
					</div>
				))}
				<Divider />
				<div className='flex flex-col gap-y-3'>
					{availableMultisig.map((multisig) => (
						<Collapse
							className='border border-primary rounded-xl'
							items={[
								{
									key: multisig.address,
									label: (
										<Address
											address={multisig.address}
											name={multisig.name}
											network={multisig.network}
										/>
									),
									children: multisig.proxy && (
										<div className='flex flex-col gap-y-3'>
											{multisig.proxy.map((item) => (
												<div className='p-2 rounded-xl border border-text-secondary'>
													<Address
														address={item.address}
														network={multisig.network}
														name={item.name}
													/>
												</div>
											))}
										</div>
									),
									extra: <Button onClick={() => handleSubmit({ multisig })}>Link</Button>
								}
							]}
						/>
					))}
				</div>
				<Divider />
			</Spin>
		</div>
	);
};
