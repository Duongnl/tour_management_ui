import { Container, Row } from "react-bootstrap";
import TourTable from "@/components/tour/tour_table";
import "@/styles/tour.css";
import { fetchGetCategories, fetchGetTours } from "@/utils/serviceApiServer";

const ProfilePage = async () => {
  try {
    const tours = await fetchGetTours();
    const categories = await fetchGetCategories(1);

    return (
      <Container className="ctn-tour">
        <Row>
          <h4>Quản lý Tour</h4>
        </Row>
        <Row>
          <TourTable tours={tours} categories={categories} />
        </Row>
      </Container>
    );
  } catch (error) {
    // console.error(error);
    return <div>Error fetching data</div>;
  }
};

export default ProfilePage;
