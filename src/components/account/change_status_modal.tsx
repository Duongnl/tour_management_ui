'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
interface IProps {
  showChangeStatusModal:boolean;
  account:IAccount
  setShowChangeStatusModal:(value:boolean) => void
  fetchData:() =>void
}

function ChangeStatusModal(props:IProps) {

  const {showChangeStatusModal,account,setShowChangeStatusModal,fetchData} = props

  const handleChangeStatus = async () => {
    const res = await fetch(
        `http://localhost:8080/api/account/change-status/${account.account_id}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
            },
        }
    );
    const data = await res.json();

    fetchData();
    setShowChangeStatusModal(false)
    if (data.result.status == '0') {
      toast.success("Đã khóa tài khoản thành công")
    } else {
      toast.success("Đã mở khóa tài khoản thành công")
    }
  }
  

  return (
    <>

      <Modal show={showChangeStatusModal} onHide={()=>setShowChangeStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn {account.status=='0'?"mở khóa":"khóa"} tài khoản này ?</Modal.Body>
        <Modal.Footer>
          <Button style={{backgroundColor:"#2a2f5b"}} onClick={()=>setShowChangeStatusModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={()=>handleChangeStatus()}>
            {account.status=='0'?"Mở khóa":"Khóa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeStatusModal;