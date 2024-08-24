'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
interface IProps {
  showChangeStatusModal:boolean;
  customer:ICustomerResponse
  setShowChangeStatusModal:(value:boolean) => void
  fetchCustomers:() =>void
}

function ChangeStatusModal(props:IProps) {

  const {showChangeStatusModal,customer,setShowChangeStatusModal,fetchCustomers} = props

  const handleChangeStatus = async () => {
    const res = await fetch(
        `http://localhost:8080/api/customer/change-status/${customer.customer_id}`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
            },
        }
    );
    const data = await res.json();
    fetchCustomers();
    setShowChangeStatusModal(false)
    if (data.result.status == 0) {
      toast.success(`Đã xóa khách hàng ${data.result.customer_name} thành công`)
    } else {
      toast.success(`Đã khôi phục khách hàng ${data.result.customer_name} thành công`)
    }
  }
  

  return (
    <>

      <Modal show={showChangeStatusModal} onHide={()=>setShowChangeStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn {customer.status==0?"khôi phục ":"xóa "} khách hàng {customer.customer_name} ?</Modal.Body>
        <Modal.Footer>
          <Button style={{backgroundColor:"#2a2f5b"}} onClick={()=>setShowChangeStatusModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={()=>handleChangeStatus()}>
            {customer.status==0?"Khôi phục":"Xóa "}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeStatusModal;