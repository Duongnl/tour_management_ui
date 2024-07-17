import { getSessionId } from "@/utils/session_store"
import { Suspense } from "react";
import "@/styles/account.css"
import { Container, Row } from "react-bootstrap"
import AccountUpdateForm from "@/components/account/account_update_form";
const DetailAccount = async (props: any) => {
    const { params } = props;
    const res = await fetch(
        `http://localhost:8080/api/account/${params.id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const account = data.result;
    console.log(account)

    return (
        <>
            <Container className="ctn-account">
                <Row>
                    <h4>Chi tiết người dùng</h4>
                </Row>
                <Row>
                    <Suspense  >
                           <AccountUpdateForm
                           account={account}
                           />
                    </Suspense>
                </Row>
            </Container>



        </>
    )

}

export default DetailAccount