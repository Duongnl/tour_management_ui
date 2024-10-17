"use server"
import "@/styles/history.css"
import { Container,Row } from "react-bootstrap"
import { getSessionId } from "@/utils/session_store"
import { Suspense } from "react";
import HistoryTable from "@/components/history/history_table";
import { fetchGetHistories } from "@/utils/serviceApiServer";


const HistoryPage = async() => {
    const histories = await fetchGetHistories()
    // console.log(histories);
    
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