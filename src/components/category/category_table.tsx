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
            return Object.values(item).some((value) =>
                value.toString().toLowerCase().includes(e.toLowerCase())
            );
        });
        setCategoriesFilter(filteredData)
        setNumberPages(Math.ceil(filteredData.length / 8))
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
            <div className='div-add'>
                <div style={{ display: "flex" }} >
                    <InputGroup className="input-search"
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

                    <Form.Select aria-label="Default select example" className='select-status'
                        value={status || ''} // Đặt giá trị hiện tại
                        onChange={(e) => handleSelectStatus(e.target.value)}
                    >
                        <option hidden>Trạng thái</option>
                        <option value='all' >Tất cả</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="locked">Đã khóa</option>
                    </Form.Select>
                </div>


                <Button className='btn-add'
                    onClick={() => handleCreate()}
                >
                    <i className="fa-solid fa-plus" style={{ paddingRight: '10px' }}></i>
                    Thêm danh mục</Button>
            </div>

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
                                            // onChange={() => handleChangeStatus(role)}
                                            type="switch"
                                            id="custom-switch"

                                        />
                                    </td>
                                    <td>
                                        <Button variant='outline-secondary' className='btn-update' >
                                            <Link href={'/management/role/'} className='link-update' >
                                                <i className="fa-solid fa-pen-to-square" style={{ color: "black" }}  ></i>
                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        }
                    })}

                </tbody>
            </Table>
            <PaginationTable
                numberPages={numberPages}
                currentPage={Number(currentPage)}
            />
            <CategoryCreateModal
            showCategoryCreateModal ={showCategoryCreateModal}
            setShowCategoryCreateModal = {setShowCategoryCreateModal}
            />
        </>
    )
}

export default CategoryTable