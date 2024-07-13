// "use server"
import { Container, Row } from "react-bootstrap"
import "@/styles/account.css"
import { getSessionId } from "@/utils/session_store"
import AccountTable from "@/components/account/account_table";

const AccountPage = async () => {

    const res = await fetch(
        "http://localhost:8080/api/account",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const accounts = data.result;

    return (
        <>
            <Container className="ctn-account">
                <Row>
                    <h4>Quản lý người dùng</h4>
                </Row>
                <Row>
                    {/* Bạn có thể sử dụng fetchData như một Promise */}
                    <AccountTable accounts={accounts} />
                </Row>
            </Container>
        </>
    )
}

export default AccountPage;