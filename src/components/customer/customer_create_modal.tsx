"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import CustomerErrorCode from "@/exception/customer_error_code";
import { toast } from "react-toastify";
import { ExportError } from "@/utils/export_error";
import { defaultRelatioshipResponse } from "@/utils/defaults";
import {
  handleAddress,
  handleDate,
  handleEmail,
  handleName,
  handleNameAndNumber,
  handlePhoneNumber,
} from "@/utils/handleUtils";
import { fetchPostCustomer } from "@/utils/serviceApiClient";

interface IProps {
  showCustomerModal: boolean;
  setShowCustomerModal: (value: boolean) => void;
  fetchCustomers: () => void;
}

const CustomerCreateModal = (props: IProps) => {
  const { showCustomerModal, setShowCustomerModal, fetchCustomers } = props;
  const [validation, setValidation] = useState<boolean[]>(Array(8).fill(false));

  const [relationships, setRelationships] = useState<ICustomerResponse[]>([]);

  const [customer_name, setCustomerName] = useState<string>("");
  const [sex, setSex] = useState<number>(0);
  const [relationship, setRelationship] = useState<ICustomerResponse>(
    defaultRelatioshipResponse
  );
  const [relationship_name, setRelationshipName] = useState<string>("");
  const [phone_number, setPhone_number] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [visa_expire, setVisaExpire] = useState<string>("");
  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS

  const [relationship_id_error, setRelationshipId_error] = useState<string>("");

  const handleHideModal = () => {
    setShowCustomerModal(false);
    setCustomerName("");
    setSex(0);
    setRelationship(defaultRelatioshipResponse);
    setRelationshipName("");
    setEmail("");
    setPhone_number("");
    setBirthday("");
    setAddress("");
    setVisaExpire("");

    setRelationshipId_error("");

    setValidation([]);
    setValidation(Array(8).fill(false));
  };

  const handleCreate = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validation.length; i++) {
      if (validation[i] == false) {
        flag = false;
        break;
      }
    }

    if (flag) {
      const initCustomerRequest: ICustomerRequest = {
        customer_name: customer_name,
        sex: sex,
        customer_rel_id: relationship.customer_id,
        relationship_name: relationship_name,
        phone_number: phone_number,
        email: email,
        address: address,
        birthday: birthday,
        visa_expire: visa_expire,
        status: 1,
      };
      console.log("customer:", initCustomerRequest);
      
      const data = await fetchPostCustomer(initCustomerRequest)
      if (data.status == "SUCCESS") {
        toast.success(`Thêm người dùng ${customer_name} thành công`);
        setShowCustomerModal(false);
        fetchCustomers();
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

  const updateValidation = (index: number, isValid: boolean) => {
    setValidation((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };

  return (
    <>
      <Modal
        show={showCustomerModal}
        fullscreen={true}
        backdrop="static"
        keyboard={false}
        onHide={() => {
          handleHideModal();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới khách hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="div-customer-modal">
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
                    onChange={(e) => setSex(Number(e.target.value))}
                  >
                    <option value="1">Nam</option>
                    <option value="0">Nữ</option>
                    <option value="2">Khác</option>
                  </Form.Select>
                </FloatingLabel>
                <div className="form-floating mb-3">
                  <Typeahead
                    placeholder="Người đại diện"
                    onChange={(relationships: ICustomerResponse[]) => {
                      validation[7]=true
                      setRelationship(relationships[0])
                      setRelationshipId_error("")
                      
                    }}
                    labelKey={(relationship: ICustomerResponse) =>
                      relationship.customer_name
                    }
                    options={relationships}
                    onInputChange={(e: string) => {
                      setRelationshipId_error("Khách hàng này không tồn tại");
                      validation[7] = false;
                    }}
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={relationship_id_error}
                    disabled
                  />
                </div>

                <FloatingLabel
                  className="mb-3"
                  label="Quan hệ với người đại diện"
                >
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
              </Col>
            </Row>

            <div className="div-back-create">
              <Button
                className="btn-create-back"
                onClick={() => handleHideModal()}
              >
                Trở lại
              </Button>
              <Button onClick={() => handleCreate()} variant="success">
                Tạo
              </Button>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CustomerCreateModal;
