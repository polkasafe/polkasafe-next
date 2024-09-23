import Button from '@common/global-ui-components/Button'
import Modal from '@common/global-ui-components/Modal';
import AddCategoryForm from '@common/modals/AddNewCategory/AddCategoryForm';
import React, { useState } from 'react'
import { PlusCircleOutlined } from '@ant-design/icons';

const AddNewCategory = () => {
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
            <AddCategoryForm />
        </Modal>

    </div>
  )
}

export default AddNewCategory