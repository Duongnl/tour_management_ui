"use server"
import "@/styles/history.css"
import { Container,Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import { Suspense } from "react";
import HistoryTable from "@/components/history/history_table";


const HistoryPage = async() => {
    const res = await fetch(
        "http://localhost:8080/api/history",
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
            },
        }
    );
    const data = await res.json();
    const histories = data.result;
    console.log(histories);
    
    return (
        <Container  className="ctn-history">
           <Row>
                <h4>History</h4>
            </Row>
            <Row>
                    <Suspense>
                        <HistoryTable histories={histories} />
                    </Suspense>
            </Row>
        </Container>
    )
}

export default HistoryPage