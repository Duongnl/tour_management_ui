'use sever'
import "@/styles/booked.css"
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import ReserveForm from "@/components/reserve/reserve_form";
import BookedForm from "@/components/booked/booked_form";
import { fetchGetBooked, fetchGetReserve } from "@/utils/serviceApiServer";

const DetailBooked = async (props: any) => {

    const { params } = props;
    const tourTime = await fetchGetReserve(params.id)

    const reserveResponses= await fetchGetBooked(params.id)

    

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