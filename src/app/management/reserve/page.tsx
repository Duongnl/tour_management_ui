'use server'
import "@/styles/reserve.css"
import { Container, Row } from "react-bootstrap"
import { Suspense } from "react";
import { getSessionId } from "@/utils/session_store"
import ReserveTable from "@/components/reserve/reserve_table";
const ReservePage = async () => {

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
}

export default ReservePage