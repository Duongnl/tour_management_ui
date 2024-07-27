'use client'
import Table from 'react-bootstrap/Table';
import "@/styles/account.css"
import { Button } from 'react-bootstrap';
import { use, useEffect, useState } from 'react';
import cookie from 'js-cookie';
import Form from 'react-bootstrap/Form';
import { mutate } from 'swr';
import ChangeStatusModal from './change_status_modal';
import { DataTable } from "simple-datatables"
import AccountCreateModal from './account_create_modal';
import { Anybody } from 'next/font/google';
import Link from 'next/link';
// import DataTable from 'datatables.net-dt';
import { CreateSlug } from '@/utils/create_slug';
import '@/styles/table.css'
import PaginationTable from './pagination';
import { useSearchParams,useRouter,usePathname } from 'next/navigation'

import InputGroup from 'react-bootstrap/InputGroup';
interface IProps {
    accounts: IAccountResponse[]

}

const AccountTable = (props: IProps) => {
    const [accounts, setAccounts] = useState(props.accounts)
    const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false)
    const [showAccountModal, setShowAccountModal] = useState<boolean>(false)
    const searchParams = useSearchParams();

    const[accountsCopy, setAccountsCopy] = useState<IAccountResponse[]> (accounts)

    // trang hiện tại
    const currentPage = searchParams.get('page')

    // dang hoat dong
    const status = searchParams.get('status')

    const router = useRouter()


    const pathname = usePathname();

    // tổng số trang
    const [numberPages, setNumberPages] = useState<number>(Math.ceil(accounts.length / 8))

    // số phần tử hiển thị
    const [numberStart, setNumberStart] = useState<number>(0);
    const [numberEnd, setNumberEnd] = useState<number>(0);

    const[search,setSearch] = useState<string>('')


    useEffect(() => {
        if (status == "active") {
            fetchActiveAccounts()
        } else if (status == "locked") {
            fetchLockedAccounts()
        } else if (status == "all") {
            fetchAccounts()
        }
    }, [status])

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


    // useEffect(() => {
    //     let table = new DataTable('#myTable',{
    //         perPage:5,
    //     });
    //     // Khởi tạo DataTable khi component đã được mount
    //     return () => {
    //         // Cleanup if necessary
    //     };
    // }, []);

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
        const numPages = Math.ceil(accounts.length / 8);
        setNumberPages(numPages);
        setAccountsCopy(accounts)
    };

    const fetchLockedAccounts = async () => {
        const res = await fetch(
            "http://localhost:8080/api/account/locked",
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
        const numPages = Math.ceil(accounts.length / 8);
        setNumberPages(numPages);
        setAccountsCopy(accounts)
    };

    const fetchActiveAccounts = async () => {
        const res = await fetch(
            "http://localhost:8080/api/account/active",
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
        const numPages = Math.ceil(accounts.length / 8);
        setNumberPages(numPages);
        setAccountsCopy(accounts)
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

    const handleSelectStatus = (e:string) => {
        router.push(`${pathname}?status=${e}`)
    }

    const handleSearch = (e:string) => {
        router.push(`${pathname}?${status!=null?`status=${status}`:''}`)
        setSearch(e)
        const filteredData = accountsCopy.filter((item) => {
            return Object.values(item).some((value) =>
              value.toString().toLowerCase().includes(e.toLowerCase())
            );
          });
          console.log('filter data : ',filteredData);
          setAccounts(filteredData)
          setNumberPages(Math.ceil(filteredData.length / 8))
    }



    return (
        <>


            <div className='div-add'>
                <div style={{display:"flex"}} >
                    <InputGroup className="input-search"
                    >
                        <InputGroup.Text id="basic-addon1"

                        ><i className="fa-solid fa-magnifying-glass"></i></InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm"
                            aria-describedby="basic-addon1"
                            value={search}
                            onChange={(e)=> handleSearch(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select aria-label="Default select example" className='select-status'
                    value={status || ''} // Đặt giá trị hiện tại
                    onChange={(e)=> handleSelectStatus(e.target.value)}
                    >
                        <option hidden>Trạng thái</option>
                        <option value='all' >Tất cả</option>
                        <option value="active">Đang hoạt động</option>
                        <option value="locked">Đã khóa</option>
                    </Form.Select>
                </div>


                <Button className='btn-add'
                    onClick={() => handleCreate()}>
                    <i className="fa-solid fa-user-plus" style={{ paddingRight: '10px' }}
                    ></i>Thêm tài khoản</Button>
            </div>

            <Table striped bordered hover id="myTable" className="table"  >
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
                        if ((index + 1) >= numberStart && (index + 1) <= numberEnd) {
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
                                    </td>
                                    <td>
                                        <Button variant='outline-secondary' className='btn-update' >

                                            <Link href={'/management/account/' + CreateSlug(`${account.employee_name} ${account.account_id}`)} className='link-update' >   <i className="fa-solid fa-user-pen" style={{ color: "black" }} ></i>

                                            </Link>
                                        </Button>
                                    </td>
                                </tr>
                            )
                        }
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
                showAccountModal={showAccountModal}
                setShowAccountModal={setShowAccountModal}
                fetchAccounts={fetchAccounts}
            />

            <PaginationTable
                numberPages={numberPages}
                currentPage={Number(currentPage)}

            />

        </>
    )
}

export default AccountTable