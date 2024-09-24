import Button from '@common/global-ui-components/Button'
import Modal from '@common/global-ui-components/Modal';
import AddCategoryForm from '@common/modals/AddNewCategory/AddCategoryForm';
import React, { useState } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons';
import { ITransactionCategorySubfields } from '@common/types/substrate';
import { ETransactionFieldsUpdateType } from '@common/enum/substrate';

const AddNewCategory = ({ loading, onSave }: { loading: boolean; onSave: (updateType: ETransactionFieldsUpdateType, fieldName: string, fieldDesc: string, subfields?: ITransactionCategorySubfields, onCancel?: () => void) => Promise<void> }) => {
    const [openModal, setOpenModal] = useState(false);

  return (
    <div>
         <Button
            icon={<PlusCircleOutlined />}
            onClick={() => setOpenModal(true)}
            size='large'
            className='outline-none border-none text-xs md:text-sm font-medium bg-primary text-white rounded-md md:rounded-lg flex items-center gap-x-3'
        >
            <span>Add New Category</span>
        </Button>
        <Modal
            open={openModal}
            onCancel={() => {
                setOpenModal(false);
            }}
            title='Add New Category'
        >
            <AddCategoryForm loading={loading} onSave={onSave} onCancel={() => setOpenModal(false)} />
        </Modal>

    </div>
  )
}

export default AddNewCategory