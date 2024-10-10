'use sever'
import "@/styles/reserve.css"
import { Container, Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import ReserveForm from "@/components/reserve/reserve_form";
import { fetchGetReserve } from "@/utils/serviceApiServer";

const DetailReserve = async (props: any) => {

    const { params } = props;
 
    const tourTime = await fetchGetReserve(params.id)
    

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