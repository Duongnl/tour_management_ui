'use client'
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import '@/styles/header.css'
import { useState } from 'react';
import AppSidebar from './app_sidebar';
import { NavDropdown } from 'react-bootstrap';
import { Dropdown } from 'react-bootstrap';
import Image from 'next/image';
import { getSessionId, removeSessionId } from '@/utils/session_store';
import cookie from 'js-cookie';
const AppHeader = (props:any) => {
    const [showSidebar, setShowSidebar] = useState<boolean>(false)
    const cookieValue = cookie.get('session-id');
    const handleShowSidebar = () => {
        setShowSidebar(true)
    }
    const account = props.account;

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
                            <span className='user-name' >{account.result.employee.employee_name}</span>
                        </Dropdown.Toggle>

                        <Dropdown.Menu >
                            <Dropdown.Item href="/#">Cá nhân</Dropdown.Item>
                            <Dropdown.Item href="/#">Cài đặt</Dropdown.Item>
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
            />
        </>
    )
}

export default AppHeader