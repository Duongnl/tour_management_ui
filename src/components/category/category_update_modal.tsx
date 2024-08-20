'use client'
import { useEffect, useState } from 'react';
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
import { useSearchParams, useRouter, usePathname } from 'next/navigation'

interface IProps {
    showCategoryUpdateModal: boolean,
    setShowCategoryUpdateModal: (value: boolean) => void
    fetchCategories : () =>void
}

const CategoryUpdateModal = (props:IProps) => {

    const {showCategoryUpdateModal,setShowCategoryUpdateModal,fetchCategories} = props 
    const [validation, setValidation] = useState<boolean[]>(Array(3).fill(true))
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const category_slug = searchParams.get('category')
    const [category_name,setCategory_name] = useState<string>('')
    const [category_detail, setCategory_detail] = useState<string>('')
    const [url,setUrl] = useState <string> ('')
    const [category, setCategory] = useState<ICategoryResponse>({
        category_id:0,
        category_name:'',
        category_detail:'',
        url:'',
        status:0,
    })

    useEffect (() => {

        const fetchCategory = async () => {
       
              const res = await fetch(
                `http://localhost:8080/api/category/${category_slug}`,
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                  },
                }
              );
              const data = await res.json();

              if (data.status == "SUCCESS") {
                const category:ICategoryResponse = data.result;
                setCategory_name(category.category_name)
                setCategory_detail (category.category_detail)
                setUrl( category.url)
                setCategory(category)
              } else {
                 toast.error(CategoryErrorCode.CATEGORY_1)
                 handleClose()
              }
            
          }

          if (category_slug != null && category_slug != '') {
            fetchCategory()
          }

    },[category_slug])

    const handleClose = () => {
        setShowCategoryUpdateModal(false)
        router.push(pathName)
        fetchCategories()
        setValidation(Array(3).fill(true))
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

    const updateCategory =  async() => {
        if (!validation.some(v => v === false)) { 
            const categoryRequest: ICategoryRequest = {
                category_name: category_name,
                category_detail: category_detail,
                url: url
            }

            const res = await fetch(
                `http://localhost:8080/api/category/${category_slug}`,
                {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                    },
                    body: JSON.stringify(categoryRequest)
                }
            );

            const data = await res.json();
            if(data.status === "SUCCESS") {
                toast.success(`Sửa danh mục ${category_name} thành công`)
                handleClose()
                fetchCategories()
                const category:ICategoryResponse = data.result;
                setCategory(category)
            } else {
                let errors = ExportError(data, CategoryErrorCode);
                for (let i: number = 0; i < errors.length; i++) {
                    toast.error(errors[i]);
                }
            }

        } else {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
        }
    }


    return (
        <>
            <Modal
                show={showCategoryUpdateModal}
                onHide={() => handleClose()}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết danh mục</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FloatingLabel className='mb-3 float-lable-input' label="Tên danh mục">
                        <Form.Control type="text" placeholder="..."
                            value={category_name}
                            onChange={(e) => handleCategoryName(e.target.value)}
                            isValid={category_name!= category.category_name &&  validation[0]}
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
                            isValid={url!= category.url && validation[1]}
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
                            isValid={category_detail != category.category_detail && validation[2]}
                            isInvalid={category_detail != '' && !validation[2]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {CategoryErrorCode.CATEGORY_3}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='btn-create-back ' 
                    onClick={() => handleClose()}
                    >
                        Trở về
                    </Button>
                    <Button
                        onClick={() => updateCategory()}
                        variant="success">Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default CategoryUpdateModal