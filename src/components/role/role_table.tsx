'use client'
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import Link from 'next/link';
import { CreateSlug } from '@/utils/create_slug';
import '@/styles/table.css'
import { useState, useEffect } from 'react';
import PaginationTable from '../pagination';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import InputGroup from 'react-bootstrap/InputGroup';
import cookie from 'js-cookie';
import ChangeStatusModal from '../change_status_modal';
import RoleCreateModal from './role_create_modal';
import RoleErrorCode from '@/exception/role_error_code';
import { fetchGetRoles } from '@/utils/serviceApiClient';

interface IProps {
    roles: IRoleResponse[]
}

const RoleTable = (props: IProps) => {

    const [roles, setRoles] = useState<IRoleResponse[]>(props.roles)

    const [rolesFilter, setRolesFilter] = useState<IRoleResponse[]>(props.roles);

    // trang hiện tại
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page')
    // kiem tra trang thai
    const status = searchParams.get('status')

    // tổng số trang
    const [numberPages, setNumberPages] = useState<number>(Math.ceil(roles != undefined ? roles.length / 8 : 0))

    // số phần tử hiển thị
    const [numberStart, setNumberStart] = useState<number>(0);
    const [numberEnd, setNumberEnd] = useState<number>(0);

    // tim kiem
    const [search, setSearch] = useState<string>('')

    const router = useRouter()
    const pathname = usePathname();

    const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false)

    const [apiChangeStatus, setApiChangeStatus] = useState<string>('')

    const [statusObject, setStatusObject] = useState<number> (0);

    const [showRoleModal, setShowRoleModal] = useState<boolean>(false)

    const [detail,setDetail] = useState<string> ('')

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

    useEffect(() => {
        if (status == "active") {
            fetchActiveRoles()
        } else if (status == "locked") {
            fetchLockedRoles()
        } else if (status == "all") {
            fetchRoles()
        }
    }, [status])


    const fetchRoles = async () => {
        const roles: IRoleResponse[] =  await fetchGetRoles()
        setRolesFilter(roles)
        const numPages = Math.ceil(roles != undefined ? roles.length / 8 : 0);
        setNumberPages(numPages);
        setRoles(roles)
    };

    const fetchLockedRoles = async () => {
        const roles: IRoleResponse[] =  await fetchGetRoles(0)

        setRolesFilter(roles)
        const numPages = Math.ceil(roles != undefined ? roles.length / 8 : 0);
        setNumberPages(numPages);
        setRoles(roles)
    };


    const fetchActiveRoles = async () => {
        const roles: IRoleResponse[] =  await fetchGetRoles(1)
        setRolesFilter(roles)
        const numPages = Math.ceil(roles != undefined ? roles.length / 8 : 0);
        setNumberPages(numPages);
        setRoles(roles)
    };


    const handleSelectStatus = (e: string) => {
        router.push(`${pathname}?status=${e}`)
    }


    const handleSearch = (e: string) => {
        router.push(`${pathname}?${status != null ? `status=${status}` : ''}`)
        setSearch(e)
        const filteredData = roles.filter((item) => {
            return Object.values(item).some((value) => {
                // Kiểm tra nếu value không phải là null hoặc undefined
                return value != null && value.toString().toLowerCase().includes(e.toLowerCase());
            });
        });
        setRolesFilter(filteredData)
        setNumberPages(Math.ceil(filteredData.length / 8))
    }

    const [role_id,setRole_id] = useState<number> (0)
    const handleChangeStatusState = () => {
        setRoles(
            roles.map(a=> a.role_id === role_id ? {...a, status: a.status === 1 ? 0 : 1}:a )
        )
        setRolesFilter(
            rolesFilter.map(a=> a.role_id === role_id ? {...a, status: a.status === 1 ? 0 : 1}:a )
        )
    }


    const handleChangeStatus = (role: IRoleResponse) => {
        setRole_id(role.role_id)
        
        setStatusObject(role.status)
        setShowChangeStatusModal(true)
        setApiChangeStatus(`${process.env.NEXT_PUBLIC_URL_API}/role/change-status/${role.role_id}`)
        if (role.status == 1) {
        setDetail(`Bạn có muốn tắt quyền ${role.role_name} ?`)
        } else {
        setDetail(`Bạn có muốn mở quyền ${role.role_name} ?`)
        }
    }

    const handleCreate = () => {
        setShowRoleModal(true)

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
                    Thêm quyền</Button>
            </div>
            <div className="table-wrapper">
                <Table striped bordered hover id="myTable" className="table"  >
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên quyền</th>
                            <th>Hoạt động</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rolesFilter?.map((role, index) => {
                            if ((index + 1) >= numberStart && (index + 1) <= numberEnd) {
                                return (
                                    <tr key={role.role_id}>
                                        <td>{index + 1}</td>
                                        <td>{role.role_name}</td>
                                        <td>
                                            <Form.Check className='check-active'
                                                checked={role.status == 1}
                                                onChange={() => handleChangeStatus(role)}
                                                type="switch"
                                                id="custom-switch"
                                                
                                            />
                                        </td>
                                        <td>
                                            <Button variant='outline-secondary' className='btn-update' >
                                                <Link href={'/management/role/' + CreateSlug(`${role.role_name} ${role.role_id}`)} className='' >
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
            </div>
            <PaginationTable
                numberPages={numberPages}
                currentPage={Number(currentPage)}
            />

             <ChangeStatusModal
                showChangeStatusModal={showChangeStatusModal}
                setShowChangeStatusModal={setShowChangeStatusModal}
                handleChangeStatusState = {handleChangeStatusState}
                statusObject={statusObject}
                detail={detail}
                api={apiChangeStatus}
                objectError={ RoleErrorCode}
            />

            <RoleCreateModal
               showRoleModal={showRoleModal}
               setShowRoleModal={setShowRoleModal}
               fetchRoles = {fetchRoles}
               setSearch={setSearch}
            />
        </>
    )

}

export default RoleTable