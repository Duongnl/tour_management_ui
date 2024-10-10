'use server'
import "@/styles/reserve.css"
import { Container, Row } from "react-bootstrap"
import { Suspense } from "react";
import { getSessionId } from "@/utils/session_store"
import ReserveTable from "@/components/reserve/reserve_table";
import { fetchGetReserves } from "@/utils/serviceApiServer";
import { fetchGetCategories } from "@/utils/serviceApiServer";
const ReservePage = async () => {

    try {
        const reserveTours = await fetchGetReserves();
        const categories = await fetchGetCategories()

        return (
            <Container className="ctn-reserve">
                <Row>
                    <h4>Đặt chổ</h4>
                </Row>
                <Row>
                    <Suspense>
                      <ReserveTable
                        reserveTours = {reserveTours}
                        categories = {categories}
                      />
                    </Suspense>
                </Row>
            </Container>
        )
    } catch (error) {
         console.error(error);
        // Handle error, e.g., show an error message
        return <div>Error fetching data</div>;
    }


    
}

export default ReservePage