"use client";
import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import CustomerUpdateForm from "@/components/customer/customer_update_form";
import Loading from "@/app/management/loading";
import "@/styles/customer.css";
import { defaultICustomerDetailResponse } from "@/utils/defaults";
import { fetchGetCustomer, fetchGetParents } from "@/utils/serviceApiClient";

const DetailCustomer = (props: any) => {
  const { params } = props;
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<ICustomerDetailResponse>(
    defaultICustomerDetailResponse
  );
  const [parents, setParents] = useState<ICustomerResponse[]>([
    defaultICustomerDetailResponse,
  ]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        setCustomer(await fetchGetCustomer(params.id));
        setParents(await fetchGetParents());
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setLoading(false);
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
          {loading ? (<Loading />) : 
          (
            <CustomerUpdateForm customer={customer} customers={parents} />
          )}
        </Row>
      </Container>
    </>
  );
};

export default DetailCustomer;
