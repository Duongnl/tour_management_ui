"use client";
import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import CustomerUpdateForm from "@/components/customer/customer_update_form";
import cookie from "js-cookie";
import Loading from "@/app/management/loading";
import "@/styles/customer.css";
import { defaultICustomerDetailResponse } from "@/utils/defaults";
const DetailCustomer = (props: any) => {
  const { params } = props;
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<ICustomerDetailResponse>(
    defaultICustomerDetailResponse
  );
  const [Customers, setCustomers] = useState<ICustomerResponse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [customerRes, customersParentRes] = await Promise.all([
          fetch(`http://localhost:8080/api/customer/${params.id}`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookie.get("session-id")}`,
            },
          }),
          fetch("http://localhost:8080/api/customer/parent", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${cookie.get("session-id")}`,
            },
          }),
        ]);

        const customerData = await customerRes.json();
        const customersParentData = await customersParentRes.json();

        setCustomer(customerData.result);
        setCustomers(customersParentData.result);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false); // Set loading sau khi fetch xong
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <>
      <Container className="ctn-customer">
        <Row>
          <h4>Chi tiết khách hàng</h4>
        </Row>
        <Row>
          {loading ? (
            <Loading />
          ) : (
            <CustomerUpdateForm customer={customer} customers={Customers} />
          )}
        </Row>
      </Container>
    </>
  );
};

export default DetailCustomer;
