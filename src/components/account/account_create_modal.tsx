'use client'
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { Col, Container, Row } from 'react-bootstrap';
import "@/styles/account.css"
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Typeahead } from 'react-bootstrap-typeahead'; // ES2015
import cookie from 'js-cookie';
import AccountErrorCode from '@/exception/account_error_code';
import EmployeeErrorCode from '@/exception/employee_error_code';
import { toast } from 'react-toastify';
import { ExportError } from '@/utils/export_error';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { fetchGetRoles, fetchPostAccount } from '@/utils/serviceApiClient';
interface IProps {
  showAccountModal: boolean
  setShowAccountModal: (value: boolean) => void
  fetchAccounts: () => void
  setSearch: (value: string) => void
}

const AccountCreateModal = (props: IProps) => {

  const { showAccountModal, setShowAccountModal, fetchAccounts, setSearch } = props
  const [validation, setValidation] = useState<boolean[]>(Array(10).fill(false));

  const defaultRoleResponse: IRoleResponse = {
    role_id: 0,
    role_name: "",
    status: 0,
    permissions: []
  };

  const [role, setRole] = useState<IRoleResponse>(defaultRoleResponse)
  const [roles, setRoles] = useState<IRoleResponse[]>([])

  const pathName = usePathname()
  const router = useRouter()

  useEffect(() => {
    const fetchRoles = async () => {
      if (showAccountModal == true) {
        const roles: IRoleResponse[] = await fetchGetRoles(1)
        setRoles(roles);
      }
    }
    fetchRoles()
  }, [showAccountModal]);


  const [account_name, setAccount_name] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repassword, setRepassword] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone_number, setPhone_number] = useState<string>('');
  const [birthday, setBirthday] = useState<string>('');
  const [employee_name, setEmployee_name] = useState<string>('');
  const [total_sales, setTotal_sales] = useState<number>(0);
  const [total_commission, setTotal_commission] = useState<number>(0);
  var Typeahead = require('react-bootstrap-typeahead').Typeahead; // CommonJS

  const [role_error, setRole_error] = useState('')

  const handleSelectedRole = (role: IRoleResponse) => {
    setRole(role)
    setRole_error("")
    validation[9] = true
  }

  const handleHideModal = () => {
    setShowAccountModal(false)
    setRole(defaultRoleResponse)
    setAccount_name('');
    setPassword('');
    setRepassword('');
    setEmail('');
    setPhone_number('')
    setBirthday('')
    setEmployee_name('')
    setTotal_sales(0)
    setTotal_commission(0)

    setRole_error('')

    setValidation([])
    setValidation(Array(10).fill(false))



  }


  const handleCreate = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validation.length; i++) {
      if (validation[i] == false) {
        flag = false;
        break;
      }
    }


    if (flag) {
      const initEmployeeRequest: IEmployeeRequest = {
        employee_name: employee_name.trim(),
        birthday: birthday,
        total_commission: total_commission,
        total_sales: total_sales,
      }

      const initAcountRequest: IAccountRequest = {
        account_name: account_name,
        password: password,
        email: email,
        phone_number: phone_number,
        role_id: role.role_id,
        employee: initEmployeeRequest
      }
      // console.log("account:", initAcountRequest)

      const data = await fetchPostAccount(initAcountRequest)
      if (data.status == "SUCCESS") {
        toast.success(`Thêm người dùng ${account_name} thành công`)
        handleHideModal()
        fetchAccounts()
        router.push(pathName)
        setSearch('')
      } else {
        let errors = ExportError(data, AccountErrorCode);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        // console.log("response:", data)
      }


    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ")
    }
  }

  const handleAccount_name = (e: string) => {
    const regex: RegExp = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    if (regex.test(e)) {
      validation[0] = true
    } else {
      validation[0] = false
    }
    setAccount_name(e);
  }

  const handlePassword = (e: string) => {
    const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/;
    if (regex.test(e) === true) {
      validation[1] = true
    } else {
      validation[1] = false
    }
    setPassword(e);

    if (repassword != '') {
      if (e == repassword) {
        validation[2] = true
        setRepassword(e);
      } else {
        validation[2] = false
      }
    }
  }

  const handleRepassword = (e: string) => {
    if (e === password) {
      validation[2] = true
    } else {
      validation[2] = false
    }
    setRepassword(e);
  }

  const handleEmail = (e: string) => {
    const regex: RegExp = /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    if (regex.test(e)) {
      validation[3] = true
    } else {
      validation[3] = false
    }
    setEmail(e);
  }

  const handlePhone_number = (e: string) => {
    const regex: RegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    if (regex.test(e)) {
      validation[4] = true
    } else {
      validation[4] = false
    }
    setPhone_number(e);
  }


  const handleEmployee_name = (e: string) => {
    const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
    if (regex.test(e)) {
      validation[5] = true
    } else {
      validation[5] = false
    }
    setEmployee_name(e);
  }

  const handleTotal_sales = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;
    if (e == '') {
      e = '0'
      setTotal_commission(0);
    }
    if (regex.test(e)) {
      validation[6] = true
      setTotal_sales(Number(e));
    } 
  }

  const handleTotal_commission = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;
    if (e == '') {
      e = '0'
      setTotal_commission(0);
    }
    if (regex.test(e)) {
      validation[7] = true
      setTotal_commission(Number(e));
    } 
  }

  const handleBirthday = (e: string) => {
    const regex: RegExp = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      validation[8] = true
    } else {
      validation[8] = false
    }
    setBirthday(e)
  }

  const handleRole = (e: string) => {
    validation[9] = false;
    setRole_error("Vui lòng chọn quyền ở mục đề xuất");
  }

  useEffect(() => {
    validation[6] = true
    validation[7] = true
    if (!role) {
      setRole_error("Vui lòng chọn quyền ở mục đề xuất");
      validation[9] = false;
    } else {
      if (role.role_id == 0) {
        validation[9] = false;
      } else {
        setRole_error('');
        validation[9] = true;
      }

    }
  }, [role]);



  return (
    <>
      <Modal
        show={showAccountModal}
        fullscreen={true}
        backdrop="static"
        keyboard={false}
        onHide={() => { handleHideModal() }}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className='div-account-modal' >
            <Row>
              <Col>
                <FloatingLabel className='mb-3 float-lable-input' label="Tên đăng nhập">
                  <Form.Control type="text" placeholder="..." value={account_name}
                    onChange={(e) => handleAccount_name(e.target.value)}
                    isValid={validation[0]}
                    isInvalid={account_name != '' && !validation[0]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {AccountErrorCode.ACCOUNT_4}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel className='mb-3 float-lable-input' label="Mật khẩu">
                  <Form.Control type="text" placeholder="..." value={password}
                    onChange={(e) => handlePassword(e.target.value)}
                    isValid={validation[1]}
                    isInvalid={password != '' && !validation[1]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {AccountErrorCode.ACCOUNT_5}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel className='mb-3 float-lable-input' label="Nhập lại mật khẩu">
                  <Form.Control type="text" placeholder="..." value={repassword}
                    onChange={(e) => handleRepassword(e.target.value)}
                    isValid={repassword !=''&& validation[2]}
                    isInvalid={repassword != '' && !validation[2]}
                  />
                  <Form.Control.Feedback type="invalid">
                   Mật khẩu không khớp
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel className='mb-3 float-lable-input' label="Email">
                  <Form.Control type="text" placeholder="..." value={email}
                    onChange={(e) => handleEmail(e.target.value)}
                    isValid={validation[3]}
                    isInvalid={email != '' && !validation[3]}
                  />
                   <Form.Control.Feedback type="invalid">
                   {AccountErrorCode.ACCOUNT_7}
                  </Form.Control.Feedback>
                </FloatingLabel>


                <FloatingLabel className='mb-3 float-lable-input' label="Số điện thoại">
                  <Form.Control type="text" placeholder="..." value={phone_number}
                    onChange={(e) => handlePhone_number(e.target.value)}
                    isValid={validation[4]}
                    isInvalid={phone_number != '' && !validation[4]}
                  />
                    <Form.Control.Feedback type="invalid">
                   {AccountErrorCode.ACCOUNT_8}
                  </Form.Control.Feedback>
                </FloatingLabel>

              </Col>
              <Col>
                <Typeahead
                  placeholder="Quyền"
                  onChange={(role: IRoleResponse[]) => handleSelectedRole(role[0])}
                  labelKey={(role: IRoleResponse) => role.role_name}
                  options={roles}
                  onInputChange={(e: string) => handleRole(e)}
                />
                <input type="text" className='input-error' value={role_error} style={{ marginBottom: '15px' }} disabled />

                <FloatingLabel className='mb-3 float-lable-input' label="Họ tên">
                  <Form.Control type="text" placeholder="..." value={employee_name}
                    onChange={(e) => handleEmployee_name(e.target.value)}
                    isValid={validation[5]}
                    isInvalid={employee_name != '' && !validation[5]}
                  />
                    <Form.Control.Feedback type="invalid">
                   {EmployeeErrorCode.EMPLOYEE_2}
                  </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel className='mb-3 float-lable-input' label="Ngày sinh">
                  <Form.Control type="date" placeholder="..." value={birthday}
                    onChange={(e) => handleBirthday(e.target.value)}
                    isValid={validation[8]}
                    isInvalid={birthday != '' && !validation[8]}
                  />
                    <Form.Control.Feedback type="invalid">
                   {EmployeeErrorCode.EMPLOYEE_1}
                  </Form.Control.Feedback>
                </FloatingLabel>
            

                <FloatingLabel className='mb-3 float-lable-input' label="Tổng tiền đã bán">
                  <Form.Control type="text" placeholder="..."
                    onChange={(e) => handleTotal_sales(e.target.value)}
                    value={total_sales}
                  />
                </FloatingLabel>

                <FloatingLabel className='mb-3 float-lable-input' label="Tổng tiền hoa hồng" >
                  <Form.Control type="text" placeholder="..."
                    value={total_commission}
                    onChange={(e) => handleTotal_commission(e.target.value)}

                  />
                </FloatingLabel>
              </Col>

            </Row>

            <div className='div-back-create' >
              <Button className='btn-create-back'
                onClick={() => handleHideModal()}
              >Trở lại</Button>
              <Button
                onClick={() => handleCreate()}
                variant="success" >Tạo</Button>
            </div>
          </Container>


        </Modal.Body>
      </Modal>
    </>
  );
}

export default AccountCreateModal;