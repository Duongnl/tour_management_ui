"use server"
import "@/styles/role.css"
import { Container, Row } from "react-bootstrap"
import { Suspense } from "react";
import { getSessionId } from "@/utils/session_store"
import RoleTable from "@/components/role/role_table";
const RolePage = async () => {


    const res = await fetch(
        "http://localhost:8080/api/role",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const roles = data.result;
   
    return (
        <Container className="ctn-role">
            <Row>
                <h4>Quản lý quyền</h4>
            </Row>
            <Row>
                <Suspense>
                    <RoleTable 
                        roles={roles}
                    />
                </Suspense>
            </Row>
        </Container>
    )
}

export default RolePage