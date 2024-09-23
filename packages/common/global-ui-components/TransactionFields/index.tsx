// Copyright 2022-2023 @Polkasafe/polkaSafe-ui authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React, { useState } from 'react';

// import ModalComponent from '@next-common/ui-components/ModalComponent';
// import AddCustomField from './AddCustomField';
import { ITransactionFields } from '@common/types/substrate';
import AddNewCategory from '@common/modals/AddNewCategory';
import SubfieldList from '@common/global-ui-components/TransactionFields/SubfieldList';

const TransactionFields = ({ transactionFields }: { transactionFields: ITransactionFields }) => {
	const [category, setCategory] = useState<string>(Object.keys(transactionFields)[0] || 'none');

	return (
		<div>
            <div className='bg-bg-main p-5 rounded-xl relative overflow-hidden'>
                <section className='mb-4 flex items-center justify-between'>
                    <p className='text-white text-lg'>Categories</p>
                    <AddNewCategory />
                </section>
                <section className='flex items-center justify-between flex-col gap-5 md:flex-row mb-6'>
                    <div className='flex-1 flex items-center gap-x-3'>
                        {Object.keys(transactionFields)
                            .filter((field) => field !== 'none')
                            .map((field) => (
                                <Button
                                    onClick={() => setCategory(field)}
                                    className={` border border-solid ${
                                        category === field
                                            ? 'border-primary text-primary bg-highlight'
                                            : 'text-text_secondary border-text-secondary'
                                    } rounded-xl px-[10px] py-1`}
                                    key='field'
                                >
                                    {transactionFields[field].fieldName}
                                </Button>
                            ))}
                        <Button
                            onClick={() => setCategory('none')}
                            className={` border border-solid ${
                                category === 'none'
                                    ? 'border-primary text-primary bg-highlight'
                                    : 'text-text_secondary border-text-secondary'
                            } rounded-xl px-[10px] py-1`}
                            key='field'
                        >
                            {transactionFields.none.fieldName}
                        </Button>
                    </div>
                </section>
                <section>
                    <SubfieldList transactionFields={transactionFields} category={category} />
                </section>
            </div>
		</div>
	);
};

export default TransactionFields;
