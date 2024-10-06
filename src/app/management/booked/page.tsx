import { Container, Row } from "react-bootstrap"
import { Suspense } from "react";
import { getSessionId } from "@/utils/session_store"
import "@/styles/booked.css"
import BookedTable from "@/components/booked/booked_table";
const BookedPage = async () => {

    const res = await fetch(
        "http://localhost:8080/api/reserve/tour",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const data = await res.json();
    const reserveTours = data.result;

    const resCategogies = await fetch(
        "http://localhost:8080/api/category",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );

    const dataCategories = await resCategogies.json();
    const categories = dataCategories.result;


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
}

export default BookedPage