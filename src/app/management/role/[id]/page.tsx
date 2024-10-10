import "@/styles/role.css"
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import RoleUpdateForm from "@/components/role/role_update_form";
import { fetchGetRole } from "@/utils/serviceApiServer";
const DetailRole = async (props: any) => {

    const { params } = props;
    const role = await fetchGetRole(params.id)

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