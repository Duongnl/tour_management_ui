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
  const [validationAccount, setValidationAccount] = useState<boolean[]>(Array(6).fill(true));
  const [validationEmployee, setValidationEmployee] = useState<boolean[]>(Array(4).fill(true));

  var Typeahead = require('react-bootstrap-typeahead').Typeahead; // CommonJS


  const [role, setRole] = useState<IRoleResponse>(account.role)
  const handleSelectedRole = (role: IRoleResponse) => {
    setRole(role)
    setRole_error("")
    validationAccount[3] = true
  }


  const [account_name, setAccount_name] = useState<string>(account.account_name);
  const [password, setPassword] = useState<string>('');
  const [repassword, setRepassword] = useState<string>('');
  const [email, setEmail] = useState<string>(account.email);
  const [phone_number, setPhone_number] = useState<string>(account.phone_number);
  const [birthday, setBirthday] = useState<string>(account.employee.birthday);
  const [employee_name, setEmployee_name] = useState<string>(account.employee.employee_name);
  const [total_sales, setTotal_sales] = useState<number>(account.employee.total_sales);
  const [total_commission, setTotal_commission] = useState<number>(account.employee.total_commission);


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


  const handleAccount_name = (e: string) => {
    const regex: RegExp = /^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){3,18}[a-zA-Z0-9]$/;
    if (regex.test(e)) {
      setAccount_name_error('');
      validationAccount[0] = true
    } else {
      validationAccount[0] = false
      setAccount_name_error("Tài khoản phải từ 5 đến 20 ký tự, chỉ chứa số, chữ, dấu . _ -");
    }
    setAccount_name(e);
  }

  const handlePassword = (e: string) => {
    const regex: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,20}$/;
    if (regex.test(e) === true) {
      setPassword_error('');
      validationAccount[1] = true
    } else {
      validationAccount[1] = false

      setPassword_error("Mật khẩu phải từ 8 đến 20 ký tự, chứa ít nhất một số, chữ thường, hoa,ký tự đặc biệt");
    }
    setPassword(e);

    if (repassword != '') {
      if (e == repassword) {
        setRepassword_error("")
        validationAccount[2] = true
        setRepassword(e);
      } else {
        setRepassword_error("Mật khẩu không khớp")
        validationAccount[2] = false
      }
    }
  }

  const handleRepassword = (e: string) => {
    if (e === password) {
      validationAccount[2] = true
      setRepassword_error("")
    } else {
      validationAccount[2] = false
      setRepassword_error("Mật khẩu không khớp")
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
    const regex: RegExp = /^(?=.{1,64}@)[A-Za-z0-9_-]+(\.[A-Za-z0-9_-]+)*@[^-][A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*(\.[A-Za-z]{2,})$/;
    if (regex.test(e)) {
      setEmail_error('');
      validationAccount[4] = true
    } else {
      validationAccount[4] = false
      setEmail_error(AccountErrorCode.ACCOUNT_7);
    }
    setEmail(e);
  }

  const handlePhone_number = (e: string) => {
    const regex: RegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;

    if (regex.test(e)) {
      setPhone_number_error('');
      validationAccount[5] = true
    } else {
      validationAccount[5] = false
      setPhone_number_error(AccountErrorCode.ACCOUNT_8);
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
    const regex: RegExp = /^[\p{L} ]{2,255}$/u;
    if (regex.test(e)) {
      setEmployee_name_error('');
      validationEmployee[0] = true
    } else {
      validationEmployee[0] = false
      setEmployee_name_error(EmployeeErrorCode.EMPLOYEE_2);
    }
    setEmployee_name(e);
  }

  const handleBirthday = (e: string) => {
    const regex: RegExp = /^((?:19|20)[0-9][0-9])-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])/;
    if (regex.test(e)) {
      setBirthday_error("");
      validationEmployee[1] = true
    } else {
      validationEmployee[1] = false
      setBirthday_error(EmployeeErrorCode.EMPLOYEE_1);
    }
    setBirthday(e)
  }

  const handleTotal_sales = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;

    if (e == '') {
      e = '0'
      setTotal_sales(0);
    }

    if (regex.test(e)) {
      setTotal_sales_error('');
      validationEmployee[2] = true
      setTotal_sales(Number(e));
    } else {
      setTotal_sales_error("Chỉ chứ số từ 0 đến 9");
    }
  }

  const handleTotal_commission = (e: string) => {
    const regex: RegExp = /^[0-9]+$/;

    if (e == '') {
      e = '0'
      setTotal_commission(0);
    }

    if (regex.test(e)) {
      setTotal_commission_error('');
      validationEmployee[3] = true
      setTotal_commission(Number(e));
    } else {
      setTotal_commission_error("Chỉ chứ số từ 0 đến 9");
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
        employee_name: employee_name,
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
              <FloatingLabel className='mb-3' label="Tên đăng nhập">
                <Form.Control type="text" placeholder="..."
                  value={account_name}
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
                <Form.Control type="text" placeholder="..."
                  value={repassword}
                  onChange={(e) => handleRepassword(e.target.value)}
                />
                <input type="text" className='input-error' value={repassword_error} disabled />
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
              <FloatingLabel className='mb-3' label="Email">
                <Form.Control type="text" placeholder="..."
                  value={email}
                  onChange={(e) => handleEmail(e.target.value)}
                />
                <input type="text" className='input-error' value={email_error} disabled />
              </FloatingLabel>
              <FloatingLabel className='mb-3' label="Số điện thoại">
                <Form.Control type="text" placeholder="..."
                  value={phone_number}
                  onChange={(e) => handlePhone_number(e.target.value)}
                />
                <input type="text" className='input-error' value={phone_number_error} disabled />
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
              <FloatingLabel className='mb-3' label="Họ tên">
                <Form.Control type="text" placeholder="..."
                  value={employee_name}
                  onChange={(e) => handleEmployee_name(e.target.value)}
                />
                <input type="text" className='input-error' value={employee_name_error} disabled />
              </FloatingLabel>

              <FloatingLabel className='mb-3' label="Tổng tiền đã bán">
                <Form.Control type="text" placeholder="..."
                  value={total_sales}
                  onChange={(e) => handleTotal_sales(e.target.value)}
                />
                <input type="text" className='input-error' value={total_sales_error} disabled />
              </FloatingLabel>

            </Col>
            <Col>
              <input type="date" className='form-control input-birthday' placeholder='Ngày sinh'
                value={birthday}
                onChange={(e) => handleBirthday(e.target.value)}
              />
              <input type="text" className='input-error' value={birthday_error} disabled style={{ marginBottom: '15px' }} />

              <FloatingLabel className='mb-3' label="Tổng tiền hoa hồng">
                <Form.Control type="text" placeholder="..."
                  value={total_commission}
                  onChange={(e) => handleTotal_commission(e.target.value)}
                />
                <input type="text" className='input-error' value={total_commission_error} disabled />
              </FloatingLabel>

            </Col>
          </Row>
          <div className='div-back-create' >
            <Button className='btn-back'>
              <Link href={'/management/account/'} className='link-back' >Trở lại</Link>
            </Button>
            <Button
            onClick={()=>{handleUpdateEmployee()}}
              variant="success" >Lưu</Button>
          </div>
        </Tab>
      </Tabs>

    </>
  )
}

export default AccountUpdateForm