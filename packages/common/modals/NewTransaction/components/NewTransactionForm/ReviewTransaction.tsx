import { ENetwork } from '@common/enum/substrate';
import Address from '@common/global-ui-components/Address';
import CallDataJsonView from '@common/global-ui-components/CallDataJsonView';
import React from 'react';

const ReviewTransaction = ({
	callData,
	from,
	to,
	api,
	network
}: {
	callData: string;
	from: string;
	to: string;
	api: any;
	network: ENetwork;
}) => {
	return (
		<div className='flex flex-col gap-y-4'>
			<div className='w-[500px] max-h-[200px] overflow-auto'>
				<CallDataJsonView
					callData={callData}
					api={api}
				/>
			</div>
			<div>
				<p className='text-label font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'>
					Sending from
				</p>
				<div className='border border-dashed border-text-disabled hover:border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'>
					<Address
						address={from}
						network={network}
					/>
				</div>
			</div>
			<div>
				<p className='text-label font-normal mb-2 text-xs leading-[13px] flex items-center justify-between max-sm:w-full'>
					Sending To
				</p>
				<div className='border border-dashed border-text-disabled hover:border-primary rounded-lg p-2 bg-bg-secondary cursor-pointer w-[500px] max-sm:w-full'>
					<Address
						address={to}
						network={network}
					/>
				</div>
			</div>
		</div>
	);
};

export default ReviewTransaction;
