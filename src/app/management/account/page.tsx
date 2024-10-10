"use server"
import { Container, Row } from "react-bootstrap"
import "@/styles/account.css"
import { getSessionId } from "@/utils/session_store"
import AccountTable from "@/components/account/account_table";
import { Suspense } from "react";
import { fetchGetAccounts } from "@/utils/serviceApiServer";
const AccountPage = async () => {


    try {
        const accounts = await fetchGetAccounts();
        return (
            <>

            <Container className="ctn-account">
                <Row>
                    <h4>Quản lý người dùng</h4>
                </Row>
                <Row>
                    <Suspense>
                        <AccountTable accounts={accounts} />
                    </Suspense>
                </Row>
            </Container>

        </>
        );
      } catch (error) {
        console.error(error);
        // Handle error, e.g., show an error message
        return <div>Error fetching data</div>;
      }
}

export default AccountPage;