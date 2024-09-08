import { Container, Row } from "react-bootstrap";
import { getSessionId } from "@/utils/session_store";
import { Suspense } from "react";
import TourTable from "@/components/tour/tour_table";

const TourPage = async () => {
  const res = await fetch("http://localhost:8080/api/tour", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
    },
  });

  const data = await res.json();
  const tours = data.result;
  return (
    <Container className="ctn-tour">
      <Row>
        <h4>Quản lý Tour</h4>
      </Row>
      <Row>
        <Suspense>
          <TourTable tours={tours} />
        </Suspense>
      </Row>
    </Container>
  );
};

export default TourPage;
