import { getCallData } from '@substrate/app/global/utils/getCallData';
import React, { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { apiAtom } from '@substrate/app/atoms/api/apiAtom';
import { Skeleton } from 'antd';
import decodeCallData from '@substrate/app/global/utils/decodeCallData';
import { ArrowDownLeftIcon, ArrowUpRightIcon } from '@common/global-ui-components/Icons';
import { ETransactionType } from '@substrate/app/global/types';
import { chainProperties } from '@common/constants/substrateNetworkConstant';
import ParachainTooltipIcon from '@common/global-ui-components/ParachainTooltipIcon';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import Address from '@common/global-ui-components/Address';

interface ITransactionHeadProps {
	callData: string;
	callHash: string;
	createdAt: string;
	amountToken: string;
	multisigAddress: string;
	network: string;
	from: string;
}

function TransactionHead({
	callData: optionalCallData,
	callHash,
	amountToken,
	from,
	multisigAddress,
	createdAt,
	network
}: ITransactionHeadProps) {
	const apis = useAtomValue(apiAtom);
	const [loading, setLoading] = useState(optionalCallData ? false : true);
	const [callData, setCallData] = useState(optionalCallData);
	const [txnParams, setTxnParams] = useState<{ method: string; section: string }>({} as any);
	const [customTx, setCustomTx] = useState<boolean>(false);
	const [isProxyApproval, setIsProxyApproval] = useState<boolean>(false);
	const type = from === multisigAddress ? ETransactionType.SEND : ETransactionType.RECEIVE;

	const handleDecodedData = (cData: string) => {
		if (!apis || !apis[network] || !apis[network].apiReady || !cData || apis[network].api === null) return;

		const { data, error } = decodeCallData(cData, apis[network].api);
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
	};

	useEffect(() => {
		console.log(network);
		if (!apis?.[network]?.api) {
			console.log('callData', callData, 'api[network]?.api', apis?.[network]?.api);
			return;
		}
		setLoading(true);
		const fetchCallData = async () => {
			if (apis?.[network].api === null) return;
			if (callData) {
				return callData;
			}
			return getCallData(apis[network].api, callHash);
		};
		fetchCallData()
			.then((res) => {
				setCallData(res);
				handleDecodedData(res);
			})
			.catch(() => console.log('Error fetching call data'))
			.finally(() => setLoading(false));
	}, [optionalCallData, apis]);

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
						{type === ETransactionType.SEND || customTx ? (
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
							<span className={`font-normal text-xs text-success ${type === ETransactionType.SEND && 'text-failure'}`}>
								{type === ETransactionType.SEND || !amountToken ? '-' : '+'} {Boolean(amountToken) && amountToken}{' '}
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
						<span className='text-white text-sm'>{type === ETransactionType.SEND ? 'Sent' : 'Received'}</span>
					</Typography>
				</div>
			)}
		</div>
	);
}

export default TransactionHead;
