'use client'
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '@/styles/header.css'
import { useEffect, useState } from 'react';
import AppSidebar from './app_sidebar';
import { NavDropdown } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import { getSessionId, removeSessionId } from '@/utils/session_store';
import cookie from 'js-cookie';
import useSWR,{Fetcher} from "swr";
import Link from "next/link";
import { usePathname } from 'next/navigation'
const AppHeader =  (props:any) => {
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const account = props.account
    const [permission, setPermission] = useState<string[]>([])
    const pathName = usePathname()

    useEffect(() => {
        let permissionString:string[] = []
        for (let i:number = 0; i< account.role.permissions.length; i++) {
            permissionString.push(account.role.permissions[i].permission_id)
        }
        setPermission(permissionString)
    }, [])
      

    const handleShowSidebar = () => {
        setShowSidebar(true)
    }

    const handleLogout = () => {
        cookie.remove('session-id');
        window.location.href = '/';
    }
    



    return (
        <>
            <Navbar className='bg-body-tertiary header'>
                <Navbar.Brand >
                    <Button className='btn-sidebar'
                        onClick={() => handleShowSidebar()}
                    >
                        <span className="navbar-toggler-icon" ></span>
                    </Button>
                    {/* <Image
                        src="/images/logo.jpg"
                        alt="Example Image"
                        width={70} // Chiều rộng hình ảnh
                        height={50} // Chiều cao hình ảnh
                    /> */}
                </Navbar.Brand>

                <Navbar.Toggle />

                <Navbar.Collapse className="justify-content-end">
                    {/* <Navbar.Text className='div-user'> */}

                    <Dropdown>
                        <Dropdown.Toggle className='btn-dropdown'>
                            <i className="fa-solid fa-user"></i>
                            <span className='user-name' >{account?.employee.employee_name}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu >
                            <Dropdown.Item as={'button'} >
                            <Link href={`/management/profile`}>Cá nhân </Link>
                            </Dropdown.Item>

                           
                            
                            <Dropdown.Item href="/#">Thông tin đặt chổ</Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                            onClick={()=> handleLogout()}
                            >Đăng xuất</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>


                    {/* <i className="fa-solid fa-user"></i>
                        <span className='user-name' >Nguyễn Văn A</span> */}
                    {/* </Navbar.Text> */}
                </Navbar.Collapse>
            </Navbar>
            <AppSidebar
                showSidebar={showSidebar}
                setShowSidebar={setShowSidebar}
                permission = {permission}
            />
        </>
    )
}

export default AppHeader