'use sever'
import "@/styles/booked.css"
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import ReserveForm from "@/components/reserve/reserve_form";
import BookedForm from "@/components/booked/booked_form";

const DetailBooked = async (props: any) => {

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


    const resReserveResponses = await fetch(
        `http://localhost:8080/api/reserve/booked/${params.id}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const dataReserveResponses = await resReserveResponses.json();
    const reserveResponses= dataReserveResponses.result;

    

    return (
        <>
            <Container className="ctn-booked">
                <Row>
                    <h4>Thông tin chuyến đi</h4>
                </Row>
                <Row>
                    <BookedForm
                    reserveResponses={reserveResponses}
                    reserveTour={tourTime}
                    slug = {params.id}
                    />
                </Row>
            </Container>
        </>
    )
}
export default DetailBooked