'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Container, Table } from 'react-bootstrap';
import RoleErrorCode from '@/exception/role_error_code';
import { toast } from 'react-toastify';
import cookie from 'js-cookie';
import { ExportError } from '@/utils/export_error';

import { useSearchParams, useRouter, usePathname } from 'next/navigation'
interface IProps {
    showRoleModal: boolean
    setShowRoleModal: (value: boolean) => void
    fetchRoles: () => void
    setSearch: (value: string) => void
}


const RoleCreateModal = (props: IProps) => {
    const { showRoleModal, setShowRoleModal, fetchRoles ,setSearch} = props;

    const [permission, setPermission] = useState<string[]>([])

    const [role_name, setRole_name] = useState<string>('')
    const [validation, setValidation] = useState<boolean>(false)

    const pathName = usePathname()
    const router = useRouter()

    const deletePermission = (valueToRemove: string) => {
        setPermission(prevPermissions => prevPermissions.filter(perm => perm !== valueToRemove));
    }

    const addPermission = (newPermission: string) => {
        setPermission(prevPermissions => [...prevPermissions, newPermission]);
    };

    const permissionCategory: string[] = [
        "Quảng lý danh mục", "ACCESS_CATEGORY", "CREATE_CATEGORY", "UPDATE_CATEGORY", "CHANGE_CATEGORY_STATUS",
    ]
    const permissionTour: string[] = [
        "Quản lý tour", "ACCESS_TOUR", "CREATE_TOUR", "UPDATE_TOUR", "CHANGE_TOUR_STATUS",
    ]
    const permissionReserve: string[] = [
        "Quản lý đặt chổ", "ACCESS_RESERVE", "CREATE_RESERVE", "UPDATE_RESERVE", "CHANGE_RESERVE_STATUS",
    ]
    const permissionCustomer: string[] = [
        "Quản lý khách hàng", "ACCESS_CUSTOMER", "CREATE_CUSTOMER", "UPDATE_CUSTOMER", "CHANGE_CUSTOMER_STATUS",
    ]
    const permissionAccount: string[] = [
        "Quản lý người dùng", "ACCESS_ACCOUNT", "CREATE_ACCOUNT", "UPDATE_ACCOUNT", "CHANGE_ACCOUNT_STATUS",
    ]
    const permissionRole: string[] = [
        "Quản lý quyền", "ACCESS_ROLE", "CREATE_ROLE", "UPDATE_ROLE", "CHANGE_ROLE_STATUS",
    ]

    const permissionDefault: string[][] = [
        permissionCategory, permissionTour, permissionReserve, permissionCustomer, permissionAccount, permissionRole
    ]

    const handleHideModal = () => {
        setShowRoleModal(false);
        setRole_name('')
        setValidation(false)
        setPermission(Array(8).fill(''))
    }

    const handleCreate = async () => {
        if (validation) {

            const roleRequest: IRoleRequest = {
                role_name: role_name.trim(),
                permission: permission
            }


            const res = await fetch(
                "http://localhost:8080/api/role",
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                    },
                    body: JSON.stringify(roleRequest)
                }
            );

            const data = await res.json();
            if (data.status == "SUCCESS") {
                toast.success("Thêm mới quyền thành công")
                handleHideModal()
                fetchRoles()
                router.push(pathName)
                setSearch('')
            } else {
                let errors = ExportError(data, RoleErrorCode);
                for (let i: number = 0; i < errors.length; i++) {
                    toast.error(errors[i]);
                }
            }

        } else {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
        }

    }

    const handleRole_name = (e: string) => {
        const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
        if (regex.test(e)) {
          
            setValidation(true)
        } else {
            setValidation(false)
        }
        setRole_name(e);
    }

   

    return (
        <>
           {console.log("Validation : ",validation)}
            <Modal show={showRoleModal} fullscreen={true}
                onHide={() => { handleHideModal() }}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm quyền</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    
                    <Container>
                    <FloatingLabel className='mb-3 input-role-name' label="Tên quyền">
                        <Form.Control type="text" placeholder="..."
                            value={role_name}
                            onChange={(e) => handleRole_name(e.target.value)}
                            isValid={validation}
                            isInvalid = {role_name !=''&&!validation}
                          
                        />
             
                         <Form.Control.Feedback type="invalid">
                            {RoleErrorCode.ROLE_2}
                        </Form.Control.Feedback>
                        {/* <input type="text" className='input-error'
                            value={role_name_error}
                            disabled /> */}
                    </FloatingLabel>

                    <Table className='table-permission' >
                        <thead>
                            <tr>
                                <th></th>
                                <th><p className='text-permission' >Truy cập</p></th>
                                <th><p className='text-permission' >Thêm mới</p></th>
                                <th><p className='text-permission' >Chỉnh sửa</p></th>
                                <th><p className='text-permission' >Khóa, mở khóa</p></th>
                            </tr>
                        </thead>
                        <tbody>

                            {permissionDefault.map(pd => (
                                <tr>
                                    {
                                        pd.map((pdt, index) => {
                                            if (index == 0) {
                                                return (<td key={index}>{pdt}</td>)
                                            } else {
                                                return (<>
                                                    <td>
                                                        <Form.Check // prettier-ignore
                                                            type={'checkbox'}
                                                            id={'permission'}
                                                            onChange={(e) => {
                                                                e.target.checked == true ?
                                                                    addPermission(pdt) : deletePermission(pdt)
                                                            }}
                                                        />
                                                    </td>
                                                </>)
                                            }
                                        })
                                    }
                                </tr>
                            ))}

                            <tr>
                                <td>Truy cập tổng quan</td>
                                <td>
                                    <Form.Check // prettier-ignore
                                        type={'checkbox'}
                                        id={'permission'}
                                        onChange={(e) => {
                                            e.target.checked == true ?
                                                addPermission("ACCESS_DASHBOARD") : deletePermission("ACCESS_DASHBOARD")
                                        }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Truy cập lịch sử</td>
                                <td>
                                    <Form.Check // prettier-ignore
                                        type={'checkbox'}
                                        id={'permission'}
                                        onChange={(e) => {
                                            e.target.checked == true ?
                                                addPermission("ACCESS_HISTORY") : deletePermission("ACCESS_HISTORY")
                                        }}
                                    />
                                </td>
                            </tr>


                        </tbody>
                    </Table>
                    <div className='div-back-create' >
                        <Button className='btn-create-back'
                            onClick={() => handleHideModal()}
                        >Trở lại</Button>
                        <Button
                            onClick={() => handleCreate()}
                            variant="success" >Tạo</Button>
                    </div>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default RoleCreateModal
