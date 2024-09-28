// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import Input from '@common/global-ui-components/Input';
import { Form, FormInstance } from 'antd';
import React, { useEffect, useState } from 'react';
// import { ApiPromise } from '@polkadot/api';

const SetIdentity = ({
	className,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	multisigAddress,
	// api,
	// apiReady,
	form
}: {
	className?: string;
	multisigAddress: string;
	// api: ApiPromise;
	// apiReady: boolean;
	form: FormInstance;
}) => {
	const [displayName, setDisplayName] = useState<string | undefined>();
	const [legalName, setLegalName] = useState<string | undefined>();
	const [elementHandle, setElementHandle] = useState<string | undefined>();
	const [websiteUrl, setWebsiteUrl] = useState<string | undefined>();
	const [twitterHandle, setTwitterHandle] = useState<string | undefined>();
	const [email, setEmail] = useState<string | undefined>();

	// const getMultisigAddressIdentityInfo = useCallback(async () => {
	// if (!api || !apiReady) return;

	// const info = await api.derive.accounts.info(multisigAddress);
	// if (info.identity) {
	// const { identity } = info;
	// setDisplayName(identity.display);
	// setLegalName(identity.legal);
	// setElementHandle(identity.riot);
	// setEmail(identity.email);
	// setTwitterHandle(identity.twitter);
	// setWebsiteUrl(identity.web);
	// }
	// }, [multisigAddress, api, apiReady]);

	// useEffect(() => {
	// getMultisigAddressIdentityInfo();
	// }, [getMultisigAddressIdentityInfo]);

	useEffect(() => {
		form.setFieldsValue({
			identityData: {
				displayName,
				legalName,
				elementHandle,
				websiteUrl,
				twitterHandle,
				email
			}
		});
	}, [displayName, elementHandle, email, form, legalName, twitterHandle, websiteUrl]);

	return (
		<div className={`grid grid-cols-2 gap-4 ${className}`}>
			<section className='mt-[15px] w-full'>
				<label className='text-primary font-normal text-xs leading-[13px] block mb-[5px]'>Display Name*</label>
				<div className='flex items-center gap-x-[10px]'>
					<article className='w-full'>
						<Form.Item
							className='border-0 outline-0 my-0 p-0'
							name='display_name'
							rules={[{ message: 'Required', required: true }]}
						>
							<div className='flex items-center h-[50px]'>
								<Input
									id='display_name'
									onChange={(a) => setDisplayName(a.target.value)}
									placeholder='John'
									value={displayName}
								/>
							</div>
						</Form.Item>
					</article>
				</div>
			</section>
			<section className='mt-[15px] w-full'>
				<label className='text-primary font-normal text-xs leading-[13px] block mb-[5px]'>Legal Name</label>
				<div className='flex items-center gap-x-[10px]'>
					<article className='w-full'>
						<Form.Item
							className='border-0 outline-0 my-0 p-0'
							name='legal_name'
						>
							<div className='flex items-center h-[50px]'>
								<Input
									id='legal_name'
									onChange={(a) => setLegalName(a.target.value)}
									placeholder='John Doe'
									value={legalName}
								/>
							</div>
						</Form.Item>
					</article>
				</div>
			</section>
			<section className='mt-[15px] w-full'>
				<label className='text-primary font-normal text-xs leading-[13px] block mb-[5px]'>Element Handle</label>
				<div className='flex items-center gap-x-[10px]'>
					<article className='w-full'>
						<Form.Item
							className='border-0 outline-0 my-0 p-0'
							name='element'
						>
							<div className='flex items-center h-[50px]'>
								<Input
									id='element'
									onChange={(a) => setElementHandle(a.target.value)}
									placeholder='@john:matrix.org'
									value={elementHandle}
								/>
							</div>
						</Form.Item>
					</article>
				</div>
			</section>
			<section className='mt-[15px] w-full'>
				<label className='text-primary font-normal text-xs leading-[13px] block mb-[5px]'>Website</label>
				<div className='flex items-center gap-x-[10px]'>
					<article className='w-full'>
						<Form.Item
							className='border-0 outline-0 my-0 p-0'
							name='website'
						>
							<div className='flex items-center h-[50px]'>
								<Input
									id='website'
									onChange={(a) => setWebsiteUrl(a.target.value)}
									placeholder='https://john.me'
									value={websiteUrl}
								/>
							</div>
						</Form.Item>
					</article>
				</div>
			</section>
			<section className='mt-[15px] w-full'>
				<label className='text-primary font-normal text-xs leading-[13px] block mb-[5px]'>Twitter Handle</label>
				<div className='flex items-center gap-x-[10px]'>
					<article className='w-full'>
						<Form.Item
							className='border-0 outline-0 my-0 p-0'
							name='twitter'
						>
							<div className='flex items-center h-[50px]'>
								<Input
									id='twitter'
									onChange={(a) => setTwitterHandle(a.target.value)}
									placeholder='@john'
									value={twitterHandle}
								/>
							</div>
						</Form.Item>
					</article>
				</div>
			</section>
			<section className='mt-[15px] w-full'>
				<label className='text-primary font-normal text-xs leading-[13px] block mb-[5px]'>Email</label>
				<div className='flex items-center gap-x-[10px]'>
					<article className='w-full'>
						<Form.Item
							className='border-0 outline-0 my-0 p-0'
							name='email'
						>
							<div className='flex items-center h-[50px]'>
								<Input
									id='email'
									onChange={(a) => setEmail(a.target.value)}
									placeholder='johndoe123@email.com'
									value={email}
								/>
							</div>
						</Form.Item>
					</article>
				</div>
			</section>
		</div>
	);
};

export default SetIdentity;
