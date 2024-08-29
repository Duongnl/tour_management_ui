'use client'
import { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap"
import CustomerUpdateForm from "@/components/customer/customer_update_form";
import cookie from 'js-cookie';
import Loading from "@/app/management/loading";
import "@/styles/customer.css";
const DetailCustomer =  (props: any) => {
    const { params } = props;
    const [loading, setLoading] = useState(true);

    const initCustomerRelationshipResponse:ICustomerResponse = {
        customer_id:0,
        customer_name:'',
        sex:0,
        relationship_name:'',
        phone_number:'',
        email:'',
        address:'',
        birthday:'',
        visa_expire:'',
        time:'',
        status:0
    }

    const initArrayCustomerGroupResponse:ICustomerResponse[] = [{
        customer_id:0,
        customer_name:'',
        sex:0,
        relationship_name:'',
        phone_number:'',
        email:'',
        address:'',
        birthday:'',
        visa_expire:'',
        time:'',
        status:0
    }]

    const initCustomerDetailResponse :ICustomerDetailResponse = {
        customer_id:0,
        customer_name:'',
        email:'',
        phone_number:'',
        time:'',
        status:0,
        sex:0,
        relationship_name:'',
        address:'',
        birthday:'',
        visa_expire:'',
        customerParent:initCustomerRelationshipResponse,
        customerGroup:initArrayCustomerGroupResponse,
    };

    const [customer, setCustomer] = useState<ICustomerDetailResponse> (initCustomerDetailResponse);
    const [CustomersResponse, setCustomersResponse] = useState<ICustomerResponse[]> ([]);

 
    
    useEffect (()=>{
        const fetchCustomerDetail = async () => {
            const resGetCustomer = await fetch(
                `http://localhost:8080/api/customer/${params.id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                    },
                }
            );
        
            const customerData = await resGetCustomer.json();
            const customer:ICustomerDetailResponse = customerData.result;
            setCustomer(customer)
            console.log(customer)
        }

    const fetchCustomersParent = async () => {
      const res = await fetch("http://localhost:8080/api/customer/parent", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${cookie.get('session-id')}`,
        },
      });
      const data = await res.json();
      setCustomersResponse(data.result);
    };
        const fetchData = async () => {
            await fetchCustomerDetail();
            await fetchCustomersParent();
            setLoading(false);
          };
      
          fetchData();
    },[])
    
    if (loading) {
        return <Loading></Loading>
    }


    return (
        <>
            <Container className="ctn-customer">
                <Row>
                    <h4>Chi tiết khách hàng</h4>
                </Row>
                <Row>
                    <CustomerUpdateForm
                    customer={customer}
                    customers={CustomersResponse}
                    />
                   
                </Row>
            </Container>



        </>
    )

}

export default DetailCustomer