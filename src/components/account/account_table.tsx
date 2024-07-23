"use client"
import Table from 'react-bootstrap/Table';
import "@/styles/account.css"
import { Button } from 'react-bootstrap';
import { use, useState } from 'react';
import cookie from 'js-cookie';
import Form from 'react-bootstrap/Form';
import { mutate } from 'swr';
import ChangeStatusModal from './change_status_modal';
import { DataTable } from "simple-datatables"
import AccountCreateModal from './account_create_modal';
import { Anybody } from 'next/font/google';
import Link from 'next/link';
interface IProps {
    accounts: IAccountResponse[]
}

const AccountTable = (props: IProps) => {
    const [accounts, setAccounts] = useState(props.accounts)
    const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false)
    const [showAccountModal, setShowAccountModal] = useState<boolean>(false)

    const initAccount: IAccountResponse = {
        account_id: '',
        account_name: '',
        employee_name: '',
        time: '',
        status: 0,
        role_name: ''
    }


    const [account, setAccount] = useState<IAccountResponse>(initAccount)


    const fetchAccounts = async () => {
        const res = await fetch(
            "http://localhost:8080/api/account",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                },
            }
        );
        const data = await res.json();
        const accounts: IAccountResponse[] = data.result
        setAccounts(accounts)
    };



    const handleChangeStatus = async (account: IAccountResponse) => {
        setAccount(account)
        setShowChangeStatusModal(true)
    }

    const handleUpdate = (account: IAccountResponse) => {
        alert("hello")
    }

    const handleCreate = () => {
        setShowAccountModal(true)
     
    }
    var slugify = require('slugify')
    slugify('some string', {
        replacement: '-',  // replace spaces with replacement character, defaults to `-`
        remove: undefined, // remove characters that match regex, defaults to `undefined`
        lower: false,      // convert to lower case, defaults to `false`
        strict: false,     // strip special characters except replacement, defaults to `false`
        locale: 'vi',      // language code of the locale to use
        trim: true         // trim leading and trailing replacement chars, defaults to `true`
      })


    return (
        <>
            <div className='div-add' 
        
            >
                <Button className='btn-add'
                   onClick={()=>handleCreate()}> 
                   <i className="fa-solid fa-user-plus" style={{ paddingRight: '10px' }} 
                ></i>Thêm tài khoản</Button>
            </div>

            <Table striped bordered hover className='table' >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên tài khoản</th>
                        <th>Tên</th>
                        <th>Quyền</th>
                        <th>Thời gian tạo</th>
                        <th>Hoạt động</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {accounts?.map((account, index) => {
                        return (
                            <tr key={account.account_id}>
                                <td>{index + 1}</td>
                                <td>{account.account_name}</td>
                                <td>{account.employee_name}</td>
                                <td>{account.role_name}</td>
                                <td>{account.time}</td>
                                <td>
                                    <Form.Check className='check-active'
                                        checked={account.status == 1}
                                        onChange={() => handleChangeStatus(account)}
                                        type="switch"
                                        id="custom-switch"
                                    />
                                    {/* <Button variant='warning'
                                     onClick={()=> fetchAccounts()}
                                     >Edit</Button> */}
                                </td>
                                <td>
                                    <Button variant='outline-secondary'  className='btn-update' >
                                 
                                    <Link href={'/management/account/' + slugify(`${account.employee_name} ${account.account_id}` )} className='link-update' >   <i className="fa-solid fa-user-pen"  style={{color:"black"}} ></i> </Link>
                                    </Button>
                                </td>
                            </tr>
                        )

                    })}

                </tbody>
            </Table>
            <ChangeStatusModal
                showChangeStatusModal={showChangeStatusModal}
                setShowChangeStatusModal={setShowChangeStatusModal}
                fetchAccounts={fetchAccounts}
                account={account}
            />
            <AccountCreateModal
            showAccountModal = {showAccountModal}
            setShowAccountModal = {setShowAccountModal}
            fetchAccounts={fetchAccounts}
            />
        </>
    )
}

export default AccountTable