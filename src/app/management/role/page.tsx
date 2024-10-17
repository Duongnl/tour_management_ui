"use server"
import "@/styles/role.css"
import { Container, Row } from "react-bootstrap"
import { Suspense } from "react";
import { getSessionId } from "@/utils/session_store"
import RoleTable from "@/components/role/role_table";
import { fetchGetRoles } from "@/utils/serviceApiServer";
const RolePage = async () => {

    try {
        const roles = await fetchGetRoles();
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
    } catch (error) {
        // console.error(error);
        // Handle error, e.g., show an error message
        return <div>Error fetching data</div>;
    }
   
    
}

export default RolePage