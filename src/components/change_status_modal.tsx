'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { useSearchParams,useRouter,usePathname } from 'next/navigation'
interface IProps {
  showChangeStatusModal:boolean;
  name:string
  setShowChangeStatusModal:(value:boolean) => void
  fetchData:() =>void
  api:string
  statusObject:number
}

function ChangeStatusModal(props:IProps) {

  const {showChangeStatusModal,name,setShowChangeStatusModal,fetchData,statusObject,api} = props
  const searchParams = useSearchParams();
    // dang hoat dong
    const status = searchParams.get('status')
    const pathname = usePathname();

    const router = useRouter()
  const handleChangeStatus = async () => {
    const res = await fetch(
        api,
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
    if (data.result.status == 0) {
      toast.success(`Đã khóa thành công`)
      if (status!=null) {
        router.push(pathname)
      }
    } else {
      toast.success(`Đã mở khóa thành công`)
      if (status!=null) {
        router.push(pathname)
      }
    }
  }
  

  return (
    <>

      <Modal show={showChangeStatusModal} onHide={()=>setShowChangeStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn {statusObject==0?"mở khóa":"khóa"} {name} ?</Modal.Body>
        <Modal.Footer>
          <Button style={{backgroundColor:"#2a2f5b"}} onClick={()=>setShowChangeStatusModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={()=>handleChangeStatus()}>
            {statusObject==0?"Mở khóa":"Khóa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeStatusModal;