"use client"
import Table from 'react-bootstrap/Table';
import "@/styles/account.css"
import { Button } from 'react-bootstrap';
import { use, useState } from 'react';
import cookie from 'js-cookie';
import Form from 'react-bootstrap/Form';
import { mutate } from 'swr';
import ChangeStatusModal from './change_status_modal';
interface IProps {
    accounts: IAccount[]
}

const AccountTable = (props: IProps) => {
    const [accounts, setAccounts] = useState(props.accounts)
    const [showChangeStatusModal,setShowChangeStatusModal] = useState<boolean>(false)
    const [account_id, setAccount_id] = useState<string>('')
    const[checked,setChecked] = useState<boolean>(false);

    const fetchData = async () => {
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
        
        mutate("http://localhost:8080/api/account/my-info")

        const accounts: IAccount[] = data.result
        setAccounts(accounts)
    };

    const handleChangeStatus = async (account_id:string,e:boolean) => {
       setAccount_id(account_id);
       setShowChangeStatusModal(true)
       setChecked(e)
    }

 
    return (
        <>
            <div className='div-add' >
                <Button>Thêm tài khoản</Button>
            </div>

            <Table striped bordered hover className='table' >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên tài khoản</th>
                        <th>Email</th>
                        <th>Quyền</th>
                        <th>Thời gian tạo</th>
                        <th>Hoạt động</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {accounts?.map((account, index) => {
                        return (
                            <tr key={account.account_id}>
                                <td>{index + 1}</td>
                                <td>{account.account_name}</td>
                                <td>{account.email}</td>
                                <td>{account.role_name}</td>
                                <td>{account.time}</td>
                                <td>
                                    <Form.Check className='check-active' 
                                        checked={account.status == '1'}
                                        onChange={(e) => handleChangeStatus(account.account_id, e.target.checked)}
                                        type="switch"
                                        id="custom-switch"
                                    />
                                     {/* <Button variant='warning'
                                     onClick={()=> fetchData()}
                                     >Edit</Button> */}
                                </td>
                                <td>
                                    <Button variant='warning'>Edit</Button>
                                </td>
                            </tr>
                        )

                    })}

                </tbody>
            </Table>
           <ChangeStatusModal
           showChangeStatusModal= {showChangeStatusModal}
           setShowChangeStatusModal = {setShowChangeStatusModal}
           fetchData = {fetchData}
           account_id= {account_id}
           checked = {checked}
           />
        </>
    )
}

export default AccountTable