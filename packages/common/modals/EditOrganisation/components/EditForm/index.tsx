import { ENetwork } from '@common/enum/substrate';
import { ActionButtons } from '@common/global-ui-components/ActionButtons';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Collapse from '@common/global-ui-components/Collapse';
import { LinkMultisigOrganisation } from '@common/global-ui-components/createOrganisation/components/AddMultisig/components/LinkMultisig';
import { CircleArrowDownIcon, CircleCheckIcon } from '@common/global-ui-components/Icons';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { AddMultisig } from '@common/modals/AddMultisig';
import { OrganisationInfo } from '@common/modals/EditOrganisation/components/OrganisationInfo';
import { IAddressBook, ICreateOrganisationDetails, IMultisig, IMultisigCreate } from '@common/types/substrate';
import { twMerge } from 'tailwind-merge';

export const EditForm = ({
	onSubmit,
	onMultisigUpdate,
	multisigs,
	linkedMultisig,
	availableSignatories,
	networks,
	onCreateMultisigSubmit,
	onLinkedMultisig,
	onRemoveMultisig,
	fetchMultisig,
	userAddress,
	onCancel,
	prevLinked
}: {
	onSubmit: (value: ICreateOrganisationDetails) => void;
	onMultisigUpdate: () => void;
	multisigs: Array<IMultisig>;
	linkedMultisig: Array<IMultisig>;
	availableSignatories: Array<IAddressBook>;
	networks: Array<ENetwork>;
	onCreateMultisigSubmit: (values: IMultisigCreate) => Promise<void>;
	onLinkedMultisig: (multisig: IMultisig) => Promise<void>;
	onRemoveMultisig: (multisig: IMultisig) => Promise<void>;
	fetchMultisig: (network: ENetwork) => Promise<void>;
	userAddress: string;
	onCancel: () => void;
	prevLinked: Array<IMultisig>;
}) => {
	const items = [
		{
			key: '1',
			label: (
				<div className='flex gap-x-8 justify-between items-start'>
					<Typography
						variant={ETypographyVariants.h2}
						className='text-base font-bold'
					>
						Organisation Info
					</Typography>
					<Typography className='flex-1' variant={ETypographyVariants.p}>
						This info will be standard for any project/company or individual and can go on every invoice
					</Typography>
				</div>
			),
			children: <div className='p-2 bg-bg-secondary'>
				<OrganisationInfo onSubmit={onSubmit} isEdit />
			</div>,
			style: {
				marginBottom: 24,
				border: 'none',
				overflow: 'hidden'
			}
		},
		{
			key: '2',
			label: (
				<div className='flex gap-x-4 justify-between items-start'>
					<Typography
						variant={ETypographyVariants.h2}
						className='text-base font-bold'
					>
						Multisigs
					</Typography>
					<Typography variant={ETypographyVariants.p}>
						‘Link’ new multisig(s) or ‘Unlink’ existing multisig(s)
					</Typography>
				</div>
			),
			children: (
				<div className='p-2 pb-4'>
					<LinkMultisigOrganisation
						networks={networks}
						linkedMultisig={linkedMultisig}
						availableMultisig={multisigs}
						onSubmit={onLinkedMultisig}
						fetchMultisig={fetchMultisig}
						onRemoveSubmit={onRemoveMultisig}
						className='bg-transparent'
					/>
					<div className='px-6'>
						<AddMultisig
							userAddress={userAddress}
							networks={networks}
							availableSignatories={availableSignatories}
							onSubmit={onCreateMultisigSubmit}
							className='w-full mt-4'
							size='middle'
						/>
					</div>
				</div>
			),
			style: {
				marginBottom: 24,
				border: 'none'
			}
		}
	];
	return (
		<div className='max-w-[600px] flex flex-col gap-y-6'>
			<Collapse
				className='[&_.ant-collapse-item>.ant-collapse-header]:border-0 [&_.ant-collapse-item>.ant-collapse-header]:bg-bg-secondary [&_.ant-collapse-item]:bg-bg-main bg-bg-main [&_.ant-collapse-item>.ant-collapse-content]:bg-bg-secondary [&_.ant-collapse-item-active>.ant-collapse-header]:rounded-b-none [&_.ant-collapse-item-active]:rounded-b-lg'
				bordered={false}
				expandIconPosition='end'
				expandIcon={({ isActive }) => (
					<CircleArrowDownIcon className={twMerge('text-text-secondary text-lg', isActive && 'rotate-[180deg]')} />
				)}
				defaultActiveKey={['2']}
				items={items}
				accordion
			/>
			<ActionButtons icon={<CircleCheckIcon />} label='Confirm' onClick={() => {
				onMultisigUpdate();
			}} onCancel={onCancel} disabled={linkedMultisig.toString() === prevLinked.toString()} />
		</div>
	);
};
