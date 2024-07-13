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
import useSWR,{Fetcher} from "swr";
const AppHeader =  () => {
    const [showSidebar, setShowSidebar] = useState<boolean>(false)

    const fetcher:Fetcher<any,string> = (url: string) => fetch(url,
        {
            headers: {
              Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
            },
        }
    ).then((res) => res.json());

    const { data, error, isLoading } = useSWR(
        `http://localhost:8080/api/account/myInfo`,
        fetcher, {
        revalidateIfStale: true,
        revalidateOnFocus: false,
        revalidateOnReconnect: false
    }
    );
    
    // const account = data;

    // const res = await fetch(
    //     "http://localhost:8080/api/account/myInfo",
        // {
        //   method: "GET",
        //   headers: {
        //     Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
        //   },
    //     }
    //   );
    
    //   const data = await res.json();

  
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
                            <span className='user-name' >{data?.result.employee.employee_name}</span>
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