'use client'
import { Form } from "react-bootstrap"
import { Button } from "react-bootstrap"
import "@/styles/login.css"
const LoginForm = () => {
    return (
        <>
            <Form className="form-login">
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên đăng nhập</Form.Label>
                    <Form.Control type="text" placeholder="Nhập tên đăng nhập" />
                    {/* <Form.Text className="text-muted">
                        We'll never share your email with anyone else.
                    </Form.Text> */}
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control type="password" placeholder="Nhập mật khẩu" />
                </Form.Group>
                {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Check me out" />
                </Form.Group> */}
                <div className="div-btn-login">
                <Button variant="primary" type="button" className="btn-login" >
                    Đăng nhập
                </Button>
                </div>
      
            </Form>
        </>
    )
}

export default LoginForm