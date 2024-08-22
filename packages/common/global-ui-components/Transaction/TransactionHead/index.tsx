import React, { useCallback, useEffect, useState } from 'react';
import { useAtomValue, PrimitiveAtom } from 'jotai';
import { Skeleton } from 'antd';
import { decodeCallData } from '@substrate/app/global/utils/decodeCallData';
import { getCallData } from '@substrate/app/global/utils/getCallData';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@common/global-ui-components/Icons';
import { chainProperties } from '@common/constants/substrateNetworkConstant';
import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import Address from '@common/global-ui-components/Address';
import { ETransactionOptions } from '@common/enum/substrate';
import { IApiAtom } from '@substrate/app/atoms/api/apiAtom';

interface ITransactionHeadProps {
	callData: string;
	callHash: string;
	createdAt: string;
	amountToken: string;
	multisigAddress: string;
	network: string;
	from: string;
	apiAtom: PrimitiveAtom<IApiAtom>;
}

// eslint-disable-next-line sonarjs/cognitive-complexity
function TransactionHead({
	callData: optionalCallData,
	callHash,
	amountToken,
	from,
	multisigAddress,
	createdAt,
	network,
	apiAtom
}: ITransactionHeadProps) {
	const api = useAtomValue(apiAtom);
	const [loading, setLoading] = useState(!optionalCallData);
	const [callData, setCallData] = useState(optionalCallData);
	const [txnParams, setTxnParams] = useState<{ method: string; section: string }>({} as any);
	const [customTx, setCustomTx] = useState<boolean>(false);
	const [isProxyApproval, setIsProxyApproval] = useState<boolean>(false);
	const type = from === multisigAddress ? ETransactionOptions.SEND : ETransactionOptions.RECEIVE;

	const handleDecodedData = useCallback(
		(cData: string) => {
			if (!api || !api.apiReady || !cData) return;

			const { data, error } = decodeCallData(cData, api);
			if (error || !data) return;

			if (data?.extrinsicCall?.hash.toHex() !== callHash) {
				return;
			}

			const decodedCallData = data.extrinsicCall?.toJSON() as any;
			if (decodedCallData && decodedCallData?.args?.proxy_type) {
				setIsProxyApproval(true);
			} else if (
				decodedCallData?.args &&
				!decodedCallData?.args?.dest &&
				!decodedCallData?.args?.call?.args?.dest &&
				!decodedCallData?.args?.calls?.[0]?.args?.dest &&
				!decodedCallData?.args?.call?.args?.calls?.[0]?.args?.dest
			) {
				setCustomTx(true);
			}

			const callDataFunc = data.extrinsicFn;
			setTxnParams({ method: `${callDataFunc?.method}`, section: `${callDataFunc?.section}` });
		},
		[api, callHash]
	);

	useEffect(() => {
		console.log(network);
		if (!api) {
			console.log('callData', callData, 'api[network]?.api', api);
			return;
		}
		setLoading(true);
		const fetchCallData = async () => {
			if (api.api === null) return;
			if (callData) {
				return callData;
			}
			return getCallData(api.api, callHash);
		};
		fetchCallData()
			.then((res) => {
				setCallData(res);
				handleDecodedData(res);
			})
			.catch(() => console.log('Error fetching call data'))
			.finally(() => setLoading(false));
	}, [optionalCallData, api, network, callData, callHash, handleDecodedData]);

	return (
		<div className='bg-bg-secondary rounded-xl p-3 mr-2'>
			{loading ? (
				<Skeleton
					loading={loading}
					active
				/>
			) : (
				<div className='flex items-center max-sm:flex max-sm:flex-wrap max-sm:gap-2'>
					<Typography
						variant={ETypographyVariants.p}
						className='flex items-center gap-x-3 basis-1/5 justify-start text-text-primary'
					>
						{type === ETransactionOptions.SEND || customTx ? (
							<ArrowUpRightIcon className='p-2.5 bg-bg-success text-failure rounded-lg' />
						) : (
							<ArrowDownLeftIcon className='bg bg-bg-success p-2.5 rounded-lg text-green-500' />
						)}
						<span className='capitalize'>
							{customTx
								? txnParams
									? `${txnParams.section}.${txnParams.method}`
									: 'Custom Transaction'
								: isProxyApproval
								? 'Proxy Creation'
								: type}
						</span>
					</Typography>
					{Number(amountToken) ? (
						<Typography
							variant={ETypographyVariants.p}
							className='flex items-center gap-x-2 basis-1/5 justify-start text-text-primary'
						>
							{Boolean(amountToken) && <ParachainTooltipIcon src={chainProperties[network]?.logo} />}
							<span
								className={`font-normal text-xs text-success ${type === ETransactionOptions.SEND && 'text-failure'}`}
							>
								{type === ETransactionOptions.SEND || !amountToken ? '-' : '+'} {Boolean(amountToken) && amountToken}{' '}
								{Boolean(amountToken) || chainProperties[network].tokenSymbol}
							</span>
						</Typography>
					) : (
						<Typography
							variant={ETypographyVariants.p}
							className='basis-1/5 justify-start text-text-primary'
						>
							-
						</Typography>
					)}
					<Typography
						variant={ETypographyVariants.p}
						className='basis-1/5 justify-start text-text-primary'
					>
						{createdAt}
					</Typography>
					<Typography
						variant={ETypographyVariants.p}
						className='basis-1/5 justify-start text-text-primary'
					>
						<Address
							address={multisigAddress}
							network={network}
							withBadge={false}
							isMultisig
						/>
						{/* <TransactionFields
							callHash={callHash}
							category={category}
							setCategory={setCategory}
							transactionFieldsObject={transactionFieldsObject}
							setTransactionFieldsObject={setTransactionFieldsObject}
							multisigAddress={multisigAddress}
							network={network}
						/> */}
					</Typography>
					<Typography
						variant={ETypographyVariants.p}
						className='flex items-center gap-x-4 basis-1/5 justify-start'
					>
						<span className='text-success'>Success</span>
						<span className='text-white text-sm'>{type === ETransactionOptions.SEND ? 'Sent' : 'Received'}</span>
					</Typography>
				</div>
			)}
		</div>
	);
}

export default TransactionHead;
