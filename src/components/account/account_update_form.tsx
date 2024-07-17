'use client'
import { useState } from 'react';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { Col, Container, Row } from "react-bootstrap"
import Form from 'react-bootstrap/Form';
interface IProps {
    account: IGetAccountResponse
}

const AccountUpdateForm = (props: IProps) => {
    // const [key, setKey] = useState('account');
    const { account } = props
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
                                <Form.Control type="text" placeholder="..." />
                            </FloatingLabel>
                        </Col>
                        <Col></Col>
                    </Row>



                </Tab>
                <Tab eventKey="profile" title="Thông tin cá nhân" className='tab-profile' >
                    Tab content for Profile
                </Tab>
            </Tabs>
        </>
    )
}

export default AccountUpdateForm