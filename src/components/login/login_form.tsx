"use client";
import { Form } from "react-bootstrap";
import { Button } from "react-bootstrap";
import "@/styles/login.css";
import { useState, useEffect } from "react";
import { LoginServerActions } from "./login_server_actions";
//import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import AccountErrorCode from "@/exception/account_error_code";
import { ExportError } from "@/utils/export_error";
import { fetchGetMyInfo } from "@/utils/serviceApiClient";

interface IProps {
    isPageLogin: boolean;
  }

const LoginForm = (props: IProps) => {
  const [account_name, setAccount_name] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await LoginServerActions(account_name, password);
    if (res.status === "SUCCESS") {
      if (props.isPageLogin) {

        const account:IGetAccountResponse = await fetchGetMyInfo()

        // window.location.href = "/management";
       
        let permissionString: string[] = [];
        for (let i: number = 0; i < account.role.permissions.length; i++) {
          permissionString.push(account.role.permissions[i].permission_id);
        }
        // console.log("Login success data >>> ",  permissionString)
        if (permissionString.includes("ACCESS_DASHBOARD")) {
            window.location.href = "/management";
        } else if (permissionString.includes("ACCESS_CATEGORY")) {
           window.location.href = "/management/category";
        } else if (permissionString.includes("ACCESS_TOUR")) {
           window.location.href = "/management/tour";
         } else if (permissionString.includes("ACCESS_RESERVE")) {
            window.location.href = "/management/reserve";
        } else if (permissionString.includes("ACCESS_BOOKED")) {
           window.location.href = "/management/booked";
        } else if (permissionString.includes("ACCESS_CUSTOMER")) {
           window.location.href = "/management/customer";
        }else if (permissionString.includes("ACCESS_ACCOUNT")) {
          window.location.href = "/management/account";
       }else if (permissionString.includes("ACCESS_ROLE")) {
        window.location.href = "/management/role";
       }else if (permissionString.includes("ACCESS_HISTORY")) {
        window.location.href = "/management/history";
       } else {
          toast.error("Bạn không có bất kỳ quyền truy cập nào")
       }


      }
      else {
        window.location.reload();
      } 
    } else {
      let errors = ExportError(res, AccountErrorCode);
      for (let i: number = 0; i < errors.length; i++) {
        toast.error(errors[i]);
      }
    }
  };

  const onKeyDown = (e: any) => {
    if (e.key == "Enter") {
      handleLogin();
    }
  };

  return (
    <>
      <Form className="form-login">
        <div className="div-title-login">
          <h3>Đăng nhập</h3>
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Tên đăng nhập</Form.Label>
          <Form.Control
            name="account_name"
            type="text"
            placeholder="Nhập tên đăng nhập"
            value={account_name}
            onChange={(e) => setAccount_name(e.target.value)}
            onKeyDown={(e) => onKeyDown(e)}
          />
          {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Mật khẩu</Form.Label>
          <Form.Control
            name="password"
            type="text"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => onKeyDown(e)}
          />
        </Form.Group>
        {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
        <div className="div-btn-login">
          <Button
            variant="primary"
            type="button"
            className="btn-login"
            onClick={() => handleLogin()}
          >
            Đăng nhập
          </Button>
        </div>
      </Form>
    </>
  );
};

export default LoginForm;
