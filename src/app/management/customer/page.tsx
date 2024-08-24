import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import { Suspense } from "react";
import CustomerTable from "@/components/customer/customer_table";

const CustomerPage = async () => {

    const res = await fetch(
        "http://localhost:8080/api/customer",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const customers = data.result;
    
    return (
        
            <Container className="ctn-customer">
                 <Row>
                    <h4>
                        Quản lý khách hàng
                    </h4>
                 </Row>
                 <Row>
                    <Suspense  >
                        <CustomerTable customers={customers} />
                    </Suspense>
                </Row>
            </Container>
    )
}

export default CustomerPage