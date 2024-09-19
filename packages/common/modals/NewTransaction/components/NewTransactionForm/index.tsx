/* eslint-disable sonarjs/no-duplicate-string */
import React, { useEffect, useState } from 'react';
import { Form, Spin, AutoComplete } from 'antd';
import { IMultisig } from '@common/types/substrate';
import { useDashboardContext } from '@common/context/DashboarcContext';
import { findMultisig } from '@common/utils/findMultisig';
import useNotification from 'antd/es/notification/useNotification';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '@common/utils/messages';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { CirclePlusIcon, DeleteIcon, OutlineCloseIcon } from '@common/global-ui-components/Icons';
import BN from 'bn.js';
import Address from '@common/global-ui-components/Address';
import { ENetwork } from '@common/enum/substrate';
import getEncodedAddress from '@common/utils/getEncodedAddress';
import { DefaultOptionType } from 'antd/es/select';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import BalanceInput from '@common/global-ui-components/BalanceInput';
import formatBnBalance from '@common/utils/formatBnBalance';
import './style.css';
import { MultisigDropdown } from '@common/global-ui-components/MultisigDropdown';

export interface IRecipientAndAmount {
	recipient: string;
	amount: BN;
}

export function NewTransactionForm({ onClose }: { onClose: () => void }) {
	const { multisigs, onNewTransaction, addressBook, currencyValues } = useDashboardContext();
	const [notification, context] = useNotification();
	const [form] = Form.useForm();

	const [selectedMultisigDetails, setSelectedMultisigDetails] = useState<{
		address: string;
		network: ENetwork;
		name: string;
		proxy?: string;
	}>({
		address: multisigs[0].address,
		network: multisigs[0].network,
		name: multisigs[0].name
	});

	const [loading, setLoading] = useState(false);
	const [autocompleteAddresses, setAutoCompleteAddresses] = useState<DefaultOptionType[]>([]);
	const [recipientAndAmount, setRecipientAndAmount] = useState<IRecipientAndAmount[]>([
		{
			amount: new BN('0'),
			recipient: ''
		}
	]);

	useEffect(() => {
		if (!addressBook || addressBook.length === 0) return;
		const allAddresses: string[] = [];
		addressBook.forEach((item) => {
			if (!allAddresses.includes(getEncodedAddress(item.address, selectedMultisigDetails.network) || item.address)) {
				allAddresses.push(item.address);
			}
		});
		setAutoCompleteAddresses(
			allAddresses.map((a) => ({
				label: (
					<Address
						network={selectedMultisigDetails.network}
						address={a}
					/>
				),
				value: a
			}))
		);
	}, [addressBook, selectedMultisigDetails.network]);

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
			const multisigId = `${selectedMultisigDetails.address}_${selectedMultisigDetails.network}`;
			const payload = {
				recipients: recipientAndAmount.map((item) => ({ address: item.recipient, amount: item.amount })),
				sender: findMultisig(multisigs, multisigId) as IMultisig,
				selectedProxy: selectedMultisigDetails.proxy,
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
					form={form}
				>
					<div>
						<p className='text-label font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'>
							Sending from
						</p>
						<MultisigDropdown
							multisigs={multisigs}
							onChange={(value: { address: string; network: ENetwork; name: string; proxy?: string }) =>
								setSelectedMultisigDetails(value)
							}
						/>
					</div>
					<div>
						<div className='flex flex-col gap-y-3 mb-2 max-h-72 overflow-y-auto pr-2'>
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
														className='[&>div>span>input]:px-[12px]'
														filterOption={(inputValue, options) => {
															return inputValue && options?.value
																? getSubstrateAddress(String(options?.value) || '') === getSubstrateAddress(inputValue)
																: true;
														}}
														options={autocompleteAddresses}
														id='recipient'
														placeholder='Send to Address..'
														// onChange={(value) => onRecipientChange(value, i)}
														// value={recipientAndAmount[i].recipient}
													/>
												)}
											</div>
										</Form.Item>
									</div>
									<div className='flex items-center gap-x-2 w-[45%]'>
										<BalanceInput
											network={selectedMultisigDetails.network}
											multipleCurrency
											label='Amount*'
											defaultValue={formatBnBalance(
												recipientAndAmount[i].amount.toString(),
												{ numberAfterComma: 0, withThousandDelimitor: false },
												selectedMultisigDetails.network
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
							network={selectedMultisigDetails.network}
							label='Tip'
							// fromBalance={multisigBalance}
							onChange={(balance) => console.log(balance)}
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
