import "@/styles/role.css"
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import RoleUpdateForm from "@/components/role/role_update_form";
const DetailRole = async (props: any) => {

    const { params } = props;
    const res = await fetch(
        `http://localhost:8080/api/role/${params.id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const role = data.result;

    console.log(role)

    return (
        <>
            <Container className="ctn-role">
                <Row>
                    <h4>Chi tiết quyền</h4>
                </Row>
                <Row>
                    <RoleUpdateForm
                        role = {role}
                        slug = {params.id}
                    />
                </Row>
            </Container>
        </>
    )
}
export default DetailRole