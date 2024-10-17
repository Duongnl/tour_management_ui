'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import "@/styles/category.css"
import CategoryErrorCode from '@/exception/category_error_code';
import { toast } from 'react-toastify';
import { CreateSlug } from '@/utils/create_slug';
import cookie from 'js-cookie';
import { ExportError } from '@/utils/export_error';
import { useRouter, usePathname } from 'next/navigation'
import { fetchPostCategory } from '@/utils/serviceApiClient';
interface Iprops {
    showCategoryCreateModal: boolean,
    setShowCategoryCreateModal: (value: boolean) => void
    fetchCategories: () => void

    setSearch: (value: string) => void
}

const CategoryCreateModal = (props: Iprops) => {
    const { showCategoryCreateModal, setShowCategoryCreateModal,fetchCategories ,setSearch} = props

    const [validation, setValidation] = useState<boolean[]>([false, ...Array(2).fill(true)])

    const [category_name, setCategory_name] = useState<string>("")
    const [category_detail, setCategory_detail] = useState<string>("")
    const [url, setUrl] = useState<string>("");

    const pathName = usePathname()
    const router = useRouter()

    const handleClose = () => {
        setShowCategoryCreateModal(false)
        setValidation(Array(3).fill(false))
        setCategory_name("")
        setCategory_detail("")
        setUrl("")
    }

    const createCategory = async () => {
        // console.log("Validation", validation)
        if (!validation.some(v => v === false)) {

            const categoryRequest: ICategoryRequest = {
                category_name: category_name,
                category_detail: category_detail,
                url: url == '' ? CreateSlug(category_name) : url,
            }
            const data = await fetchPostCategory(categoryRequest)
            if(data.status === "SUCCESS") {
                toast.success(`Thêm mới danh mục ${category_name} thành công`)
                handleClose()
                fetchCategories()
                router.push(pathName)
                setSearch('')
            } else {
                let errors = ExportError(data, CategoryErrorCode);
                for (let i: number = 0; i < errors.length; i++) {
                    toast.error(errors[i]);
                }
            }


        } else {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
        }



        // console.log("Validation create category : ", !validation.some(v => v === false))
    }


    const handleCategoryName = (e: string) => {
        const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
        if (regex.test(e)) {
            validation[0] = true
        } else {
            validation[0] = false
        }
        setCategory_name(e);
    }

    const handleCategoryUrl = (e: string) => {
        const regex: RegExp = /^[a-zA-Z0-9 ]+(?:-[a-zA-Z0-9 ]+)*$/;
        if (regex.test(e)) {
            validation[1] = true
        } else {
            validation[1] = false
        }

        if (e === '') {
            validation[1] = true
        }
        setUrl(e);
    }

    const handleCategoryDetail = (e: string) => {
        const regex: RegExp = /^[\p{L}0-9 ,.\-]{0,255}$/u;
        if (regex.test(e)) {
            validation[2] = true
        } else {
            validation[2] = false
        }

        if (e === '') {
            validation[2] = true
        }
        setCategory_detail(e);
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

                    <FloatingLabel className='mb-3 float-lable-input' label="Tên danh mục">
                        <Form.Control type="text" placeholder="..."
                            value={category_name}
                            onChange={(e) => handleCategoryName(e.target.value)}
                            isValid={validation[0]}
                            isInvalid={category_name != '' && !validation[0]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryErrorCode.CATEGORY_2}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel className='mb-3 float-lable-input' label="Slug danh mục">
                        <Form.Control type="text" placeholder="..."
                            value={url}
                            onChange={(e) => handleCategoryUrl(e.target.value)}
                            isValid={url != '' && validation[1]}
                            isInvalid={url != '' && !validation[1]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryErrorCode.CATEGORY_4}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <Form.Group
                        className="mb-3 input-textarea"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Chi tiết danh mục</Form.Label>
                        <Form.Control as="textarea" rows={4}
                            value={category_detail}
                            onChange={(e) => handleCategoryDetail(e.target.value)}
                            isValid={category_detail != '' && validation[2]}
                            isInvalid={category_detail != '' && !validation[2]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryErrorCode.CATEGORY_3}
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