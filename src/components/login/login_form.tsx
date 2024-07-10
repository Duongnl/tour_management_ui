'use client'
import { Form } from "react-bootstrap"
import { Button } from "react-bootstrap"
import "@/styles/login.css"
import { useState } from "react"
import { LoginServerActions } from "./login_server_actions"
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';
import LoginErrorCode from "./login_error_code"
import { ExportError } from "@/utils/export_error"
const LoginForm = (props:any) => {

    const[account_name, setAccount_name] = useState('');
    const[password,setPassword] = useState('');
  

    // const handleLogin = async () => {
    //   const res = await props.LoginServerActions(account_name, password)
    //   console.log(res)
    //   if (res === "SUCCESS") {
    //     // router.push('/management');

    //   } else if (res === "FAIL") {

    //   }
    // }

    const handleLogin = async () => {
        const res = await LoginServerActions(account_name,password);
        if (res.status === "SUCCESS") {
            window.location.href = '/management';
            // toast.success("Đăng nhập thành công")
        } else {
            let errors = ExportError(res,LoginErrorCode);
            for (let i:number = 0; i<errors.length; i++) {
                toast.error(errors[i]);
            }
        }
    }

    return (
        <>
            

            <Form className="form-login">
                <div className="div-title-login">
                    <h3>Đăng nhập</h3>
                </div>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên đăng nhập</Form.Label>
                    <Form.Control name="account_name" type="text" placeholder="Nhập tên đăng nhập"
                    value={account_name}
                    onChange={(e)=> setAccount_name(e.target.value)}
                    />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group  className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control name="password" type="password" placeholder="Nhập mật khẩu" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
                <div className="div-btn-login">
                    <Button variant="primary" type="button" className="btn-login" 
                    onClick={handleLogin}
                    >
                        Đăng nhập
                    </Button>
                </div>

            </Form>
        </>
    )
}

export default LoginForm