'use client'

import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "@/styles/customer.css"
import CustomerErrorCode from "@/exception/customer_error_code";
import cookie from 'js-cookie';
import { getCurrentLocalDateTimeString } from '@/utils/string_utils';
import { toast } from 'react-toastify';
import "@/styles/reserve.css"
import { fetchGetCustomers, fetchGetMyInfo } from "@/utils/serviceApiClient";
interface IProps {
    showCustomerModal: boolean;
    setShowCustomerModal: (value: boolean) => void;
    reserveTour:IReserveTourResponse;
    handleCreateReserve: (customer: IReserveRequest) => void;
}

const ReserveCustomerCreateModal = (props: IProps) => {
    const { showCustomerModal, setShowCustomerModal, handleCreateReserve ,reserveTour} = props;

    var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS
    const typeaheadRef: any = useRef(null);

    const initCustomerResponse: ICustomerResponse = {
        customer_id: 0,
        customer_name: '',
        sex: 0,
        relationship_name: '',
        phone_number: '',
        email: '',
        address: '',
        birthday: '',
        visa_expire: '',
        time: '',
        status: 0,
    }

    const [customer, setCustomer] = useState<ICustomerResponse>(initCustomerResponse)
    const [customers, setCustomers] = useState<ICustomerResponse[]>([])


    useEffect(() => {
        const fetchRoles = async () => {
            if (showCustomerModal == true) {
                const customers: ICustomerResponse[] = await fetchGetCustomers(1)
                setCustomers(customers);
            }
        }
        fetchRoles()
    }, [showCustomerModal]);

    const [validation, setValidation] = useState<boolean[]>([...Array(6).fill(false),true]);
    const [customer_name, setCustomerName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [phone_number, setPhone_number] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [birthday, setBirthday] = useState<string>("");
    const [sex, setSex] = useState<number>(0);

    const [price, setPrice] = useState<number>(0)
    const [note, setNote] = useState<string>('')


    const [relationship_name, setRelationshipName] = useState<string>("");
    const [visa_expire, setVisaExpire] = useState<string>("");

    const [customer_name_error, setCustomer_Name_error] = useState('')


    const handleHideModal = () => {
        setShowCustomerModal(false)
        setCustomerName("");
        setSex(0);
        setPrice(0);
        setRelationshipName("");
        setEmail("");
        setPhone_number("");
        setBirthday("");
        setAddress("");
        setVisaExpire("");
        setValidation([...Array(6).fill(false),true]);
        setNote("")
        setCustomer(initCustomerResponse)
    };

    const handleResetData = () => {
        setCustomerName("");
        setPrice(0)
        setSex(0);
        setRelationshipName("");
        setEmail("");
        setPhone_number("");
        setBirthday("");
        setAddress("");
        setVisaExpire("");
        setNote("")
        setValidation([...Array(6).fill(false),true]);
        setCustomer(initCustomerResponse)
        if (typeaheadRef.current) {
            typeaheadRef.current.clear();
        }
    }

    const handleCustomerName = (e: string) => {
        const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
        if (regex.test(e)) {
            validation[0] = true
            setCustomer_Name_error('')
        } else {
            validation[0] = false
            setCustomer_Name_error(CustomerErrorCode.CUSTOMER_14)
        }

        if (e == '') {
            setCustomer_Name_error('')
        }

        setCustomerName(e);
    }


    const handleEmail = (e: string) => {
        const regex: RegExp = /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
        if (regex.test(e)) {
            validation[1] = true
        } else {
            validation[1] = false
        }
        setEmail(e);
    }

    const handlePhoneNumber = (e: string) => {
        const regex: RegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
        if (regex.test(e)) {
            validation[2] = true
        } else {
            validation[2] = false
        }
        setPhone_number(e);
    }

    const handleAddress = (e: string) => {
        const regex: RegExp = /^[\p{L}0-9 ,.\-]{0,255}$/u;
        if (regex.test(e)) {
            validation[3] = true
        } else {
            validation[3] = false
        }
        setAddress(e);
    }

    const handleBirthDay = (e: string) => {
        const regex: RegExp = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
        if (regex.test(e)) {
            validation[4] = true
        } else {
            validation[4] = false
        }
        setBirthday(e);
    }


    const handleVisaExpire = (e: string) => {
        const regex: RegExp = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
        if (regex.test(e)) {
            validation[5] = true
        } else {
            validation[5] = false
        }
        setVisaExpire(e);
    }

    const handlePrice = (e: string) => {
        const regex: RegExp = /^[0-9]+$/;
        if (e == '') {
            e = '0'
            setPrice(0);
        }
        if (regex.test(e)) {
            setPrice(Number(e));
        }
    }

    const handleNote = (e: string) => {
        const regex: RegExp = /^[\p{L}0-9 ,.\-]{0,255}$/u;
        if (regex.test(e)) {
            validation[6] = true
        } else {
            validation[6] = false
        }

        if (e === '') {
            validation[6] = true
        }
        setNote(e);
    }

    const handleSelectedCustomer = (customer: ICustomerResponse) => {
        if (customer != undefined) {
            setCustomer(customer);
            setCustomerName(customer.customer_name);
            setSex(customer.sex);
            setRelationshipName(customer.relationship_name);
            setEmail(customer.email);
            setPhone_number(customer.phone_number);
            setBirthday(customer.birthday);
            setAddress(customer.address);
            setVisaExpire(customer.visa_expire);
            setValidation(Array(7).fill(true));

        } else {
            handleResetData()
            setCustomer(initCustomerResponse)
        }
    }

    // useEffect(() => {
    //     console.log("Customer selected >>> ", customer)
    // }, [customer])

    const handleCreateReserveFromModal = async() => {
        
        if (!validation.some(v => v === false)) {

            const myInfo: IGetAccountResponse = await fetchGetMyInfo()
    

            const initCustomerRequest: ICustomerResponse = {
                customer_id: customer.customer_id == 0 ? null : customer.customer_id,
                customer_name: customer_name,
                sex: sex,
                relationship_name: '',
                phone_number: phone_number,
                email: email,
                address: address,
                birthday: birthday,
                visa_expire: visa_expire,
                time: getCurrentLocalDateTimeString(),
                status: 0,
            }

            const initReserveRequest:IReserveRequest= {
                customerResponse:initCustomerRequest,

                tour_time_id: reserveTour.tourTime.tour_time_id,
           
                employee_id:myInfo.employee.employee_id,
           
                note:note,
           
                price_min:reserveTour.tourTime.price_min,
           
                price:price == 0 ? reserveTour.tourTime.price_min : price,
           
                commission:reserveTour.tourTime.commission
            }
            handleCreateReserve(initReserveRequest)
            handleHideModal()

        } else {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
        }


    }




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
                    <Modal.Title>Thêm khách hàng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Container className="div-customer-modal">
                        <Row>
                            <Col>
                                <Typeahead
                                    ref={typeaheadRef}
                                    placeholder="Tên khách hàng"
                                    onChange={(customer: ICustomerResponse[]) => handleSelectedCustomer(customer[0])}
                                    labelKey={(customer: ICustomerResponse) => customer.customer_name}
                                    options={customers}
                                    onInputChange={(e: string) => handleCustomerName(e)}
                                />
                                <input type="text" className='input-error' value={customer_name_error} disabled />

                                <FloatingLabel className="mb-3" label="Email" >
                                    <Form.Control
                                        disabled={customer.customer_id != 0}
                                        type="text"
                                        placeholder="..."
                                        value={email}
                                        className="form-control"
                                        onChange={(e) => handleEmail(e.target.value)}
                                        isValid={validation[1]}
                                        isInvalid={email != '' && !validation[1]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {CustomerErrorCode.CUSTOMER_9}
                                    </Form.Control.Feedback>
                                </FloatingLabel>

                                <FloatingLabel className="mb-3" label="Số điện thoại">
                                    <Form.Control
                                        disabled={customer.customer_id != 0}
                                        type="text"
                                        placeholder="..."
                                        value={phone_number}
                                        className="form-control"
                                        onChange={(e) => handlePhoneNumber(e.target.value)}
                                        isValid={validation[2]}
                                        isInvalid={phone_number != '' && !validation[2]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {CustomerErrorCode.CUSTOMER_8}
                                    </Form.Control.Feedback>
                                </FloatingLabel>

                                <FloatingLabel className="mb-3" label="Địa Chỉ">
                                    <Form.Control
                                        disabled={customer.customer_id != 0}
                                        type="text"
                                        placeholder="..."
                                        value={address}
                                        className="form-control"
                                        onChange={(e) => handleAddress(e.target.value)}
                                        isValid={validation[3]}
                                        isInvalid={address != '' && !validation[3]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {CustomerErrorCode.CUSTOMER_11}
                                    </Form.Control.Feedback>
                                </FloatingLabel>

                                <FloatingLabel className="mb-3" label="Ngày sinh">
                                    <Form.Control
                                        disabled={customer.customer_id != 0}
                                        type="date"
                                        className="form-control rbt-input"
                                        placeholder="Ngày sinh"
                                        onChange={(e) => handleBirthDay(e.target.value)}
                                        isValid={validation[4]}
                                        isInvalid={birthday != '' && !validation[4]}
                                        value={birthday}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {CustomerErrorCode.CUSTOMER_12}
                                    </Form.Control.Feedback>
                                </FloatingLabel>
                            </Col>
                            <Col>
                                <FloatingLabel className="mb-3" label="Giới tính">
                                    <Form.Select
                                        disabled={customer.customer_id != 0}
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
                                <FloatingLabel className="mb-3" label="Hạn Visa">
                                    <Form.Control
                                        type="date"
                                        disabled={customer.customer_id != 0}
                                        className="form-control rbt-input"
                                        placeholder="Ngày hết hạn Visa"
                                        value={visa_expire}
                                        onChange={(e) => handleVisaExpire(e.target.value)}
                                        isValid={validation[5]}
                                        isInvalid={visa_expire != '' && !validation[5]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {CustomerErrorCode.CUSTOMER_13}
                                    </Form.Control.Feedback>
                                </FloatingLabel>

                                <FloatingLabel className="mb-3" label="Giá">
                                    <Form.Control
                                        type="text"
                                        placeholder="..."
                                        value={price}
                                        className="form-control"
                                        onChange={(e) => handlePrice(e.target.value)}
                                    />

                                </FloatingLabel>


                                <Form.Group
                                    className="mb-3 input-textarea"
                                    controlId="exampleForm.ControlTextarea1"
                                >
                                    <Form.Label>Note</Form.Label>
                                    <Form.Control as="textarea" rows={4}
                                        value={note}
                                        onChange={(e) => handleNote(e.target.value)}
                                        isValid={note != '' && validation[6]}
                                        isInvalid={note != '' && !validation[6]}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {"Lỗi"}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="div-back-create">
                            <Button
                                className="btn-create-back"
                                onClick={() => handleHideModal()}
                            >
                                Trở lại
                            </Button>
                            <Button
                                className="btn-create-back"
                                onClick={() => handleResetData()}
                            >
                                Làm mới
                            </Button>
                            <Button
                                onClick={() => handleCreateReserveFromModal()}
                                variant="success">
                                Thêm
                            </Button>
                        </div>
                    </Container>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ReserveCustomerCreateModal