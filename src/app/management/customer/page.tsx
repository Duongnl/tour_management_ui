import { Container, Row } from "react-bootstrap";
import { Suspense } from "react";
import CustomerTable from "@/components/customer/customer_table";
import { fetchGetCustomers } from "@/utils/serviceApiServer";
import "@/styles/customer.css";

const CustomerPage = async () => {
  try {
    const customers = await fetchGetCustomers();
    return (
      <Container className="ctn-customer">
        <Row>
          <h4>Quản lý khách hàng</h4>
        </Row>
        <Row>
          <Suspense>
            <CustomerTable customers={customers} />
          </Suspense>
        </Row>
      </Container>
    );
  } catch (error) {
    // console.error(error);
    // Handle error, e.g., show an error message
    return <div>Error fetching data</div>;
  }
};
export default CustomerPage;
