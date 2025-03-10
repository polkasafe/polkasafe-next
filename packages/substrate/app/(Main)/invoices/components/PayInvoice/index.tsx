import { Button } from 'antd';
import React, { useState } from 'react';
// import PayWithMultisig from './PayWithMultisig';
// import PayWithAccount from './PayWithAccount';
import { useOrganisation } from '@substrate/app/atoms/organisation/organisationAtom';

enum ETab {
	PAY_WITH_MULTISIG = 'Pay with Multisig',
	PAY_WITH_CONNECTED_ACCOUNT = 'Pay with Connected Account'
}

const PayInvoice = ({
	receiverAddress,
	requestedAmount,
	onCancel,
	invoiceId,
	requestedNetwork
}: {
	receiverAddress: string;
	requestedAmount: string;
	requestedNetwork: string;
	onCancel: () => void;
	invoiceId: string;
}) => {
	const [organisation] = useOrganisation();
	const [tab, setTab] = useState<ETab>(
		organisation && organisation.id ? ETab.PAY_WITH_MULTISIG : ETab.PAY_WITH_CONNECTED_ACCOUNT
	);
	return (
		<div>
			<div className='flex w-full justify-center items-center gap-x-4 mb-4'>
				{organisation && organisation.id && (
					<Button
						onClick={() => setTab(ETab.PAY_WITH_MULTISIG)}
						// icon={<HistoryIcon />}
						size='large'
						className={`rounded-lg font-medium text-sm leading-[15px] text-white outline-none border-none ${
							tab === ETab.PAY_WITH_MULTISIG && 'text-primary bg-highlight'
						}`}
					>
						{ETab.PAY_WITH_MULTISIG}
					</Button>
				)}
				<Button
					onClick={() => setTab(ETab.PAY_WITH_CONNECTED_ACCOUNT)}
					// icon={<HistoryIcon />}
					size='large'
					className={`rounded-lg font-medium text-sm leading-[15px] text-white outline-none border-none ${
						tab === ETab.PAY_WITH_CONNECTED_ACCOUNT && 'text-primary bg-highlight'
					}`}
				>
					{ETab.PAY_WITH_CONNECTED_ACCOUNT}
				</Button>
			</div>
			{/* {tab === ETab.PAY_WITH_MULTISIG ? (
				<PayWithMultisig
					requestedNetwork={requestedNetwork}
					invoiceId={invoiceId}
					onCancel={onCancel}
					receiverAddress={receiverAddress}
					requestedAmountInDollars={requestedAmount}
				/>
			) : (
				<PayWithAccount
					receiverAddress={receiverAddress}
					onCancel={onCancel}
					requestedAmountInDollars={requestedAmount}
					network={requestedNetwork}
					invoiceId={invoiceId}
				/>
			)} */}
		</div>
	);
};

export default PayInvoice;
