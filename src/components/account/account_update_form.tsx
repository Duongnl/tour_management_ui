'use client'
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Col, Container, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
import Link from 'next/link';
import Button from 'react-bootstrap/Button';
import cookie from 'js-cookie';
import { useEffect } from 'react';
import AccountErrorCode from '@/exception/account_error_code';
import EmployeeErrorCode from '@/exception/employee_error_code';
import { toast } from 'react-toastify';
import { ExportError } from '@/utils/export_error';
interface IProps {
  account: IGetAccountResponse
  roles: IRoleResponse[]
  url: string
}

const AccountUpdateForm = (props: IProps) => {
  // const [key, setKey] = useState('account');
  const { roles, account, url } = props
  const [accountRes, setAccountRes] = useState<IGetAccountResponse>(account);
  const [validationAccount, setValidationAccount] = useState<boolean[]>(Array(6).fill(true));
  const [validationEmployee, setValidationEmployee] = useState<boolean[]>(Array(4).fill(true));

  var Typeahead = require('react-bootstrap-typeahead').Typeahead; // CommonJS

  const [validAccount, setValidAccount] = useState<boolean>(false)

  const [validEmployee, setValidEmployee] = useState<boolean>(false)

  const [role, setRole] = useState<IRoleResponse>(account.role)
  const handleSelectedRole = (role: IRoleResponse) => {
    setRole(role)
    setRole_error("")
    validationAccount[3] = true
  }


  const [account_name, setAccount_name] = useState<string>(accountRes.account_name);
  const [password, setPassword] = useState<string>('');
  const [repassword, setRepassword] = useState<string>('');
  const [email, setEmail] = useState<string>(accountRes.email);
  const [phone_number, setPhone_number] = useState<string>(accountRes.phone_number);
  const [birthday, setBirthday] = useState<string>(accountRes.employee.birthday);
  const [employee_name, setEmployee_name] = useState<string>(accountRes.employee.employee_name);
  const [total_sales, setTotal_sales] = useState<number>(accountRes.employee.total_sales);
  const [total_commission, setTotal_commission] = useState<number>(accountRes.employee.total_commission);



  const [role_error, setRole_error] = useState('')


  const handleAccount_name = (e: string) => {
    setValidAccount(true)
    const regex: RegExp = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    if (regex.test(e)) {
      validationAccount[0] = true
    } else {
      validationAccount[0] = false
    }
    setAccount_name(e);
  }

  const handlePassword = (e: string) => {
    setValidAccount(true)
    const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/;

    if (regex.test(e) === true) {
      validationAccount[1] = true
    } else if (e === '') {
      validationAccount[1] = true
    }
    else {
      validationAccount[1] = false
    }
    setPassword(e);

    if (repassword != '') {
      if (e == repassword) {
        validationAccount[2] = true
        setRepassword(e);
      } else {
        validationAccount[2] = false
      }
    } else if (e === '') {
      validationAccount[2] = true
    }
    else {
      validationAccount[2] = false
    }
  }


  console.log("paass", validationAccount[1])

  console.log("repaass", validationAccount[2])
  const handleRepassword = (e: string) => {
    setValidAccount(true)
    if (e === password) {
      validationAccount[2] = true
    } else {
      validationAccount[2] = false
    }
    setRepassword(e);
  }

  const handleRole = (e: string) => {
    validationAccount[3] = false;
    setRole_error("Vui lòng chọn quyền ở mục đề xuất");
  }

  useEffect(() => {
    if (!role) {
      setRole_error("Vui lòng chọn quyền ở mục đề xuất");
      validationAccount[3] = false;
    } else {
      setRole_error('');
      validationAccount[3] = true;
    }
  }, [role]);

  const handleEmail = (e: string) => {
    setValidAccount(true)
    const regex: RegExp = /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    if (regex.test(e)) {
      validationAccount[4] = true
    } else {
      validationAccount[4] = false
    }
    setEmail(e);
  }

  const handlePhone_number = (e: string) => {
    setValidAccount(true)
    const regex: RegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    if (regex.test(e)) {
      validationAccount[5] = true
    } else {
      validationAccount[5] = false
    }
    setPhone_number(e);
  }

  const handleUpdateAccount = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validationAccount.length; i++) {
      if (validationAccount[i] == false || validationAccount[i] == undefined) {
        flag = false;
        break;
      }
    }

    if (flag) {
      let accountRequest;
      if (password != '') {
        accountRequest = {
          account_name: account_name,
          email: email,
          phone_number: phone_number,
          password: password,
          role_id: role.role_id,
        }
      } else {
        accountRequest = {
          account_name: account_name,
          email: email,
          phone_number: phone_number,
          role_id: role.role_id,
        }
      }

      console.log(accountRequest)
      const res = await fetch(
        `http://localhost:8080/api/account/${url}`,
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
          },
          body: JSON.stringify(accountRequest)
        }
      );

      const data = await res.json();
      if (data.status == "SUCCESS") {
        toast.success(`Cập nhật người dùng ${account_name} thành công`)
        setPassword('')
        setRepassword('')
        setValidAccount(false)
       
        setAccountRes({...account,
          account_name: account_name,
          email: email,
          phone_number: phone_number,
          role: role,
        })
      } else {
        let errors = ExportError(data, AccountErrorCode);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        console.log("response:", data)
      }

    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ")
    }
  }


  const handleEmployee_name = (e: string) => {
    const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
    setValidEmployee(true)
    if (regex.test(e)) {
      validationEmployee[0] = true
    } else {
      validationEmployee[0] = false
    }
    setEmployee_name(e);
  }

  const handleBirthday = (e: string) => {
    setValidEmployee(true)
    const regex: RegExp = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      validationEmployee[1] = true
    } else {
      validationEmployee[1] = false
    }
    setBirthday(e)
  }

  const handleTotal_sales = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;
    setValidEmployee(true)
    if (e == '') {
      e = '0'
      setTotal_sales(0);
    }

    if (regex.test(e)) {
      validationEmployee[2] = true
      setTotal_sales(Number(e));
    } else {
    }
  }

  const handleTotal_commission = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;
    setValidEmployee(true)
    if (e == '') {
      e = '0'
      setTotal_commission(0);
    }

    if (regex.test(e)) {
      validationEmployee[3] = true
      setTotal_commission(Number(e));
    } else {

    }
  }


  const handleUpdateEmployee = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validationEmployee.length; i++) {
      if (validationEmployee[i] == false) {
        flag = false;
        break;
      }
    }
    if (flag) {
      const employeeRequest: IEmployeeRequest = {
        employee_name: employee_name.trim(),
        birthday: birthday,
        total_commission: total_commission,
        total_sales: total_sales,
      }

      const res = await fetch(
        `http://localhost:8080/api/account/employee/${url}`,
        {
          method: "PUT",
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
          },
          body: JSON.stringify(employeeRequest)
        }
      );

      const data = await res.json();
      console.log(data)
      if (data.status == "SUCCESS") {
        toast.success(`Cập nhật người dùng ${account_name} thành công`)
        setValidEmployee(false)
        setAccountRes({...account,
          employee: {
            ...account.employee,
            employee_name: employee_name.trim(),
            birthday: birthday,
            total_commission: total_commission,
            total_sales: total_sales,
          }
        })
      } else {
        let errors = ExportError(data, EmployeeErrorCode);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        console.log("response:", data)
      }

    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ")
    }
  }

  return (
    <>
      <Tabs
        defaultActiveKey="account"
        id="uncontrolled-tab-example"
        className="mb-3 tabs-account"
      >
        <Tab eventKey="account" title="Thông tin tài khoản" className='tab-account'  >

          <Row>
            <Col>
              <FloatingLabel className='mb-3 float-lable-input' label="Tên đăng nhập">
                <Form.Control type="text" placeholder="..."
                  value={account_name}
                  onChange={(e) => handleAccount_name(e.target.value)}
                  isValid={account_name != accountRes.account_name && validAccount && validationAccount[0]}
                  isInvalid={account_name != '' && !validationAccount[0]}
                />
                <Form.Control.Feedback type="invalid">
                  {AccountErrorCode.ACCOUNT_4}
                </Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel className='mb-3 float-lable-input' label="Mật khẩu">
                <Form.Control type="text" placeholder="..." value={password}
                  onChange={(e) => handlePassword(e.target.value)}
                  isValid={validAccount && password != '' && validationAccount[1]}
                  isInvalid={password != '' && !validationAccount[1]}
                />
                <Form.Control.Feedback type="invalid">
                  {AccountErrorCode.ACCOUNT_5}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel className='mb-3 float-lable-input' label="Nhập lại mật khẩu">
                <Form.Control type="text" placeholder="..."
                  value={repassword}
                  onChange={(e) => handleRepassword(e.target.value)}
                  isValid={validAccount && repassword != '' && validationAccount[2]}
                  isInvalid={repassword != '' && !validationAccount[2]}
                />
                <Form.Control.Feedback type="invalid">
                  "Mật khẩu không khớp"
                </Form.Control.Feedback>
              </FloatingLabel>

            </Col>
            <Col>

              <Typeahead
                selected={role ? [role] : []}
                placeholder="Quyền"
                onChange={(role: IRoleResponse[]) => handleSelectedRole(role[0])}
                labelKey={(role: IRoleResponse) => role.role_name}
                options={roles}
                onInputChange={(e: string) => handleRole(e)}
              />
              <input type="text" className='input-error' value={role_error} style={{ marginBottom: '15px' }} disabled />
              <FloatingLabel className='mb-3 float-lable-input' label="Email">
                <Form.Control type="text" placeholder="..."
                  value={email}
                  onChange={(e) => handleEmail(e.target.value)}
                  isValid={email != accountRes.email && validAccount && validationAccount[4]}
                  isInvalid={email != '' && !validationAccount[4]}
                />
                <Form.Control.Feedback type="invalid">
                  {AccountErrorCode.ACCOUNT_7}
                </Form.Control.Feedback>
              </FloatingLabel>
              <FloatingLabel className='mb-3 float-lable-input' label="Số điện thoại">
                <Form.Control type="text" placeholder="..."
                  value={phone_number}
                  onChange={(e) => handlePhone_number(e.target.value)}
                  isValid={phone_number != accountRes.phone_number && validAccount && validationAccount[5]}
                  isInvalid={phone_number!= '' && !validationAccount[5]}
                />
                    <Form.Control.Feedback type="invalid">
                  {AccountErrorCode.ACCOUNT_8}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Col>
          </Row>
          <div className='div-back-create' >
            <Button className='btn-back'>
              <Link href={'/management/account/'} className='link-back' >Trở lại</Link>
            </Button>
            <Button
              onClick={() => handleUpdateAccount()}
              variant="success" >Lưu</Button>
          </div>


        </Tab>
        <Tab eventKey="profile" title="Thông tin cá nhân" className='tab-profile' >
          <Row>
            <Col>
              <FloatingLabel className='mb-3 float-lable-input' label="Họ tên">
                <Form.Control type="text" placeholder="..."
                  value={employee_name}
                  onChange={(e) => handleEmployee_name(e.target.value)}
                  isValid={employee_name != accountRes.employee.employee_name && validEmployee && validationEmployee[0]}
                  isInvalid={employee_name!= '' && !validationEmployee[0]}
                />
                <Form.Control.Feedback type="invalid">
                  {EmployeeErrorCode.EMPLOYEE_2}
                </Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel className='mb-3 float-lable-input' label="Tổng tiền đã bán">
                <Form.Control type="text" placeholder="..."
                  value={total_sales}
                  onChange={(e) => handleTotal_sales(e.target.value)}
                  isValid={total_sales != accountRes.employee.total_sales && validEmployee && validationEmployee[2]}
                />
              </FloatingLabel>

            </Col>
            <Col>

              <FloatingLabel className='mb-3 float-lable-input' label="Ngày sinh">
                <Form.Control type="date" placeholder="..." value={birthday}
                  onChange={(e) => handleBirthday(e.target.value)}
                  isValid={birthday != accountRes.employee.birthday && validEmployee && validationEmployee[1]}
                  isInvalid={birthday!= '' && !validationEmployee[1]}
                />
                <Form.Control.Feedback type="invalid">
                  {EmployeeErrorCode.EMPLOYEE_1}
                </Form.Control.Feedback>
              </FloatingLabel>

              <FloatingLabel className='mb-3 float-lable-input' label="Tổng tiền hoa hồng">
                <Form.Control type="text" placeholder="..."
                  value={total_commission}
                  onChange={(e) => handleTotal_commission(e.target.value)}
                  isValid={total_commission != accountRes.employee.total_commission && validEmployee && validationEmployee[3]}
                />
              </FloatingLabel>

            </Col>
          </Row>
          <div className='div-back-create' >
            <Button className='btn-back'>
              <Link href={'/management/account/'} className='link-back' >Trở lại</Link>
            </Button>
            <Button
              onClick={() => { handleUpdateEmployee() }}
              variant="success" >Lưu</Button>
          </div>
        </Tab>
      </Tabs>

    </>
  )
}

export default AccountUpdateForm