"use client"
import Table from 'react-bootstrap/Table';
import "@/styles/customer.css"
import { Button } from 'react-bootstrap';
import { useState } from 'react';
import cookie from 'js-cookie';
import Form from 'react-bootstrap/Form';
import ChangeStatusModal from './change_status_modal';
import CustomerCreateModal from './customer_create_modal';
import Link from 'next/link';
import {formatDateHour } from '@/utils/dateUtils';
interface IProps {
    customers: ICustomerResponse[]
}

const CustomerTable = (props: IProps) => {
    const [customers, setCustomers] = useState(props.customers)
    const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false)
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false)

    const initCustomer: ICustomerResponse = {
        customer_id: 0,
        customer_name: '',
        phone_number: '',
        time: '',
        status: 0,
        sex:0,
        relationship_name:'',
        email:'',
        address:'',
        birthday:'',
        visa_expire:''
    }


    const [customer, setCustomer] = useState<ICustomerResponse>(initCustomer)


    const fetchCustomers = async () => {
        const res = await fetch(
            "http://localhost:8080/api/customer",
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                },
            }
        );
        const data = await res.json();
        const customers: ICustomerResponse[] = data.result
        setCustomers(customers)
    };



    const handleChangeStatus = async (customer: ICustomerResponse) => {
        setCustomer(customer)
        setShowChangeStatusModal(true)
    }

    const handleCreate = () => {
        setShowCustomerModal(true)
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
                ></i>Thêm khách hàng</Button>
            </div>

            <Table striped bordered hover className='table' >
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên khách hàng</th>
                        <th>Số điện thoại</th>
                        <th>Thời gian tạo</th>
                        <th>Ngày sinh</th>
                        <th>Xóa</th>
                        <th>Chi tiết</th>
                    </tr>
                </thead>
                <tbody>
                    {customers?.map((customer, index) => {
                        return (
                            <tr key={customer.customer_id}>
                                <td>{index + 1}</td>
                                <td>{customer.customer_name}</td>
                                <td>{customer.phone_number}</td>
                                <td>{formatDateHour(customer.time)}</td>
                                <td>{formatDateHour(customer.birthday)}</td>
                                <td>
                                    <Form.Check className='check-active'
                                        checked={customer.status == 1}
                                        onChange={() => handleChangeStatus(customer)}
                                        type="switch"
                                        id="custom-switch"
                                    />
                                </td>
                                <td>
                                    <Button variant='outline-secondary'  className='btn-update' >
                                 
                                    <Link href={'/management/customer/' + slugify(`${customer.customer_name} ${customer.customer_id}` )} className='link-update' >   <i className="fa-solid fa-user-pen"  style={{color:"black"}} ></i> </Link>
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
                fetchCustomers={fetchCustomers}
                customer={customer}
            />
            <CustomerCreateModal
            showCustomerModal = {showCustomerModal}
            setShowCustomerModal = {setShowCustomerModal}
            fetchCustomers={fetchCustomers}
            />
        </>
    )
}

export default CustomerTable