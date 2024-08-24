'use client'
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
import { mutate } from 'swr';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { ExportError } from '@/utils/export_error';
interface IProps {
  showChangeStatusModal: boolean;
  detail: string
  setShowChangeStatusModal: (value: boolean) => void
  api: string
  objectError:any
  statusObject:number;
  handleChangeStatusState:() =>void
}

function ChangeStatusModal(props: IProps) {

  const { showChangeStatusModal, setShowChangeStatusModal, api,objectError ,detail,statusObject,handleChangeStatusState} = props
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

    setShowChangeStatusModal(false)
    if (data.status == "SUCCESS") {
      if (data.result.status == 0) {
        toast.success(`Đã khóa thành công`)
        if (status != null) {
          router.push(pathname)
        }
      } else {
        toast.success(`Đã mở khóa thành công`)
        if (status != null) {
          router.push(pathname)
        }
      }
      handleChangeStatusState()
    } else {
      let errors = ExportError(data,objectError);
      for (let i:number = 0; i<errors.length; i++) {
          toast.error(errors[i]);
      }
    }
  }


  return (
    <>

      <Modal show={showChangeStatusModal} onHide={() => setShowChangeStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thông báo</Modal.Title>
        </Modal.Header>
        <Modal.Body>{detail}</Modal.Body>
        <Modal.Footer>
          <Button style={{ backgroundColor: "#2a2f5b" }} onClick={() => setShowChangeStatusModal(false)}>
            Đóng
          </Button>
          <Button variant="danger" onClick={() => handleChangeStatus()}>
            {statusObject == 0 ? "Mở khóa" : "Khóa"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ChangeStatusModal;