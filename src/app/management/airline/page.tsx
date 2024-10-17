
import { Container, Row } from "react-bootstrap"
import { Suspense } from "react";
import { getSessionId } from "@/utils/session_store"
import "@/styles/airline.css"
import { fetchGetAirlines } from "@/utils/serviceApiServer";
import AirlineTable from "@/components/airline/airline_table";
const AirlinePage = async () => {

    
    try {
        const airlines = await fetchGetAirlines();
        console.log(airlines)
        return (
            <>
             <Container className="ctn-airline">
                    <Row>
                        <h4>Quản lý chuyến bay</h4>
                    </Row>
                    <Row>
                        <Suspense>
                            <AirlineTable
                             airlines = {airlines}
                            />
                        </Suspense>
                    </Row>
                </Container>
            
            </>
        )
    } catch (error) {
        console.error(error);
        // Handle error, e.g., show an error message
        return <div>Error fetching data</div>;
    }



    
}

export default AirlinePage