'use client'
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import { Button, Table } from 'react-bootstrap';
import "@/styles/role.css"
import { useEffect, useState } from 'react';
import RoleErrorCode from '@/exception/role_error_code';
import Link from 'next/link';
import { ExportError } from '@/utils/export_error';
import { toast } from 'react-toastify';
import cookie from 'js-cookie';
import { fetchPutRole } from '@/utils/serviceApiClient';
interface IProps {
    role: IRoleResponse
    slug: string
}

const RoleUpdateForm = (props: IProps) => {
    const { role, slug } = props
    // console.log(role)
    const [permission, setPermission] = useState<string[]>([])
    const [role_name, setRole_name] = useState<string>(role.role_name)
    const [validation, setValidation] = useState<boolean>(true)

    const [valid,setValid] = useState<boolean>(false)
    const[roleRes,  setRoleRes] = useState<IRoleResponse>(role)

    const permissionCategory: string[] = [
        "Quảng lý danh mục", "ACCESS_CATEGORY", "CREATE_CATEGORY", "UPDATE_CATEGORY", "CHANGE_CATEGORY_STATUS",
    ]
    const permissionTour: string[] = [
        "Quản lý tour", "ACCESS_TOUR", "CREATE_TOUR", "UPDATE_TOUR", "CHANGE_TOUR_STATUS",
    ]
    // const permissionReserve: string[] = [
    //     "Quản lý đặt chổ", "ACCESS_RESERVE", "CREATE_RESERVE", "UPDATE_RESERVE", "CHANGE_RESERVE_STATUS",
    // ]
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
        permissionCategory, permissionTour, permissionCustomer, permissionAccount, permissionRole
    ]

    useEffect(() => {
        let permissionString: string[] = []
        for (let i: number = 0; i < role.permissions.length; i++) {
            permissionString.push(role.permissions[i].permission_id)
        }
        setPermission(permissionString)
    }, [])

    const handleRole_name = (e: string) => {
        setValid(true)
        const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
        if (regex.test(e)) {
            setValidation(true)
        } else {
            setValidation(false)
        }
        setRole_name(e);
    }

    const handleUpdate = async () => {
        if (validation) {

            const roleRequest: IRoleRequest = {
                role_name: role_name.trim(),
                permission: permission
            }
            console.log(roleRequest)

            const data = await fetchPutRole(slug,roleRequest)
            if (data.status == "SUCCESS") {
                toast.success("Cập nhật quyền thành công")
                setValid(false)
                const res:IRoleResponse = data.result
                setRoleRes(res)
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

    const deletePermission = (valueToRemove: string) => {
        setPermission(prevPermissions => prevPermissions.filter(perm => perm !== valueToRemove));
    }

    const addPermission = (newPermission: string) => {
        setPermission(prevPermissions => [...prevPermissions, newPermission]);
    };




    return (
        <>
            <FloatingLabel className='mb-3 input-role-name' label="Tên quyền">
                <Form.Control type="text" placeholder="..."
                    value={role_name}
                    onChange={(e) => handleRole_name(e.target.value)}
                    isValid={role_name != roleRes.role_name && valid && validation}
                    isInvalid = {role_name !=''&&!validation}
                />
                 <Form.Control.Feedback type="invalid">
                            {RoleErrorCode.ROLE_2}
                        </Form.Control.Feedback>
            </FloatingLabel>
            <div className="table-wrapper">
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

                        {permissionDefault.map((pd,index) => (
                            <tr key={index}>
                                {
                                    pd.map((pdt, index) => {
                                        if (index == 0) {
                                            return (<td>{pdt}</td>)
                                        } else {
                                            return (<>
                                                <td>
                                                    <Form.Check // prettier-ignore
                                                        checked={permission.includes(pdt)}
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
                                    checked={permission.includes("ACCESS_DASHBOARD")}
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
                                checked={permission.includes("ACCESS_HISTORY")}
                                type={'checkbox'}
                                id={'permission'}
                                onChange={(e) => {
                                    e.target.checked == true ?
                                        addPermission("ACCESS_HISTORY") : deletePermission("ACCESS_HISTORY")
                                }}
                            />
                        </td>
                    </tr>

                    <tr>
                                <td>Đặt chổ</td>
                                <td>
                                    <Form.Check // prettier-ignore
                                      checked={permission.includes("ACCESS_RESERVE")}
                                        type={'checkbox'}
                                        id={'permission'}
                                        onChange={(e) => {
                                            e.target.checked == true ?
                                                addPermission("ACCESS_RESERVE") : deletePermission("ACCESS_RESERVE")
                                        }}
                                    />
                                </td>
                                <td>
                                    <Form.Check // prettier-ignore
                                      checked={permission.includes("CREATE_RESERVE")}
                                        type={'checkbox'}
                                        id={'permission'}
                                        onChange={(e) => {
                                            e.target.checked == true ?
                                                addPermission("CREATE_RESERVE") : deletePermission("CREATE_RESERVE")
                                        }}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td>Thông tin đặt chổ</td>
                                <td>
                                    <Form.Check // prettier-ignore
                                      checked={permission.includes("ACCESS_BOOKED")}
                                        type={'checkbox'}
                                        id={'permission'}
                                        onChange={(e) => {
                                            e.target.checked == true ?
                                                addPermission("ACCESS_BOOKED") : deletePermission("ACCESS_BOOKED")
                                        }}
                                    />
                                </td>
                                <td>
                                   
                                </td>
                                <td>
                                <Form.Check // prettier-ignore
                                  checked={permission.includes("UPDATE_BOOKED")}
                                        type={'checkbox'}
                                        id={'permission'}
                                        onChange={(e) => {
                                            e.target.checked == true ?
                                                addPermission("UPDATE_BOOKED") : deletePermission("UPDATE_BOOKED")
                                        }}
                                    />
                                </td>
                            </tr>

                    </tbody>
                </Table>
            </div>
            <div className='div-back-create' >
                <Button className='btn-back'>
                    <Link href={'/management/role/'} className='link-back' >Trở lại</Link>
                </Button>
                <Button
                    onClick={() => { handleUpdate() }}
                    variant="success" >Lưu</Button>
            </div>
        </>
    )
}
export default RoleUpdateForm