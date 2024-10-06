'use sever'
import "@/styles/reserve.css"
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import ReserveForm from "@/components/reserve/reserve_form";

const DetailReserve = async (props: any) => {

    const { params } = props;
    const res = await fetch(
        `http://localhost:8080/api/reserve/${params.id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const tourTime = data.result;

    

    return (
        <>
            <Container className="ctn-reserve">
                <Row>
                    <h4>Thông tin chuyến đi</h4>
                </Row>
                <Row>
                    <ReserveForm
                    reserveTour={tourTime}
                    />

            
                </Row>
            </Container>
        </>
    )
}
export default DetailReserve