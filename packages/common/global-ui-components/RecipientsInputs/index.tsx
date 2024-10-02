import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { AutoComplete, FormInstance } from 'antd';
import getSubstrateAddress from '@common/utils/getSubstrateAddress';
import { CirclePlusIcon, DeleteIcon, OutlineCloseIcon } from '@common/global-ui-components/Icons';
import BN from 'bn.js';
import BalanceInput from '@common/global-ui-components/BalanceInput';
import { ENetwork } from '@common/enum/substrate';
import Button from '@common/global-ui-components/Button';
import Address from '@common/global-ui-components/Address';
import { MULTIPLE_CURRENCY_NETWORKS } from '@common/constants/multipleCurrencyNetworks';
import { networkConstants } from '@common/constants/substrateNetworkConstant';
import { IMultisigAssets } from '@common/types/substrate';
import { IRecipientAndAmount } from '@common/modals/NewTransaction/components/NewTransactionForm';
import inputToBn from '@common/utils/inputToBn';

interface IRecipientInputs {
	autocompleteAddresses: Array<any>;
	form: FormInstance;
	setDisableSubmit?: Dispatch<SetStateAction<boolean>>;
	selectedMultisig: {
		address: string;
		network: ENetwork;
		name: string;
		proxy?: string;
	},
	assets?: IMultisigAssets[];
}

const getDecimalByToken = (token: string, network: ENetwork) => {
	const tokens = (networkConstants[network] as any).supportedTokens;
	const tokenData = tokens.find((t: any) => t.symbol === token);
	return tokenData?.decimals;
};

export const RecipientsInputs = ({ autocompleteAddresses, form, setDisableSubmit, assets, selectedMultisig }: IRecipientInputs) => {
	const network = selectedMultisig.network;
	const [recipientAndAmount, setRecipientAndAmount] = useState([
		{
			amount: new BN('0'),
			recipient: '',
			currency: networkConstants[network].tokenSymbol
		}
	]);
	const [amountExceeded, setAmountExceeded] = useState<boolean>(false);

	const isSelected = (recipient: string) => {
		return getSubstrateAddress(String(recipient)) !== null;
	};
	const onRecipientChange = (value: string, i: number) => {
		setRecipientAndAmount((prevState) => {
			const copyArray = [...prevState];
			const copyObject = { ...copyArray[i] };
			copyObject.recipient = value;
			copyArray[i] = copyObject;
			return copyArray;
		});
	};
	const onAmountChange = (a: BN, i: number, currency?: string) => {
		setRecipientAndAmount((prevState) => {
			const copyArray = [...prevState];
			const copyObject = { ...copyArray[i] };
			copyObject.amount = a;
			copyObject.currency = currency || '';
			copyArray[i] = copyObject;
			return copyArray;
		});
	};

	const onAddRecipient = () => {
		const nativeToken = networkConstants[network].tokenSymbol;
		setRecipientAndAmount((prevState) => {
			const copyOptionsArray = [...prevState];
			copyOptionsArray.push({ amount: new BN(0), recipient: '', currency: nativeToken });
			return copyOptionsArray;
		});
	};

	const onRemoveRecipient = (i: number) => {
		const copyOptionsArray = [...recipientAndAmount];
		copyOptionsArray.splice(i, 1);
		setRecipientAndAmount(copyOptionsArray);
	};

	useEffect(() => {
		form.setFieldsValue({ recipients: recipientAndAmount });
	}, [form, recipientAndAmount]);



	useEffect(() => {
		if (!assets || !setDisableSubmit || !selectedMultisig) return;
		const proxyMultiSigAssets = assets
		?.map((a) => a.proxy || [])
		.flat()
		.find((a) => a.proxyAddress === selectedMultisig.proxy && a.network === selectedMultisig.network);
		
		const network = selectedMultisig.network;
		const multiSigAssets = assets?.find((asset) => asset?.address === selectedMultisig.address && asset?.network === network);

		const checkRecipient = recipientAndAmount.filter((item) => !item.recipient || !item.amount || item.amount.isZero());
		if (checkRecipient.length) {
			setDisableSubmit(true);
			return;
		}
		setDisableSubmit(false);
		setAmountExceeded(false);

		if (proxyMultiSigAssets) {
			const checkBalance = recipientAndAmount.filter((item) => {
				const token = item.currency;
				if (token === proxyMultiSigAssets.symbol) {
					const [balance] = inputToBn(
						proxyMultiSigAssets.free,
						network,
						false,
						getDecimalByToken(item.currency, network)
					);
					return balance.lt(item.amount);
				}
				else {
					const tokenValue = proxyMultiSigAssets?.[`${token.toLowerCase()}` as 'usdc' | 'usdt']?.free || '0';
					const [balance] = inputToBn(
						tokenValue,
						network,
						false,
						getDecimalByToken(item.currency, network)
					);
					return balance.lt(item.amount);
				}
			})
			if (checkBalance.length) {
				setDisableSubmit(true);
				setAmountExceeded(true);
				return;
			}
			setDisableSubmit(false);
			setAmountExceeded(false);
			return;
		}

		if (multiSigAssets) {
			const checkBalance = recipientAndAmount.filter((item) => {
				const token = item.currency;
				if (token === multiSigAssets.symbol) {
					const [balance] = inputToBn(
						multiSigAssets.free,
						network,
						false,
						getDecimalByToken(item.currency, network)
					);
					return balance.lt(item.amount);
				}
				else {
					const tokenValue = multiSigAssets?.[`${token.toLowerCase()}` as 'usdc' | 'usdt']?.free || '0';
					const [balance] = inputToBn(
						tokenValue,
						network,
						false,
						getDecimalByToken(item.currency, network)
					);
					return balance.lt(item.amount);
				}
			})
			if (checkBalance.length) {
				setDisableSubmit(true);
				setAmountExceeded(true);
				return;
			}
			setDisableSubmit(false);
			setAmountExceeded(false);
			return;
		}
	}, [selectedMultisig, recipientAndAmount, assets]);

	return (
		<div>
			<div className='flex flex-col gap-y-3 max-h-72 overflow-y-auto pr-1'>
				<div className='flex flex-col gap-1'>
					{recipientAndAmount?.map(({ recipient }, i) => (
						<div
							key={`${recipient}_${i}`}
							className='flex items-start gap-x-2 justify-center max-sm:w-full max-sm:flex-col'
						>
							<div className='w-[60%] max-sm:w-full'>
								<label className='text-label font-normal text-xs leading-[13px] block mb-[5px]'>Recipient*</label>

								<div className='h-[50px]'>
									{recipient && isSelected(recipient) ? (
										<div className='border border-solid border-primary rounded-lg px-2 h-full flex justify-between items-center w-full'>
											<Address
												address={recipient}
												network={network}
											/>
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
											className='[&>div>span>input]:px-[12px] w-full'
											filterOption={(inputValue, options) => {
												return inputValue && options?.value
													? getSubstrateAddress(String(options?.value) || '') === getSubstrateAddress(inputValue)
													: true;
											}}
											options={autocompleteAddresses}
											id='recipient'
											placeholder='Send to Address..'
											onChange={(value) => onRecipientChange(value, i)}
										/>
									)}
								</div>
							</div>
							<div className='flex items-center gap-x-2 w-[40%]'>
								<BalanceInput
									network={network}
									amountExceeded={amountExceeded}
									label='Amount*'
									formName={`recipients[${i}].amount`}
									onChange={(balance, currency) => onAmountChange(balance, i, currency)}
									multipleCurrency={MULTIPLE_CURRENCY_NETWORKS.includes(network)}
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
						</div>
					))}
				</div>
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
	);
};
