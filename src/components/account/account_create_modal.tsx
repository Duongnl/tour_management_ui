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

interface IProps {
  showAccountModal: boolean
  setShowAccountModal: (value: boolean) => void
  fetchAccounts:() =>void
}

const AccountCreateModal = (props: IProps) => {

  const { showAccountModal, setShowAccountModal,fetchAccounts } = props
  const [validation, setValidation] = useState<boolean[]>(Array(10).fill(false));

  const defaultRoleResponse: IRoleResponse = {
    role_id: 0,
    role_name: "",
    status: 0,
  };
  const [role, setRole] = useState<IRoleResponse>(defaultRoleResponse)
  const[roles,setRoles] = useState<IRoleResponse[]>([])



  useEffect(() => {
    const fetchRoles = async () => {
      if (showAccountModal == true) {
        const res = await fetch(
          "http://localhost:8080/api/role",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
            },
          }
        );
        const data = await res.json();
        const roles: IRoleResponse[] = data.result;
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


  const [account_name_error, setAccount_name_error] = useState<string>('');
  const [password_error, setPassword_error] = useState<string>('');
  const [repassword_error, setRepassword_error] = useState<string>('');
  const [email_error, setEmail_error] = useState<string>('');
  const [phone_number_error, setPhone_number_error] = useState<string>('');
  const [birthday_error, setBirthday_error] = useState<string>('');
  const [employee_name_error, setEmployee_name_error] = useState<string>('');
  const [total_sales_error, setTotal_sales_error] = useState<string>('');
  const [total_commission_error, setTotal_commission_error] = useState<string>('');
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
    

    setAccount_name_error('');
    setPassword_error('');
    setRepassword_error('');
    setEmail_error('')
    setPhone_number_error('')
    setBirthday_error('')
    setEmployee_name_error('')
    setTotal_sales_error('')
    setTotal_commission_error('')
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
        employee_name: employee_name,
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
      console.log("account:",initAcountRequest)
      const res = await fetch(
        "http://localhost:8080/api/account",
        {
          method: "POST",
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
          },
          body: JSON.stringify(initAcountRequest)
        }
      );

      const data = await res.json();
      if (data.status == "SUCCESS") {
        toast.success(`Thêm người dùng ${account_name} thành công`)
        setShowAccountModal(false)
        fetchAccounts()
      } else {
        let errors = ExportError(data, AccountErrorCode);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        console.log("response:",data)
      }


    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ")
    }
  }

  const handleAccount_name = (e: string) => {
    const regex: RegExp = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    if (regex.test(e)) {
      setAccount_name_error('');
      validation[0] = true
    } else {
      validation[0] = false
      setAccount_name_error("Tài khoản phải từ 5 đến 20 ký tự, chỉ chứa số, chữ, dấu . _ -");
    }
    setAccount_name(e);
  }

  const handlePassword = (e: string) => {
    const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/;
    if (regex.test(e) === true) {
      setPassword_error('');
      validation[1] = true
    } else {
      validation[1] = false

      setPassword_error("Mật khẩu phải từ 8 đến 20 ký tự, chứa ít nhất một số, chữ thường, hoa,ký tự đặc biệt");
    }
    setPassword(e);

    if (repassword != '') {
      if (e == repassword) {
        setRepassword_error("")
        validation[2] = true
        setRepassword(e);
      } else {
        setRepassword_error("Mật khẩu không khớp")
        validation[2] = false
      }
    }
  }

  const handleRepassword = (e: string) => {
    if (e === password) {
      validation[2] = true
      setRepassword_error("")
    } else {
      validation[2] = false
      setRepassword_error("Mật khẩu không khớp")
    }
    setRepassword(e);
  }

  const handleEmail = (e: string) => {
    const regex: RegExp = /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    if (regex.test(e)) {
      setEmail_error('');
      validation[3] = true
    } else {
      validation[3] = false
      setEmail_error(AccountErrorCode.ACCOUNT_7);
    }
    setEmail(e);
  }

  const handlePhone_number = (e: string) => {
    const regex: RegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    if (regex.test(e)) {
      setPhone_number_error('');
      validation[4] = true
    } else {
      validation[4] = false
      setPhone_number_error(AccountErrorCode.ACCOUNT_8);
    }
    setPhone_number(e);
  }


  const handleEmployee_name = (e: string) => {
    const regex: RegExp = /^[\p{L} ]{2,255}$/u;
    if (regex.test(e)) {
      setEmployee_name_error('');
      validation[5] = true
    } else {
      validation[5] = false
      setEmployee_name_error(EmployeeErrorCode.EMPLOYEE_2);
    }
    setEmployee_name(e);
  }

  const handleTotal_sales = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;
    if (e == '') {
      e='0'
      setTotal_commission(0);
    }
    if (regex.test(e)) {
      setTotal_sales_error('');
      validation[6] = true
      setTotal_sales(Number(e));
    } else {
      setTotal_sales_error("Chỉ chứ số từ 0 đến 9");
    }
  }

  const handleTotal_commission = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;
    if (e == '') {
      e='0'
      setTotal_commission(0);
    }
    if (regex.test(e)) {
      setTotal_commission_error('');
      validation[7] = true
      setTotal_commission(Number(e));
    } else {
      setTotal_commission_error("Chỉ chứ số từ 0 đến 9");
    }
  }

  const handleBirthday = (e: string) => {
    const regex: RegExp = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      setBirthday_error("");
      validation[8] = true
    } else {
      validation[8] = false
      setBirthday_error(EmployeeErrorCode.EMPLOYEE_1);
    }
    setBirthday(e)
  }

  const handleRole = (e:string) => {
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
                <FloatingLabel className='mb-3' label="Tên đăng nhập">
                  <Form.Control type="text" placeholder="..." value={account_name}
                    onChange={(e) => handleAccount_name(e.target.value)}
                  />
                  <input type="text" className='input-error' value={account_name_error} disabled />
                </FloatingLabel>
                <FloatingLabel className='mb-3' label="Mật khẩu">
                  <Form.Control type="text" placeholder="..." value={password}
                    onChange={(e) => handlePassword(e.target.value)}
                  />
                  <input type="text" className='input-error' value={password_error} disabled />
                </FloatingLabel>
                <FloatingLabel className='mb-3' label="Nhập lại mật khẩu">
                  <Form.Control type="text" placeholder="..." value={repassword}
                    onChange={(e) => handleRepassword(e.target.value)}
                  />
                  <input type="text" className='input-error' value={repassword_error} disabled />
                </FloatingLabel>
                <FloatingLabel className='mb-3' label="Email">
                  <Form.Control type="text" placeholder="..." value={email}
                    onChange={(e) => handleEmail(e.target.value)}
                  />
                  <input type="text" className='input-error' value={email_error} disabled />
                </FloatingLabel>
                <FloatingLabel className='mb-3' label="Số điện thoại">
                  <Form.Control type="text" placeholder="..." value={phone_number}
                    onChange={(e) => handlePhone_number(e.target.value)}
                  />
                  <input type="text" className='input-error' value={phone_number_error} disabled />
                </FloatingLabel>

              </Col>
              <Col>
                <Typeahead
                  placeholder="Quyền"
                  onChange={(role: IRoleResponse[]) => handleSelectedRole(role[0])}
                  labelKey={(role: IRoleResponse) => role.role_name}
                  options={roles}
                  onInputChange = {(e:string)=> handleRole(e) }
                />
                <input type="text" className='input-error' value={role_error} style={{ marginBottom: '15px' }} disabled />

                <FloatingLabel className='mb-3' label="Họ tên">
                  <Form.Control type="text" placeholder="..." value={employee_name}
                    onChange={(e) => handleEmployee_name(e.target.value)}
                  />
                  <input type="text" className='input-error' value={employee_name_error} disabled />
                </FloatingLabel>

                <input type="date" className='form-control input-birthday' placeholder='Ngày sinh'
                  value={birthday}
                  onChange={(e) => handleBirthday(e.target.value)}
                />
                <input type="text" className='input-error' value={birthday_error} disabled style={{ marginBottom: '15px' }} />

                <FloatingLabel className='mb-3' label="Tổng tiền đã bán">
                  <Form.Control type="text" placeholder="..."
                    onChange={(e) => handleTotal_sales(e.target.value)}
                    value={total_sales}
                  />
                  <input type="text" value={total_sales_error} className='input-error' disabled />
                </FloatingLabel>

                <FloatingLabel className='mb-3' label="Tổng tiền hoa hồng" >
                  <Form.Control type="text" placeholder="..."
                    value={total_commission}
                    onChange={(e) => handleTotal_commission(e.target.value)}

                  />
                  <input type="text" className='input-error' value={total_commission_error} disabled />
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