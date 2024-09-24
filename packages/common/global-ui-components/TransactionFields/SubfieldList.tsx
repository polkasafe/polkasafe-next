// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { PlusCircleOutlined } from '@ant-design/icons';
import { Divider } from 'antd';
import React, { useState } from 'react';
import styled from 'styled-components';

import { ITransactionFields } from '@common/types/substrate';
import Button from '@common/global-ui-components/Button';

const SubfieldsList = ({ className, category, transactionFields }: { className?: string; category: string, transactionFields: ITransactionFields }) => {
	const [loading, setLoading] = useState<boolean>(false);
	const [openAddSubfieldModal, setOpenAddSubfieldModal] = useState(false);

	return (
		<div className='text-sm font-medium leading-[15px] '>
			<article className='grid grid-cols-5 gap-x-5 bg-bg-secondary text-text_secondary py-5 px-4 rounded-lg'>
				<span className='col-span-2'>Sub-Field Name</span>
				<span className='col-span-1'>Sub-Field Type</span>
				<span className='col-span-1'>Action</span>
			</article>
			{category === 'none' ? (
				<section className='my-4 text-sm w-full text-white font-normal flex justify-center'>
					This Category cannot be Customized.
				</section>
			) : transactionFields[category] && !Object.keys(transactionFields[category].subfields).length ? (
				<section className='my-4 text-sm w-full text-white font-normal flex justify-center'>
					Please add Sub-Fields to this Category.
				</section>
			) : (
				transactionFields[category] &&
				transactionFields[category].subfields &&
				Object.keys(transactionFields[category].subfields).map((subfield, index) => {
					const subfieldObject = transactionFields[category].subfields[subfield];
					return (
						<article key={index}>
							<div className='grid grid-cols-5 gap-x-5 py-6 px-4 text-white'>
								<div className='sm:w-auto overflow-hidden text-ellipsis col-span-2 flex items-center text-base'>
									{subfieldObject.subfieldName}
								</div>
								<div className='col-span-1 flex items-center gap-x-[10px]'>{subfieldObject.subfieldType}</div>
							</div>
							{Object.keys(transactionFields[category].subfields).length - 1 !== index ? (
								<Divider className='bg-text_secondary my-0' />
							) : null}
						</article>
					);
				})
			)}
			{category !== 'none' && (
				<Button
					icon={<PlusCircleOutlined className='text-primary' />}
					className='my-2 bg-transparent p-0 border-none outline-none text-primary text-sm flex items-center'
					onClick={() => setOpenAddSubfieldModal(true)}
				>
					Add Sub-Field
				</Button>
			)}
		</div>
	);
};

export default styled(SubfieldsList)`
	.ant-spin-nested-loading .ant-spin-blur {
		opacity: 0 !important;
	}
	.ant-spin-nested-loading .ant-spin-blur::after {
		opacity: 1 !important;
	}
`;
