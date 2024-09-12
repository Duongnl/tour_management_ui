import { Container, Row } from "react-bootstrap";
import { getSessionId } from "@/utils/session_store";
import { Suspense } from "react";
import TourTable from "@/components/tour/tour_table";

const TourPage = async () => {
  const resTour = await fetch("http://localhost:8080/api/tour", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
    },
  });

  const dataTour = await resTour.json();
  const tours = dataTour.result;
  const resCategory = await fetch("http://localhost:8080/api/category", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSessionId()}`, // Set Authorization header
    },
  });

  const dataCategory = await resCategory.json();
  const categories = dataCategory.result;
  return (
    <Container className="ctn-tour">
      <Row>
        <h4>Quản lý Tour</h4>
      </Row>
      <Row>
        <Suspense>
          <TourTable tours={tours} categories={categories}/>
        </Suspense>
      </Row>
    </Container>
  );
};

export default TourPage;
