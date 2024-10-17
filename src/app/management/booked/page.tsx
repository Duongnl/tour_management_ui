import { Container, Row } from "react-bootstrap"
import { Suspense } from "react";
import { getSessionId } from "@/utils/session_store"
import "@/styles/booked.css"
import BookedTable from "@/components/booked/booked_table";
import { fetchGetReserves } from "@/utils/serviceApiServer";
import { fetchGetCategories } from "@/utils/serviceApiServer";
const BookedPage = async () => {

    try {
        const reserveTours = await fetchGetReserves();
        const categories = await fetchGetCategories()
        return (
            <>
                <Container className="ctn-booked">
                    <Row>
                        <h4>Thông tin đặt chổ</h4>
                    </Row>
                    <Row>
                        <Suspense>
                            <BookedTable
                                reserveTours={reserveTours}
                                categories={categories}
                            />
                        </Suspense>
                    </Row>
                </Container>
            </>
        )
    } catch (error) {
        // console.error(error);
        // Handle error, e.g., show an error message
        return <div>Error fetching data</div>;
    }


    
}

export default BookedPage