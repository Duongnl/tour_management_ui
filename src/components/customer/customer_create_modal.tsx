"use client";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import "@/styles/customer.css";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import cookie from "js-cookie";
import CustomerErrorCode from "@/exception/customer_error_code";
import { toast } from "react-toastify";
import { ExportError } from "@/utils/export_error";

interface IProps {
  showCustomerModal: boolean;
  setShowCustomerModal: (value: boolean) => void;
  fetchCustomers: () => void;
}

const CustomerCreateModal = (props: IProps) => {
  const { showCustomerModal, setShowCustomerModal, fetchCustomers } = props;
  const [validation, setValidation] = useState<boolean[]>(Array(8).fill(false));

  const defaultRelatioshipResponse: ICustomerResponse = {
    customer_id: null,
    customer_name: "",
    status: 0,
    sex: 0,
    relationship_name: "",
    phone_number: "",
    email: "",
    address: "",
    birthday: "",
    visa_expire: "",
    time: "",
  };

  const [relationships, setRelationships] = useState<ICustomerResponse[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (showCustomerModal == true) {
        const res = await fetch("http://localhost:8080/api/customer/parent", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
          },
        });
        const data = await res.json();
        const relationships: ICustomerResponse[] = data.result;
        setRelationships(relationships);
      }
    };
    fetchCustomers();
  }, [showCustomerModal]);

  const [customer_name, setCustomerName] = useState<string>("");
  const [sex, setSex] = useState<number>(0);
  const [relationship, setRelationship] = useState<ICustomerResponse>(defaultRelatioshipResponse);
  const [relationship_name, setRelationshipName] = useState<string>("");
  const [phone_number, setPhone_number] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [birthday, setBirthday] = useState<string>("");
  const [visa_expire, setVisaExpire] = useState<string>("");
  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS

  const [customer_name_error, setCustomerName_error] = useState<string>("");
  const [relationship_id_error, setRelationshipId_error] = useState<string>("");
  const [relationship_name_error, setRelationshipName_error] =
    useState<string>("");
  const [phone_number_error, setPhone_number_error] = useState<string>("");
  const [email_error, setEmail_error] = useState<string>("");
  const [sex_error, setSex_error] = useState<string>("");
  const [address_error, setAddress_error] = useState<string>("");
  const [birthday_error, setBirthday_error] = useState<string>("");
  const [visa_expire_error, setVisaExpire_error] = useState<string>("");

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

    setCustomerName_error("");
    setRelationshipId_error("");
    setRelationshipName_error("");
    setEmail_error("");
    setPhone_number_error("");
    setBirthday_error("");
    setAddress_error("");
    setVisaExpire_error("");

    setValidation([]);
    setValidation(Array(8).fill(false));
  };

  const handleSelectedRelationship = (relatioship: ICustomerResponse) => {
    setRelationship(relatioship);
    setRelationshipId_error("");
    // validation[6] = true;
  };

  console.log(validation);
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
      const res = await fetch("http://localhost:8080/api/customer", {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
        },
        body: JSON.stringify(initCustomerRequest),
      });

      const data = await res.json();
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

  const handleCustomer_name = (e: string) => {
    const regex: RegExp = /^[\p{L} ]{2,255}$/u;
    if (regex.test(e)) {
      setCustomerName_error("");
      validation[0] = true;
    } else {
      validation[0] = false;
      setCustomerName_error(CustomerErrorCode.CUSTOMER_9);
    }
    setCustomerName(e);
  };

  const handleRelationship_name = (e: string) => {
    const regex: RegExp = /^[\p{L} ]{2,255}$/u;
    if (regex.test(e)) {
      setRelationshipName_error("");
      validation[6] = true;
    } else {
      validation[6] = false;
      setRelationshipName_error(CustomerErrorCode.CUSTOMER_9);
    }
    setRelationshipName(e);
  };

  type GenderOption = {
    id: number;
    gender: string;
  };

  const handleGenderChange = (selected: GenderOption[]) => {
    const selectedId = selected.length > 0 ? selected[0].id : null;

    if (selectedId !== null) {
      setSex_error("");
      validation[5] = true;
      setSex(selectedId); // Assuming setSex accepts a number
    } else {
      validation[5] = false;
      setSex_error("Trường này không được để trống.");
    }

  };

  const handleEmail = (e: string) => {
    const regex: RegExp =
      /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    if (regex.test(e)) {
      setEmail_error("");
      validation[1] = true;
    } else {
      validation[1] = false;
      setEmail_error(CustomerErrorCode.CUSTOMER_7);
    }
    setEmail(e);
  };

  const handlePhone_number = (e: string) => {
    const regex: RegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    if (regex.test(e)) {
      setPhone_number_error("");
      validation[2] = true;
    } else {
      validation[2] = false;
      setPhone_number_error(CustomerErrorCode.CUSTOMER_8);
    }
    setPhone_number(e);
  };

  const handleAddress = (e: string) => {
    if (e.trim() !== "") {
      setRelationshipName_error("");
      validation[3] = true;
    } else {
      validation[3] = false;
      setRelationshipName_error("Trường này không được để trống.");
    }
    setAddress(e);
  };

  const handleBirthday = (e: string) => {
    const regex: RegExp =
      /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      setBirthday_error("");
      validation[4] = true;
    } else {
      validation[4] = false;
      setBirthday_error(CustomerErrorCode.CUSTOMER_1);
    }
    // const date = new Date(e);
    // const formattedDate = date.toISOString().split("T")[0];

    setBirthday(e);
  };

  const handleRelationship = (e: string) => {
    // validation[6] = true;
    setRelationshipId_error("Người này là người đại diện");
  };

  const handleVisaExpire = (e: string) => {
    const regex: RegExp =
      /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      setVisaExpire_error("");
      validation[7] = true;
    } else {
      validation[7] = false;
      setVisaExpire_error(CustomerErrorCode.CUSTOMER_1);
    }
    // const date = new Date(e);
    // const formattedDate = date.toISOString().split("T")[0];

    setVisaExpire(e);
  };

  const genders = [
    { id: 1, gender: "Nam" },
    { id: 0, gender: "Nữ" },
    { id: 2, gender: "Khác" },
  ];

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
                {/* Tên khách hàng */}
                <FloatingLabel className="mb-3" label="Tên khách hàng">
                  <Form.Control
                    type="text"
                    placeholder="..."
                    value={customer_name}
                    onChange={(e) => handleCustomer_name(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={customer_name_error}
                    disabled
                  />
                </FloatingLabel>

                <FloatingLabel className="mb-3" label="Email">
                  <Form.Control
                    type="text"
                    placeholder="..."
                    value={email}
                    onChange={(e) => handleEmail(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={email_error}
                    disabled
                  />
                </FloatingLabel>

                <FloatingLabel className="mb-3" label="Số điện thoại">
                  <Form.Control
                    type="text"
                    placeholder="..."
                    value={phone_number}
                    onChange={(e) => handlePhone_number(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={phone_number_error}
                    disabled
                  />
                </FloatingLabel>

                <FloatingLabel className="mb-3" label="Địa Chỉ">
                  <Form.Control
                    type="text"
                    placeholder="..."
                    value={address}
                    onChange={(e) => handleAddress(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={address_error}
                    disabled
                  />
                </FloatingLabel>

                <FloatingLabel className="mb-3" label="Ngày sinh">
                  <input
                    type="date"
                    className="form-control rbt-input"
                    placeholder="Ngày sinh"
                    value={birthday}
                    onChange={(e) => handleBirthday(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={birthday_error}
                    disabled
                  />
                </FloatingLabel>
              </Col>
              <Col>
                {/* <FloatingLabel className="mb-3" label="Giới tính"> */}
                  <Typeahead
                    placeholder="Chọn giới tính"
                    onChange={(selected: GenderOption[]) =>
                      handleGenderChange(selected)
                    }
                    labelKey="gender"
                    options={genders}
                    id="gender-typeahead"
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={sex_error}
                    disabled
                  />
                {/* </FloatingLabel> */}
                {/* <FloatingLabel className="mb-3" label="Giới tính"> */}
                  <Typeahead
                    placeholder="Người đại diện"
                    onChange={(relationship: ICustomerResponse[]) =>
                      handleSelectedRelationship(relationship[0])
                    }
                    labelKey={(relationship: ICustomerResponse) =>
                      relationship.customer_name
                    }
                    options={relationships}
                    onInputChange={(e: string) => handleRelationship(e)}
                    // className="form-control"
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={relationship_id_error}
                    disabled
                  />
                {/* </FloatingLabel> */}

                <FloatingLabel
                  className="mb-3"
                  label="Quan hệ với người đại diện"
                >
                  <Form.Control
                    type="text"
                    placeholder="..."
                    value={relationship_name}
                    onChange={(e) => handleRelationship_name(e.target.value)}
                    className="form-control"
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={relationship_name_error}
                    disabled
                  />
                </FloatingLabel>
                <FloatingLabel className="mb-3" label="Hạn Visa">
                  <input
                    type="date"
                    className="form-control rbt-input"
                    placeholder="Ngày hết hạn Visa"
                    value={visa_expire}
                    onChange={(e) => handleVisaExpire(e.target.value)}
                  />
                  <input
                    type="text"
                    className="input-error"
                    value={visa_expire_error}
                    disabled
                  />
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
