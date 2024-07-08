'use client'
import { Button } from "react-bootstrap";
import { useState } from "react";
import { Offcanvas } from "react-bootstrap";
import "@/styles/sidebar.css"
import Link from "next/link";
import { Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { usePathname } from 'next/navigation'
import path from "path";
interface Iprops {
  showSidebar: boolean;
  setShowSidebar: (value: boolean) => void
  
}


const AppSidebar = (props: Iprops) => {

  const { showSidebar, setShowSidebar } = props;
  const pathName = usePathname()
  console.log(pathName)

  return (
    <>
      <Offcanvas className="sidebar" show={showSidebar} onHide={() => setShowSidebar(false)}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Quản lý</Offcanvas.Title>
        </Offcanvas.Header>
        
        <Offcanvas.Body>

          <Link href={"/management/category"} className='link-tab-sidebar' 
          onClick={()=>setShowSidebar(false)}
          >
            <Navbar className =  {`${"bg-body-tertiary tab-sidebar"} ${pathName.includes("category")? "active" : ""}`}>
              <Container>
                <span className='name-tab-sidebar'>Danh mục</span>
              </Container>
            </Navbar>
          </Link>
          <br/>
          <Link href={"/management/tour"} className='link-tab-sidebar'
           onClick={()=>setShowSidebar(false)}
          >
            <Navbar className= {`${"bg-body-tertiary tab-sidebar"} ${pathName.includes("tour")? "active" : ""}`}>
              <Container>
                <span className='name-tab-sidebar'>Tour </span>
              </Container>
            </Navbar>
          </Link>
          <br/>
          <Link href={"/management/reserve"} className='link-tab-sidebar' 
           onClick={()=>setShowSidebar(false)}
          >
            <Navbar className={`${"bg-body-tertiary tab-sidebar"} ${pathName.includes("reserve")? "active" : ""}`}>
              <Container>
                <span className='name-tab-sidebar'>Đặt chổ</span>
              </Container>
            </Navbar>
          </Link>
          <br/>
          <Link href={"/management/customer"} className='link-tab-sidebar'
           onClick={()=>setShowSidebar(false)}
          >
            <Navbar className={`${"bg-body-tertiary tab-sidebar"} ${pathName.includes("customer")? "active" : ""}`}>
              <Container>
                <span className='name-tab-sidebar'>Khách hàng</span>
              </Container>
            </Navbar>
          </Link>
          <br/>
          <Link href={"/management/account"} className='link-tab-sidebar'
           onClick={()=>setShowSidebar(false)}
          >
            <Navbar className={`${"bg-body-tertiary tab-sidebar"} ${pathName.includes("account")? "active" : ""}`}>
              <Container>
                <span className='name-tab-sidebar'>Người dùng</span>
              </Container>
            </Navbar>
          </Link>
          <br/>
          <Link href={"/management/history"} className='link-tab-sidebar'
           onClick={()=>setShowSidebar(false)}
          >
            <Navbar className={`${"bg-body-tertiary tab-sidebar"} ${pathName.includes("history")? "active" : ""}`}>
              <Container>
                <span className='name-tab-sidebar'>Lịch sử</span>
              </Container>
            </Navbar>
          </Link>
          <br/>



 
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
export default AppSidebar