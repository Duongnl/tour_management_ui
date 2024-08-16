'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import "@/styles/category.css"
interface Iprops {
    showCategoryCreateModal: boolean,
    setShowCategoryCreateModal: (value: boolean) => void
}

const CategoryCreateModal = (props: Iprops) => {
    const { showCategoryCreateModal, setShowCategoryCreateModal } = props

    const handleClose = () => {
        setShowCategoryCreateModal(false)
    }

    const createCategory = () => {

    }

   


    return (
        <>
            <Modal
                show={showCategoryCreateModal}
                onHide={() => handleClose()}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>



                    <Form.Group
                        className="mb-3"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Chi tiết danh mục</Form.Label>
                        <Form.Control as="textarea" rows={4} isInvalid={false} />
                        <Form.Control.Feedback type="invalid">
                            Please choose a username.
                        </Form.Control.Feedback>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='btn-create-back ' onClick={() => handleClose()}>
                        Trở về
                    </Button>
                    <Button
                        onClick={() => createCategory()}
                        variant="success">Tạo</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default CategoryCreateModal