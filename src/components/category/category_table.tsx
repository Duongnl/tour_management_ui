'use client'
import '@/styles/table.css'
import { useEffect, useState } from 'react';
import { Button, Form, InputGroup, Table } from 'react-bootstrap';
import Link from 'next/link';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import PaginationTable from '../pagination';
import cookie from 'js-cookie';
import CategoryCreateModal from './category_create_modal';
import "@/styles/category.css"
import { CreateSlug } from '@/utils/create_slug';
import CategoryUpdateModal from './category_update_modal';
import ChangeStatusModal from '../change_status_modal';
import CategoryErrorCode from '@/exception/category_error_code';
interface IProps {
    categories: ICategoryResponse[]
}

const CategoryTable = (props: IProps) => {

    const [categories, setCategories] = useState<ICategoryResponse[]>(props.categories)

    const [categoriesFilter, setCategoriesFilter] = useState<ICategoryResponse[]>(props.categories);

    // trang hiện tại
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page')
    // kiem tra trang thai
    const status = searchParams.get('status')
    const category_slug = searchParams.get('category')

    // tổng số trang
    const [numberPages, setNumberPages] = useState<number>(Math.ceil(categories != undefined ? categories.length / 8 : 0))

    // số phần tử hiển thị
    const [numberStart, setNumberStart] = useState<number>(0);
    const [numberEnd, setNumberEnd] = useState<number>(0);

    // tim kiem
    const [search, setSearch] = useState<string>('')

    const router = useRouter()
    const pathname = usePathname();

    const [showCategoryCreateModal, setShowCategoryCreateModal] = useState<boolean>(false)
    const [showCategoryUpdateModal, setShowCategoryUpdateModal] = useState<boolean>(false)


    const [category_id, setCategory_id] = useState<number>(0)

    const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false)

    const [apiChangeStatus, setApiChangeStatus] = useState<string>('')

    const [statusObject, setStatusObject] = useState<number>(0);


    const [detail, setDetail] = useState<string>('')


    const handleChangeStatus = (category: ICategoryResponse) => {
        setCategory_id(category.category_id)
        setStatusObject(category.status)
        setShowChangeStatusModal(true)
        setApiChangeStatus(`http://localhost:8080/api/category/change-status/${category.category_id}`)
        if (category.status == 1) {
            setDetail(`Bạn có muốn tắt quyền ${category.category_name} ?`)
        } else {
            setDetail(`Bạn có muốn mở quyền ${category.category_name} ?`)
        }
    }

    const handleChangeStatusState = () => {
        setCategories(
            categories.map(a => a.category_id === category_id ? { ...a, status: a.status === 1 ? 0 : 1 } : a)
        )
        setCategoriesFilter(
            categoriesFilter.map(a => a.category_id === category_id ? { ...a, status: a.status === 1 ? 0 : 1 } : a)
        )
    }


    useEffect(() => {
        let start = 1;
        let end = 8;

        for (let i = 1; i < Number(currentPage); i++) {
            start += 8;
            end += 8;
        }

        setNumberStart(start); // khi useEffect kết thúc thì mới lên lịch cập nhật biến vào number start
        setNumberEnd(end);// nên không nên cập nhật liên tục để dựa vào biến number để tính toán ngay trong useEffect
    }, [currentPage])


    const handleSearch = (e: string) => {
        router.push(`${pathname}?${status != null ? `status=${status}` : ''}`)
        setSearch(e)
        const filteredData = categories.filter((item) => {
            return Object.values(item).some((value) => {
                // Kiểm tra nếu value không phải là null hoặc undefined
                return value != null && value.toString().toLowerCase().includes(e.toLowerCase());
            });
        });
        setCategoriesFilter(filteredData)
        setNumberPages(Math.ceil(filteredData.length / 8))
        console.log("Categories : ", categories)
    }

    const handleSelectStatus = (e: string) => {
        router.push(`${pathname}?status=${e}`)
    }

    useEffect(() => {
        if (status == "active") {
            fetchActiveCategories()
        } else if (status == "locked") {
            fetchLockedCategories()
        } else if (status == "all") {
            fetchCategories()
        }
    }, [status])

    useEffect(() => {
        console.log("Category_slug : ", category_slug)
        if (category_slug != null && category_slug != '') {
            setShowCategoryUpdateModal(true)
        } else {
            setShowCategoryUpdateModal(false)
        }
    }, [category_slug])

    const fetchCategories = async () => {
        const res = await fetch(
            "http://localhost:8080/api/category",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                },
            }
        );
        const data = await res.json();
        const categories: ICategoryResponse[] = data.result
        setCategoriesFilter(categories)
        const numPages = Math.ceil(categories != undefined ? categories.length / 8 : 0);
        setNumberPages(numPages);
        setCategories(categories)
    };

    const fetchLockedCategories = async () => {
        const res = await fetch(
            "http://localhost:8080/api/category/locked",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                },
            }
        );
        const data = await res.json();
        const categories: ICategoryResponse[] = data.result
        setCategoriesFilter(categories)
        const numPages = Math.ceil(categories != undefined ? categories.length / 8 : 0);
        setNumberPages(numPages);
        setCategories(categories)
    };


    const fetchActiveCategories = async () => {
        const res = await fetch(
            "http://localhost:8080/api/category/active",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                },
            }
        );
        const data = await res.json();
        const categories: ICategoryResponse[] = data.result
        setCategoriesFilter(categories)
        const numPages = Math.ceil(categories != undefined ? categories.length / 8 : 0);
        setNumberPages(numPages);
        setCategories(categories)
    };

    const handleCreate = () => {
        setShowCategoryCreateModal(true)
    }


    return (
        <>
            <div className='div-add mb-4 d-flex flex-wrap justify-content-start'>
                    <InputGroup className="input-search width-primary m-1"
                    >
                        <InputGroup.Text id="basic-addon1"

                        ><i className="fa-solid fa-magnifying-glass"></i></InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm"
                            aria-describedby="basic-addon1"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select aria-label="Default select example" className='select-status width-primary m-1'
                        value={status || ''} // Đặt giá trị hiện tại
                        onChange={(e) => handleSelectStatus(e.target.value)}
                    >
                        <option hidden>Trạng thái</option>
                        <option value='all' >Tất cả</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="locked">Đã khóa</option>
                    </Form.Select>
        

                <Button className='btn-add width-primary mr-1 my-1 ms-auto'
                    onClick={() => handleCreate()}
                >
                    <i className="fa-solid fa-plus" style={{ paddingRight: '10px' }}></i>
                    Thêm danh mục</Button>
            </div>
            <div className="table-wrapper">
                <Table striped bordered hover id="myTable" className="table"  >
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên danh mục</th>
                            <th>Hoạt động</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriesFilter?.map((category, index) => {
                            if ((index + 1) >= numberStart && (index + 1) <= numberEnd) {
                                return (
                                    <tr key={category.category_id}>
                                        <td>{index + 1}</td>
                                        <td>{category.category_name}</td>
                                        <td>
                                            <Form.Check className='check-active'
                                                checked={category.status == 1}
                                                onChange={() => handleChangeStatus(category)}
                                                type="switch"
                                                id="custom-switch"

                                            />
                                        </td>
                                        <td>
                                            <Button variant='outline-secondary' className='btn-update' >
                                                <Link href={`${pathname}?category=${CreateSlug(category.category_name)}-${category.category_id}`} className='' >
                                                    <i className="fa-solid fa-pen-to-square" style={{ color: "black" }}  ></i>
                                                </Link>
                                            </Button>
                                            <Button variant='outline-secondary' className='btn-update'>
                                                <Link href={`./tour?category=${category.category_id}`} className='' >
                                                    <i className="fa-solid fa-eye" style={{ color: "black" }} ></i>
                                                </Link>

                                            </Button>
                                        </td>
                                    </tr>
                                )
                            }
                        })}

                    </tbody>
                </Table>
            </div>
            <PaginationTable
                numberPages={numberPages}
                currentPage={Number(currentPage)}
            />
            <CategoryCreateModal
                showCategoryCreateModal={showCategoryCreateModal}
                setShowCategoryCreateModal={setShowCategoryCreateModal}
                fetchCategories={fetchCategories}
                setSearch={setSearch}
            />
            <CategoryUpdateModal
                showCategoryUpdateModal={showCategoryUpdateModal}
                setShowCategoryUpdateModal={setShowCategoryUpdateModal}
                fetchCategories={fetchCategories}
            />
            <ChangeStatusModal
                showChangeStatusModal={showChangeStatusModal}
                setShowChangeStatusModal={setShowChangeStatusModal}
                handleChangeStatusState={handleChangeStatusState}
                statusObject={statusObject}
                detail={detail}
                api={apiChangeStatus}
                objectError={CategoryErrorCode}
            />


        </>
    )
}

export default CategoryTable