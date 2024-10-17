"use client";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import cookie from "js-cookie";
import AccountErrorCode from "@/exception/account_error_code";
import EmployeeErrorCode from "@/exception/employee_error_code";
import { toast } from "react-toastify";
import { ExportError } from "@/utils/export_error";
import {
  handleDate,
  handleEmail,
  handleName,
  handlePhoneNumber,
} from "@/utils/handleUtils";
import { CreateSlug } from "@/utils/create_slug";
import { fetchPutAccount, fetchPutEmployee } from "@/utils/serviceApiClient";
interface IProps {
  account: IGetAccountResponse;
}

const ProfileModal = (props: IProps) => {
  // const [key, setKey] = useState('account');
  const [accountRes, setAccountRes] = useState<IGetAccountResponse>(
    props.account
  );
  const [validationAccount, setValidationAccount] = useState<boolean[]>(
    Array(2).fill(true)
  );
  const [validationEmployee, setValidationEmployee] = useState<boolean[]>(
    Array(2).fill(true)
  );

  const [account_name, setAccount_name] = useState<string>(
    accountRes.account_name
  );
  const [password, setPassword] = useState<string>("");
  const [repassword, setRepassword] = useState<string>("");
  const [email, setEmail] = useState<string>(accountRes.email);
  const [phone_number, setPhone_number] = useState<string>(
    accountRes.phone_number
  );
  const [birthday, setBirthday] = useState<string>(
    accountRes.employee.birthday
  );
  const [employee_name, setEmployee_name] = useState<string>(
    accountRes.employee.employee_name
  );
  const url =
    CreateSlug(accountRes.employee.employee_name) + "-" + accountRes.account_id;

  const handleUpdateProfile = async () => {
    let flag1: boolean = true;
    for (let i: number = 0; i < validationEmployee.length; i++) {
      if (validationEmployee[i] == false) {
        flag1 = false;
        break;
      }
    }
    let flag2: boolean = true;
    for (let i: number = 0; i < validationAccount.length; i++) {
      if (validationAccount[i] == false || validationAccount[i] == undefined) {
        flag2 = false;
        break;
      }
    }

    if (flag1 && flag2) {
      const employeeRequest: IEmployeeRequest = {
        employee_name: employee_name.trim(),
        birthday: birthday,
        total_commission: accountRes.employee.total_commission,
        total_sales: accountRes.employee.total_sales,
      };

      let accountRequest: IAccountUpdateRequest = {
        account_name: account_name,
        email: email,
        phone_number: phone_number,
        role_id: accountRes.role.role_id,
      };

      if (password != "" && password === repassword) {
        accountRequest.password = password;
      }

      const putData = async (): Promise<void> => {
        try {
          const [accountResponse, employeeResponse] = await Promise.all([
            fetchPutAccount(url, accountRequest),
            fetchPutEmployee(url, employeeRequest),
          ]);

          if (
            accountResponse.status === "SUCCESS" &&
            employeeResponse.status === "SUCCESS"
          ) {
            toast.success(`Cập nhật người dùng ${account_name} thành công`);
            setPassword("");
            setRepassword("");
          } else {
            let errors1 = ExportError(accountResponse, EmployeeErrorCode);
            for (let i: number = 0; i < errors1.length; i++) {
              toast.error(errors1[i]);
            }
            let errors2 = ExportError(employeeResponse, EmployeeErrorCode);
            for (let i: number = 0; i < errors2.length; i++) {
              toast.error(errors2[i]);
            }
          }
        } catch (error) {
          // console.error("Có lỗi xảy ra:", error);
          // Xử lý lỗi chung nếu xảy ra sự cố trong bất kỳ hàm fetch nào
        }
      };
      putData();
    } else toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ");
  };

  const updateValidationAccount = (index: number, isValid: boolean) => {
    setValidationAccount((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };
  const updateValidationEmployee = (index: number, isValid: boolean) => {
    setValidationEmployee((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };

  return (
    <div className="container rounded bg-white mb-5">
      <div className="row">
        <div className="col-md-3 border-right">
          <div className="d-flex flex-column align-items-center text-center p-3 py-5">
            <img
              className="rounded-circle mt-5"
              width="150px"
              src="/depositphotos_179308454-stock-illustration-unknown-person-silhouette-glasses-profile.jpg"
            />
            <span className="font-weight-bold">@{accountRes.account_name}</span>
            <span className="text-black-50">{accountRes.email}</span>
            <span className="text-black-50">{accountRes.phone_number}</span>
            <span className="text-black-50">{accountRes.time}</span>
          </div>
        </div>
        <div className="col-md-5 border-right">
          <div className="p-2 py-1">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="d-flex justify-content-center">
                Thông tin tài khoản
              </h4>
            </div>
            <div className="row mt-2">
              <div className="col-md-12">
                <label className="labels">Tên đăng nhập</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="first name"
                  value={account_name}
                  readOnly
                />
              </div>

              <div className="col-md-12">
                <label className="labels">Số điện thoại</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter phone number"
                  value={phone_number}
                  onChange={(e) =>
                    handlePhoneNumber(
                      e.target.value,
                      (isValid) => updateValidationAccount(1, isValid),
                      setPhone_number
                    )
                  }
                />
              </div>

              <div className="col-md-12">
                <label className="labels">Email</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter phone number"
                  value={email}
                  onChange={(e) =>
                    handleEmail(
                      e.target.value,
                      (isValid) => updateValidationAccount(2, isValid),
                      setEmail
                    )
                  }
                />
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-md-12">
                <label className="labels">Họ và tên</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="first name"
                  value={employee_name}
                  onChange={(e) =>
                    handleName(
                      e.target.value,
                      (isValid) => updateValidationEmployee(1, isValid),
                      setEmployee_name
                    )
                  }
                />
              </div>
              <div className="col-md-12">
                <label className="labels">Ngày sinh</label>
                <input
                  type="date"
                  className="form-control"
                  placeholder="enter address line 2"
                  value={birthday}
                  onChange={(e) =>
                    handleDate(
                      e.target.value,
                      (isValid) => updateValidationEmployee(2, isValid),
                      setBirthday
                    )
                  }
                />
              </div>
              <div className="col-md-12">
                <label className="labels">Tổng số tiền hoa hồng</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter address line 2"
                  value={accountRes.employee.total_commission}
                  disabled
                />
              </div>
              <div className="col-md-12">
                <label className="labels">Tổng số doanh thu</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter address line 2"
                  value={accountRes.employee.total_sales}
                  disabled
                />
              </div>
            </div>
            <div className="mt-5 text-center">
              <Button
                className="btn btn-primary profile-button"
                onClick={() => handleUpdateProfile()}
              >
                Cập nhật tài khoản
              </Button>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-2 py-1">
            <div className="border border-1 bg-warning d-block  p-2 mb-2">
              <span>Quyền {accountRes.role.role_name}</span>
            </div>
            <div className="list-role_profile ">
              {accountRes?.role?.permissions?.length > 0 &&
                Array.from(
                  { length: accountRes.role.permissions.length },
                  (_, index) => (
                    <div
                      key={index}
                      className="border border-1 border-info d-block rounded-3 p-2 mb-2"
                    >
                      {accountRes.role.permissions[index].permission_name}
                    </div>
                  )
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
