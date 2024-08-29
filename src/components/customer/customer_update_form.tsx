"use client";
import { useState, useEffect, Suspense } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import cookie from "js-cookie";
import CustomerErrorCode from "@/exception/customer_error_code";
import { toast } from "react-toastify";
import { ExportError } from "@/utils/export_error";
import { formatDate } from "@/utils/dateUtils";
import CustomerGroupModal from "./customer_group_modal";

interface IProps {
  customer: ICustomerDetailResponse;
  customers: ICustomerResponse[];
}

const CustomerUpdateForm = (props: IProps) => {
  const { customer, customers } = props;
  const [validationCustomer, setValidationCustomer] = useState<boolean[]>(
    Array(8).fill(true)
  );

  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS
  const [relationship, SetRelationship] = useState<ICustomerResponse|null>(customer.customerParent==null?null:customer.customerParent);
  const handleSelectedRelationship = (relatioship: ICustomerResponse) => {
    SetRelationship(relatioship);
    setRelationship_error("");
    validationCustomer[6] = true;
  };

  const [customer_name, setCustomerName] = useState<string>(
    customer.customer_name
  );
  const [sex, setSex] = useState<number>(customer.sex);
  const [relationship_name, setRelationshipName] = useState<string>(
    customer.relationship_name
  );
  const [phone_number, setPhone_number] = useState<string>(
    customer.phone_number
  );
  const [email, setEmail] = useState<string>(customer.email);
  const [address, setAddress] = useState<string>(customer.address);
  const [birthday, setBirthday] = useState<string>(
    formatDate(customer.birthday)
  );
  const [visa_expire, setVisaExpire] = useState<string>(
    formatDate(customer.visa_expire)
  );
  const [selectedGroup, setSelectedGroup] = useState<ICustomerResponse[]|null>(customer.customerGroup);

  const [customer_name_error, setCustomerName_error] = useState<string>("");
  const [relationship_error, setRelationship_error] = useState<string>("");
  const [relationship_name_error, setRelationshipName_error] =
    useState<string>("");
  const [phone_number_error, setPhone_number_error] = useState<string>("");
  const [email_error, setEmail_error] = useState<string>("");
  const [address_error, setAddress_error] = useState<string>("");
  const [birthday_error, setBirthday_error] = useState<string>("");
  const [visa_expire_error, setVisaExpire_error] = useState<string>("");

  const handleCustomer_name = (e: string) => {
    const regex: RegExp = /^[\p{L} ]{2,255}$/u;
    if (regex.test(e)) {
      setCustomerName_error("");
      validationCustomer[0] = true;
    } else {
      validationCustomer[0] = false;
      setCustomerName_error(CustomerErrorCode.CUSTOMER_9);
    }
    setCustomerName(e);
  };

  const handleRelationship_name = (e: string) => {
    const regex: RegExp = /^[\p{L} ]{2,255}$/u;
    if (regex.test(e)) {
      setRelationshipName_error("");
      validationCustomer[6] = true;
    } else {
      validationCustomer[6] = false;
      setRelationshipName_error(CustomerErrorCode.CUSTOMER_9);
    }
    setRelationshipName(e);
  };

  const handleGenderChange = (value: number) => {
    setSex(value);
  };

  const handleEmail = (e: string) => {
    const regex: RegExp =
      /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    if (regex.test(e)) {
      setEmail_error("");
      validationCustomer[1] = true;
    } else {
      validationCustomer[1] = false;
      setEmail_error(CustomerErrorCode.CUSTOMER_7);
    }
    setEmail(e);
  };

  const handlePhone_number = (e: string) => {
    const regex: RegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (regex.test(e)) {
      setPhone_number_error("");
      validationCustomer[2] = true;
    } else {
      validationCustomer[2] = false;
      setPhone_number_error(CustomerErrorCode.CUSTOMER_8);
    }
    setPhone_number(e);
  };

  const handleAddress = (e: string) => {
    if (e.trim() !== "") {
      setRelationshipName_error("");
      validationCustomer[3] = true;
    } else {
      validationCustomer[3] = false;
      setRelationshipName_error("Trường này không được để trống.");
    }
    setAddress(e);
  };

  const handleBirthday = (e: string) => {
    const regex: RegExp =
      /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      setBirthday_error("");
      validationCustomer[4] = true;
    } else {
      validationCustomer[4] = false;
      setBirthday_error(CustomerErrorCode.CUSTOMER_1);
    }
    setBirthday(e);
  };

  const handleRelationship = (e: string) => {
    // validationCustomer[6] = false;
    // setRelationship_error("Vui lòng chọn quyền ở mục đề xuất");
  };
  // useEffect(() => {
  //   if (!relationship) {
  //     setRelationship_error("Vui lòng chọn quyền ở mục đề xuất");
  //     validationCustomer[3] = false;
  //   } else {
  //     setRelationship_error("");
  //     validationCustomer[3] = true;
  //   }
  // }, [relationship]);

  const handleVisaExpire = (e: string) => {
    const regex: RegExp =
      /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      setVisaExpire_error("");
      validationCustomer[7] = true;
    } else {
      validationCustomer[7] = false;
      setVisaExpire_error(CustomerErrorCode.CUSTOMER_1);
    }
    setVisaExpire(e);
  };
  console.log(validationCustomer)
  const handleUpdateCustomer = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validationCustomer.length; i++) {
      if (
        validationCustomer[i] == false ||
        validationCustomer[i] == undefined
      ) {
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
        status: customer.status,
      };
      console.log(initCustomerRequest);
      const res = await fetch(
        `http://localhost:8080/api/customer/${
          customer.customer_name + "-" + customer.customer_id
        }`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
          },
          body: JSON.stringify(initCustomerRequest),
        }
      );

      const data = await res.json();
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
    setSelectedGroup(customer.customerGroup);
    setSelectedGroup([...customer.customerGroup,customer.customerParent]);
    setShowCustomerGroupModal(true);
  };

  // Hàm này để đóng modal
  const handleCloseModal = () => {
    setShowCustomerGroupModal(false);
    setSelectedGroup(null);
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

            <input type="text" className="input-error" value="" disabled />

          <FloatingLabel className="mb-3" label="Ngày hết hạn Visa">
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

            <Typeahead
              id="typeahead-representative" // Cung cấp ID duy nhất cho Typeahead
              selected={relationship ? [relationship] : []}
              placeholder="Chọn người đại diện"
              onChange={(relationship: ICustomerResponse[]) => {
                handleSelectedRelationship(relationship[0]);
              }}
              labelKey={(selected: ICustomerResponse) => selected.customer_name} // Sử dụng thuộc tính `customer_name` để hiển thị trong Typeahead
              options={customers}
              onInputChange={(e: string) => handleRelationship(e)}
            />
            <input
              type="text"
              className="input-error"
              value={relationship_error}
              disabled
            />

          <FloatingLabel className="mb-3" label="Quan hệ với người đại diện">
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

          <Button
            variant="outline-info"
            onClick={() => handleShowCustomerGroup()}
            
          >Xem các khách hàng liên quan</Button>
        </Col>
      </Row>

      <div className="div-back-create">
        <Button className="btn-back">
          <Link href={"/management/customer/"} className="link-back">
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
