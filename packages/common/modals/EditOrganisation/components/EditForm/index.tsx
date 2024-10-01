import { ENetwork } from '@common/enum/substrate';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import Collapse from '@common/global-ui-components/Collapse';
import { LinkMultisigOrganisation } from '@common/global-ui-components/createOrganisation/components/AddMultisig/components/LinkMultisig';
import Typography, { ETypographyVariants } from '@common/global-ui-components/Typography';
import { AddMultisig } from '@common/modals/AddMultisig';
import { OrganisationInfo } from '@common/modals/EditOrganisation/components/OrganisationInfo';
import { IAddressBook, ICreateOrganisationDetails, IMultisig, IMultisigCreate } from '@common/types/substrate';

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
	userAddress
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
}) => {
	const items = [
		{
			key: '1',
			label: (
				<div className='flex gap-2 justify-between items-start'>
					<Typography
						variant={ETypographyVariants.h2}
						className='text-base font-bold'
					>
						Organisation Info
					</Typography>
					<div className='w-48'>
						<Typography variant={ETypographyVariants.p}>
							This info will be standard for any project/company or individual and can go on every invoice
						</Typography>
					</div>
				</div>
			),
			children: <OrganisationInfo onSubmit={onSubmit} />,
			style: {
				marginBottom: 24,
				border: 'none'
			}
		},
		{
			key: '2',
			label: (
				<div className='flex gap-2 justify-between items-start'>
					<Typography
						variant={ETypographyVariants.h2}
						className='text-base font-bold'
					>
						Multisigs
					</Typography>
					<div className='w-48'>
						<Typography variant={ETypographyVariants.p}>
							‘Link’ new multisig(s) or ‘Unlink’ existing multisig(s)
						</Typography>
					</div>
				</div>
			),
			children: (
				<div>
					<Typography
						variant={ETypographyVariants.p}
						className='text-lg font-bold mb-2 text-white'
					>
						Create/Link Multisig
					</Typography>
					<Typography
						variant={ETypographyVariants.p}
						className='text-sm text-text-secondary mb-5'
					>
						MultiSig is a secure digital wallet that requires one or multiple owners to authorize the transaction.
					</Typography>
					<AddMultisig
						userAddress={userAddress}
						networks={networks}
						availableSignatories={availableSignatories}
						onSubmit={onCreateMultisigSubmit}
					/>
					<LinkMultisigOrganisation
						networks={networks}
						linkedMultisig={linkedMultisig}
						availableMultisig={multisigs}
						onSubmit={onLinkedMultisig}
						fetchMultisig={fetchMultisig}
						onRemoveSubmit={onRemoveMultisig}
					/>
					<Button
						variant={EButtonVariant.PRIMARY}
						size='large'
						className='mt-4'
						onClick={onMultisigUpdate}
					>
						Update Multisig
					</Button>
				</div>
			),
			style: {
				marginBottom: 24,
				border: 'none'
			}
		}
	];
	return (
		<div>
			<Collapse
				className='[&_.ant-collapse-item>.ant-collapse-header]:border-0 [&_.ant-collapse-item>.ant-collapse-header]:bg-bg-secondary [&_.ant-collapse-item]:bg-bg-main bg-bg-main [&_.ant-collapse-item>.ant-collapse-content]:bg-bg-secondary [&_.ant-collapse-item-active>.ant-collapse-header]:rounded-b-none [&_.ant-collapse-item-active]:rounded-b-lg'
				bordered={false}
				expandIcon={() => null}
				items={items}
				defaultActiveKey={['1']}
			/>
		</div>
	);
};
