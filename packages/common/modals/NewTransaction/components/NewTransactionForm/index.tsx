import React, { useEffect, useState } from 'react';
import { Form, Spin, AutoComplete } from 'antd';
import { newTransactionFormFields } from '@common/modals/NewTransaction/utils/form';
import { IMultisig, ISendTransactionForm } from '@common/types/substrate';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { CircleArrowDownIcon, CirclePlusIcon, DeleteIcon, OutlineCloseIcon } from '@common/global-ui-components/Icons';
import BN from 'bn.js';
import { Dropdown } from '@common/global-ui-components/Dropdown';
import Address from '@common/global-ui-components/Address';
import { ENetwork } from '@common/enum/substrate';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { DefaultOptionType } from 'antd/es/select';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import BalanceInput from '@common/global-ui-components/BalanceInput';
import formatBnBalance from '@common/utils/formatBnBalance';
import './style.css';

export interface IRecipientAndAmount {
	recipient: string;
	amount: BN;
}

export function NewTransactionForm({ onClose }: { onClose: () => void }) {
	const { multisigs, onNewTransaction, addressBook, currencyValues } = useDashboardContext();
	const [loading, setLoading] = useState(false);
	const [notification, context] = useNotification();
	const [selectedMultisigAddress, setSelectedMultisigAddress] = useState<string>('');

	const [autocompleteAddresses, setAutoCompleteAddresses] = useState<DefaultOptionType[]>([]);

	const [tip, setTip] = useState<BN>(new BN(0));

	const [network, setNetwork] = useState<ENetwork>(ENetwork.POLKADOT);

	const [selectedProxyAddress, setSelectedProxyAddress] = useState<string>('');

	const [recipientAndAmount, setRecipientAndAmount] = useState<IRecipientAndAmount[]>([
		{
			amount: new BN('0'),
			recipient: ''
		}
	]);

	// const multisigOptionsWithProxy: IMultisig[] = [];

	// multisigs?.forEach((item) => {
	// 	if (item.proxy) {
	// 		if (typeof item.proxy === 'string') {
	// 			multisigOptionsWithProxy.push({ ...item, proxy: item.proxy });
	// 		} else {
	// 			item.proxy.map((mp) =>
	// 				multisigOptionsWithProxy.push({ ...item, name: mp.name || item.name, proxy: mp.address })
	// 			);
	// 		}
	// 	}
	// });

	const multisigOptions: any[] = [];

	// const multisigOptions = multisigOptionsWithProxy?.map((item) => ({
	// 	key: JSON.stringify({ ...item, isProxy: true }),
	// 	label: (
	// 		<Address
	// 			isMultisig
	// 			isProxy
	// 			name={item.name}
	// 			showNetworkBadge
	// 			network={item.network}
	// 			withBadge={false}
	// 			address={item.proxy as string}
	// 		/>
	// 	)
	// }));

	multisigs?.forEach((item) => {
		multisigOptions.push({
			key: JSON.stringify({ ...item, isProxy: false }),
			label: (
				<Address
					isMultisig
					showNetworkBadge
					network={item.network}
					withBadge={false}
					address={item.address}
				/>
			)
		});
	});

	useEffect(() => {
		if (!addressBook || addressBook.length === 0) return;
		const allAddresses: string[] = [];
		addressBook.forEach((item) => {
			if (!allAddresses.includes(getEncodedAddress(item.address, network) || item.address)) {
				allAddresses.push(item.address);
			}
		});
		setAutoCompleteAddresses(
			allAddresses.map((a) => ({
				label: (
					<Address
						network={network}
						address={a}
					/>
				),
				value: a
			}))
		);
	}, [network]);

	const onRecipientChange = (value: string, i: number) => {
		setRecipientAndAmount((prevState) => {
			const copyArray = [...prevState];
			const copyObject = { ...copyArray[i] };
			copyObject.recipient = value;
			copyArray[i] = copyObject;
			return copyArray;
		});
	};
	const onAmountChange = (a: BN, i: number) => {
		setRecipientAndAmount((prevState) => {
			const copyArray = [...prevState];
			const copyObject = { ...copyArray[i] };
			copyObject.amount = a;
			copyArray[i] = copyObject;
			return copyArray;
		});
	};

	const onAddRecipient = () => {
		setRecipientAndAmount((prevState) => {
			const copyOptionsArray = [...prevState];
			copyOptionsArray.push({ amount: new BN(0), recipient: '' });
			return copyOptionsArray;
		});
	};

	const onRemoveRecipient = (i: number) => {
		const copyOptionsArray = [...recipientAndAmount];
		copyOptionsArray.splice(i, 1);
		setRecipientAndAmount(copyOptionsArray);
	};

	const handleSubmit = async () => {
		try {
			const payload = {
				recipients: recipientAndAmount.map((item) => ({ address: item.recipient, amount: item.amount })),
				sender: findMultisig(multisigs, selectedMultisigAddress) as IMultisig,
				selectedProxy: selectedProxyAddress,
				note: ''
			};
			setLoading(true);
			await onNewTransaction(payload);
			notification.info(SUCCESS_MESSAGES.TRANSACTION_SUCCESS);
		} catch (e) {
			console.log(e);
			notification.error({ ...ERROR_MESSAGES.TRANSACTION_FAILED, description: e || e.message });
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className='w-full h-full flex flex-col justify-center items-center'>
			{context}
			<Spin
				spinning={loading}
				size='large'
				className='w-full h-full'
			>
				<Form
					layout='vertical'
					className='flex flex-col gap-y-6'
				>
					<div>
						<p className='text-label font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'>
							Sending from
						</p>
						<Dropdown
							trigger={['click']}
							className='border border-dashed border-text-secondary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'
							menu={{
								items: multisigOptions,
								onClick: (e) => {
									const data = JSON.parse(e.key);
									setSelectedMultisigAddress(data?.isProxy ? data?.proxy : data?.address);
									setNetwork(data?.network);
									// setIsProxy(data?.isProxy);
									// setSelectedProxyName(data.name);
								}
							}}
						>
							<div className='flex justify-between gap-x-4 items-center text-white text-[16px]'>
								<Address
									isMultisig
									// isProxy={isProxy}
									// name={}
									showNetworkBadge
									network={network}
									withBadge={false}
									address={selectedMultisigAddress}
								/>
								<CircleArrowDownIcon className='text-primary' />
							</div>
						</Dropdown>
					</div>
					<div>
						<div className='flex flex-col gap-y-3 mb-2'>
							{recipientAndAmount.map(({ recipient }, i) => (
								<article
									key={recipient}
									className='w-[500px] flex items-start gap-x-2 max-sm:w-full max-sm:flex-col'
								>
									<div className='w-[55%] max-sm:w-full'>
										<label className='text-label font-normal text-xs leading-[13px] block mb-[5px]'>Recipient*</label>
										<Form.Item
											name='recipient'
											rules={[{ required: true }]}
											help={
												!recipient && 'Recipient Address is Required'
												// (!validRecipient[i] && 'Please add a valid Address')
											}
											className='border-0 outline-0 my-0 p-0'
											validateStatus={recipient ? 'success' : 'error'}
										>
											<div className='h-[50px]'>
												{recipient &&
												autocompleteAddresses.some(
													(item) =>
														item.value && getSubstrateAddress(String(item.value)) === getSubstrateAddress(recipient)
												) ? (
													<div className='border border-solid border-primary rounded-lg px-2 h-full flex justify-between items-center'>
														{
															autocompleteAddresses.find(
																(item) =>
																	item.value &&
																	getSubstrateAddress(String(item.value)) === getSubstrateAddress(recipient)
															)?.label
														}
														<button
															className='outline-none border-none bg-highlight w-6 h-6 rounded-full flex items-center justify-center z-100'
															onClick={() => {
																onRecipientChange('', i);
															}}
														>
															<OutlineCloseIcon className='text-primary w-2 h-2' />
														</button>
													</div>
												) : (
													<AutoComplete
														// autoFocus
														// defaultOpen
														className='[&>div>span>input]:px-[12px]'
														filterOption={(inputValue, options) => {
															return inputValue && options?.value
																? getSubstrateAddress(String(options?.value) || '') === getSubstrateAddress(inputValue)
																: true;
														}}
														// notFoundContent={
														// 	validRecipient[i] && (
														// 		<Button
														// 			icon={<PlusCircleOutlined className='text-primary' />}
														// 			className='bg-transparent border-none outline-none text-primary text-sm flex items-center'
														// 			onClick={() => setShowAddressModal(true)}
														// 		>
														// 			Add Address to Address Book
														// 		</Button>
														// 	)
														// }
														options={
															autocompleteAddresses
															// filter duplicate address
															// .filter(
															// (item) =>
															// !recipientAndAmount.some(
															// (r) =>
															// r.recipient &&
															// item.value &&
															// getSubstrateAddress(r.recipient) ===
															// getSubstrateAddress(String(item.value) || '')
															// )
															// )
														}
														id='recipient'
														placeholder='Send to Address..'
														onChange={(value) => onRecipientChange(value, i)}
														value={recipientAndAmount[i].recipient}
														defaultValue=''
													/>
												)}
											</div>
										</Form.Item>
									</div>
									<div className='flex items-center gap-x-2 w-[45%]'>
										<BalanceInput
											network={network}
											multipleCurrency
											label='Amount*'
											defaultValue={formatBnBalance(
												recipientAndAmount[i].amount.toString(),
												{ numberAfterComma: 0, withThousandDelimitor: false },
												network
											)}
											// fromBalance={multisigBalance}
											onChange={(balance) => onAmountChange(balance, i)}
											currencyValues={currencyValues}
										/>
										{i !== 0 && (
											<Button
												onClick={() => onRemoveRecipient(i)}
												className='text-failure border-none outline-none bg-[#e63946]/[0.1] flex items-center justify-center p-1 sm:p-2 rounded-md sm:rounded-lg text-xs sm:text-sm w-6 h-6 sm:w-8 sm:h-8'
											>
												<DeleteIcon />
											</Button>
										)}
									</div>
								</article>
							))}
						</div>
						<div className='flex'>
							<Button
								className='bg-transparent p-0 border-none outline-none shadow-none text-label text-sm'
								onClick={onAddRecipient}
								icon={<CirclePlusIcon className='text-label' />}
							>
								Add Another
							</Button>
						</div>
					</div>
					<div>
						<BalanceInput
							network={network}
							label='Tip'
							// fromBalance={multisigBalance}
							onChange={(balance) => setTip(balance)}
							currencyValues={currencyValues}
						/>
					</div>
					<div className='flex items-center gap-x-4 w-full'>
						<div className='w-full'>
							<Button
								fullWidth
								size='large'
								onClick={onClose}
								variant={EButtonVariant.DANGER}
								icon={<OutlineCloseIcon className='text-failure' />}
							>
								Cancel
							</Button>
						</div>
						<div className='w-full'>
							<Button
								fullWidth
								size='large'
								onClick={handleSubmit}
								variant={EButtonVariant.PRIMARY}
							>
								Next
							</Button>
						</div>
					</div>
				</Form>
			</Spin>
		</div>
	);
}
