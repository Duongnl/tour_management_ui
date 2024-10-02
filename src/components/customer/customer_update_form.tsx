"use client";
import { useState, useEffect, Suspense } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Col, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import CustomerErrorCode from "@/exception/customer_error_code";
import { toast } from "react-toastify";
import { ExportError } from "@/utils/export_error";
import { formatDate } from "@/utils/dateUtils";
import CustomerGroupModal from "./customer_group_modal";
import {
  handleAddress,
  handleDate,
  handleEmail,
  handleName,
  handleNameAndNumber,
  handlePhoneNumber,
} from "@/utils/handleUtils";
import { fetchPutCustomer } from "@/utils/serviceApiClient";
import { defaultICustomerResponse } from "@/utils/defaults";

interface IProps {
  customer: ICustomerDetailResponse;
  customers: ICustomerResponse[];
}

const CustomerUpdateForm = (props: IProps) => {
  const customerRes = props.customer;
  const customersRes = props.customers;
  const [validation, setValidation] = useState<boolean[]>(Array(8).fill(true));

  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS

  const [relationship, setRelationship] = useState<ICustomerResponse>(
    customerRes.customerParent ? customerRes.customerParent : defaultICustomerResponse
  );

  const handleSelectedRelationship = (relationship: ICustomerResponse) => {
    setRelationship(relationship);
    setRelationship_error("");
    validation[6] = true;
  };

  
  const [customer_name, setCustomerName] = useState<string>(
    customerRes.customer_name
  );
  const [sex, setSex] = useState<number>(customerRes.sex);
  const [relationship_name, setRelationshipName] = useState<string>(
    customerRes.relationship_name
  );
  const [phone_number, setPhone_number] = useState<string>(
    customerRes.phone_number
  );
  const [email, setEmail] = useState<string>(customerRes.email);
  const [address, setAddress] = useState<string>(customerRes.address);
  const [birthday, setBirthday] = useState<string>(
    formatDate(customerRes.birthday)
  );
  const [visa_expire, setVisaExpire] = useState<string>(
    formatDate(customerRes.visa_expire)
  );
  const [relationship_error, setRelationship_error] = useState<string>("");
  const [selectedGroup, setSelectedGroup] = useState<
    ICustomerResponse[] | null
  >(customerRes.customerGroup);

  const handleGenderChange = (value: number) => {
    setSex(value);
  };

  const handleRelationship = (e: string) => {
    setRelationship_error("Vui lòng chọn quyền ở mục đề xuất");
  };

  const handleUpdateCustomer = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validation.length; i++) {
      if (validation[i] == false || validation[i] == undefined) {
        flag = false;
        break;
      }
    }

    if (flag) {
      const initCustomerRequest: ICustomerRequest = {
        customer_name: customer_name,
        sex: sex,
        customer_rel_id: relationship?.customer_id ?? null,
        relationship_name: relationship_name,
        phone_number: phone_number,
        email: email,
        address: address,
        birthday: birthday,
        visa_expire: visa_expire,
        status: customerRes.status,
      };
      
      const data = await fetchPutCustomer(customerRes.customer_id.toString(),initCustomerRequest);
      console.log(data)
      if (data.status == "SUCCESS") {
        toast.success(`Cập nhật người dùng ${customer_name} thành công`);
      } else {
        let errors = ExportError(data, CustomerErrorCode);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        console.log("response:", data);
      }
    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ");
    }
  };

  const [showCustomerGroupModal, setShowCustomerGroupModal] = useState(false);

  const handleShowCustomerGroup = async () => {
    setSelectedGroup(customerRes.customerGroup);
    setSelectedGroup([...customerRes.customerGroup, customerRes.customerParent]);
    setShowCustomerGroupModal(true);
  };

  // Hàm này để đóng modal
  const handleCloseModal = () => {
    setShowCustomerGroupModal(false);
    setSelectedGroup(null);
  };

  const updateValidation = (index: number, isValid: boolean) => {
    setValidation((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };

  return (
    <>
      <Row>
        <Col>
          <FloatingLabel className="mb-3" label="Tên khách hàng">
            <Form.Control
              type="text"
              placeholder="..."
              value={customer_name}
              className="form-control"
              onChange={(e) =>
                handleName(
                  e.target.value,
                  (isValid) => updateValidation(0, isValid),
                  setCustomerName
                )
              }
              isValid={validation[0]}
              isInvalid={customer_name != "" && !validation[0]}
            />
            <Form.Control.Feedback type="invalid">
              {CustomerErrorCode.CUSTOMER_14}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel className="mb-3" label="Email">
            <Form.Control
              type="text"
              placeholder="..."
              value={email}
              className="form-control"
              onChange={(e) =>
                handleEmail(
                  e.target.value,
                  (isValid) => updateValidation(1, isValid),
                  setEmail
                )
              }
              isValid={validation[1]}
              isInvalid={email != "" && !validation[1]}
            />
            <Form.Control.Feedback type="invalid">
              {CustomerErrorCode.CUSTOMER_9}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel className="mb-3" label="Số điện thoại">
            <Form.Control
              type="text"
              placeholder="..."
              value={phone_number}
              className="form-control"
              onChange={(e) =>
                handlePhoneNumber(
                  e.target.value,
                  (isValid) => updateValidation(2, isValid),
                  setPhone_number
                )
              }
              isValid={validation[2]}
              isInvalid={phone_number != "" && !validation[2]}
            />
            <Form.Control.Feedback type="invalid">
              {CustomerErrorCode.CUSTOMER_8}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel className="mb-3" label="Địa Chỉ">
            <Form.Control
              type="text"
              placeholder="..."
              value={address}
              className="form-control"
              onChange={(e) =>
                handleAddress(
                  e.target.value,
                  (isValid) => updateValidation(3, isValid),
                  setAddress
                )
              }
              isValid={validation[3]}
              isInvalid={address != "" && !validation[3]}
            />
            <Form.Control.Feedback type="invalid">
              {CustomerErrorCode.CUSTOMER_11}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel className="mb-3" label="Ngày sinh">
            <Form.Control
              type="date"
              className="form-control rbt-input"
              placeholder="Ngày sinh"
              value={birthday}
              onChange={(e) =>
                handleDate(
                  e.target.value,
                  (isValid) => updateValidation(4, isValid),
                  setBirthday
                )
              }
              isValid={validation[4]}
              isInvalid={birthday != "" && !validation[4]}
            />
            <Form.Control.Feedback type="invalid">
              {CustomerErrorCode.CUSTOMER_12}
            </Form.Control.Feedback>
          </FloatingLabel>
        </Col>
        <Col>
          <FloatingLabel className="mb-3" label="Giới tính">
            <Form.Select
              aria-label="Default select example"
              className="rbt-input"
              value={sex}
              onChange={(e) => handleGenderChange(Number(e.target.value))}
            >
              <option value="1">Nam</option>
              <option value="0">Nữ</option>
              <option value="2">Khác</option>
            </Form.Select>
          </FloatingLabel>
          <div className="form-floating mb-3">
            <Typeahead
              id="typeahead-representative" // Cung cấp ID duy nhất cho Typeahead
              selected={relationship ? [relationship] : []}
              placeholder="Chọn người đại diện"
              onChange={(relationship: ICustomerResponse[]) => {
                handleSelectedRelationship(relationship[0]);
              }}
              labelKey={(selected: ICustomerResponse) => selected.customer_name} // Sử dụng thuộc tính `customer_name` để hiển thị trong Typeahead
              options={customersRes}
              onInputChange={(e: string) => handleRelationship(e)}
            />
            <input
              type="text"
              className="input-error"
              value={relationship_error}
              disabled
            />
          </div>

          <FloatingLabel className="mb-3" label="Quan hệ với người đại diện">
            <Form.Control
              type="text"
              placeholder="..."
              value={relationship_name}
              className="form-control"
              onChange={(e) =>
                handleNameAndNumber(
                  e.target.value,
                  (isValid) => updateValidation(5, isValid),
                  setRelationshipName
                )
              }
              isValid={validation[5]}
              isInvalid={relationship_name != "" && !validation[5]}
            />
            <Form.Control.Feedback type="invalid">
              {CustomerErrorCode.CUSTOMER_14}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel className="mb-3" label="Hạn Visa">
            <Form.Control
              type="date"
              className="form-control rbt-input"
              placeholder="Ngày hết hạn Visa"
              value={visa_expire}
              onChange={(e) =>
                handleDate(
                  e.target.value,
                  (isValid) => updateValidation(6, isValid),
                  setVisaExpire
                )
              }
              isValid={validation[6]}
              isInvalid={visa_expire != "" && !validation[6]}
            />
            <Form.Control.Feedback type="invalid">
              {CustomerErrorCode.CUSTOMER_13}
            </Form.Control.Feedback>
          </FloatingLabel>

          <Button
            variant="outline-danger"
            onClick={() => handleShowCustomerGroup()}
            className="rbt-input"
          >
            Xem các khách hàng liên quan
          </Button>
        </Col>
      </Row>

      <div className="div-back-create">
        <Button className="btn-back">
          <Link href={"/management/customer/"} className="link-back px-2 text-decoration-none text-white">
            Trở lại
          </Link>
        </Button>
        <Button onClick={() => handleUpdateCustomer()} variant="success">
          Lưu
        </Button>
      </div>

      <CustomerGroupModal
        show={showCustomerGroupModal}
        onHide={handleCloseModal}
        group={selectedGroup}
      />
    </>
  );
};

export default CustomerUpdateForm;
