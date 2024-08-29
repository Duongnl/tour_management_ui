// File: CustomerGroupModal.jsx
import { CreateSlug } from "@/utils/create_slug";
import { formatDate } from "@/utils/dateUtils";
import Link from "next/link";
import React from "react";
import { Modal, Button, Table, Container } from "react-bootstrap";

interface IProps {
  show: boolean;
  onHide: () => void;
  group: ICustomerResponse[] | null;
}

const CustomerGroupModal = (props: IProps) => {
  const { show, onHide, group } = props;

  return (
    <Modal show={show} onHide={onHide} fullscreen={true} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>Chi tiết nhóm người dùng</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {group ? (
            <div>
              <p>Số thành viên: {group.length}</p>

              <Table cellPadding="10" cellSpacing="0" bordered>
                <thead>
                  <tr>
                    <th>Tên Khách hàng</th>
                    <th>Giới tính</th>
                    <th>Quan hệ NĐD</th>
                    <th>Ngày sinh</th>
                  </tr>
                </thead>
                <tbody>
                  {group.map((customer, index) => (
                    <tr key={customer.customer_id}>
                      <td>
                        <Link
                          href={
                            customer.status == 1
                              ? '/management/customer/' + CreateSlug(`${customer.customer_name} ${customer.customer_id}` ):"#"
                          }
                        >
                          {customer.customer_name}
                        </Link>
                      </td>
                      <td>{customer.sex == 1 ? "Nam" : "Nữ"}</td>
                      <td>
                        {index == group.length - 1
                          ? customer.relationship_name + " (Người đại diện)"
                          : customer.relationship_name}
                      </td>
                      <td>{formatDate(customer.birthday)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <p>Không có thông tin nhóm.</p>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Đóng
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomerGroupModal;
