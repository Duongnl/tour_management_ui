'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
interface IProps {
  showChangeStatusModal:boolean;
  account:IAccountResponse
  setShowChangeStatusModal:(value:boolean) => void
  fetchAccounts:() =>void
}

function ChangeStatusModal(props:IProps) {

  const {showChangeStatusModal,account,setShowChangeStatusModal,fetchAccounts} = props

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
    fetchAccounts();
    setShowChangeStatusModal(false)
    if (data.result.status == 0) {
      toast.success(`Đã khóa tài khoản ${data.result.account_name} thành công`)
    } else {
      toast.success(`Đã mở khóa tài khoản ${data.result.account_name} thành công`)
    }
  }
  

  return (
    <>

      <Modal show={showChangeStatusModal} onHide={()=>setShowChangeStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn {account.status==0?"mở khóa":"khóa"} tài khoản {account.account_name} ?</Modal.Body>
        <Modal.Footer>
          <Button style={{backgroundColor:"#2a2f5b"}} onClick={()=>setShowChangeStatusModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={()=>handleChangeStatus()}>
            {account.status==0?"Mở khóa":"Khóa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeStatusModal;