import { useOrganisationContext } from '@common/context/CreateOrganisationContext';
import { CreateOrganisationActionButtons } from '@common/global-ui-components/createOrganisation/components/CreateOrganisationActionButtons';
import Image from 'next/image';
import emptyImage from '@common/assets/icons/empty-image.png';
import Button, { EButtonVariant } from '@common/global-ui-components/Button';
import { EditIcon } from '@common/global-ui-components/Icons';
import Address from '@common/global-ui-components/Address';

export const ReviewOrganisation = () => {
	const { organisationDetails, linkedMultisig } = useOrganisationContext();
	return (
		<div>
			<p className='text-lg font-bold mb-2 text-white'>Review</p>
			<p className='text-sm text-text-secondary mb-5'>
				Review the details of your organisation, these can be edited later as well
			</p>
			<div className='rounded-xl p-6 bg-bg-main flex flex-col gap-y-4'>
				<div className='relative overflow-hidden'>
					<div className='h-[50px] w-[80%] rounded-full bg-[#8558F2] absolute top-[50%] left-[50%] -translate-y-1/2 -translate-x-1/2 z-10' />
					<div className='relative z-20 flex justify-between items-center text-white gap-x-2 px-2 py-3 bg-[#281A47]/25 backdrop-blur-xl rounded-xl cursor-pointer drop-shadow-[0_0_40px_#201047] border border-[#8558F2]'>
						<div className='flex items-center gap-x-3'>
							<Image
								width={30}
								height={30}
								className='rounded-full h-[30px] w-[30px]'
								src={emptyImage}
								alt='empty profile image'
							/>
							<div className='flex flex-col gap-y-[1px]'>
								<span className='text-sm text-white capitalize truncate max-w-[100px] font-bold'>
									{organisationDetails.name}
								</span>
								<span className='text-xs text-text-secondary'>{linkedMultisig.length || 0} Multisigs</span>
							</div>
						</div>
						<Button variant={EButtonVariant.PRIMARY} icon={<EditIcon />}>Edit</Button>
					</div>
				</div>
				<div className=''>
					<h2 className='text-text-secondary text-[10px] font-primary flex items-center gap-x-2 mb-2'>
						<span>MULTISIGS</span>
						<span className='bg-highlight text-primary rounded-full flex items-center justify-center h-5 w-5 font-normal text-xs'>
							{linkedMultisig.length}
						</span>
					</h2>
					<div className='flex flex-col gap-y-3'>
						{linkedMultisig.map((multisig) => (
							<div className='flex p-2 rounded-xl border border-[#505050]'>
								<Address address={multisig.address} network={multisig.network} name={multisig.name} />
							</div>
						))}
					</div>
				</div>
			</div>
			<CreateOrganisationActionButtons loading={false} />
		</div>
	);
};
