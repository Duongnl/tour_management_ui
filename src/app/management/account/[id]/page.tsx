'use client'
// import { getSessionId } from "@/utils/session_store"
import { Suspense, useEffect, useState } from "react";
import "@/styles/account.css"
import { Container, Row } from "react-bootstrap"
import AccountUpdateForm from "@/components/account/account_update_form";
import cookie from 'js-cookie';
import Loading from "../loading";
import { fetchGetAccount, fetchGetRoles } from "@/utils/serviceApiClient";
const DetailAccount =  (props: any) => {
    const { params } = props;
    const [loading, setLoading] = useState(true);

    const initRoleResponse:IRoleResponse = {
        role_id: 0,
        role_name: '' ,
        status: 1,
        permissions: []
    }

    const initEmployeeResponse:IEmployeeResponse = {
        employee_id:0,
        employee_name:'',
        birthday:'',
        total_commission:0,
        total_sales:0,
        status:0,
    }

    const initGetAccountResponse :IGetAccountResponse = {
        account_id:'',
        account_name:'',
        email:'',
        phone_number:'',
        time:'',
        status:1,
        employee:initEmployeeResponse,
        role:initRoleResponse,
    };

    const [account, setAccount] = useState<IGetAccountResponse> (initGetAccountResponse);
    const [roles, setRoles] = useState<IRoleResponse[]> ([]);
    
   
    
 
    
    useEffect (()=>{
        const fetchGetAccountRes = async () => {
            const account:IGetAccountResponse = await fetchGetAccount(params.id)
             setAccount(account)
        }

        const fetchRoles =  async()=>{
            const roles:IRoleResponse[] = await fetchGetRoles()
             setRoles(roles)
        }
 
        const fetchData = async () => {
            await fetchGetAccountRes();
            await fetchRoles();
            setLoading(false);
          };
      
         fetchData();
    },[])
    
    if (loading) {
        return <Loading></Loading>
    }

    return (
        <>
            <Container className="ctn-account">
                <Row>
                    <h4>Chi tiết người dùng</h4>
                </Row>
                <Row>
                  
                           <AccountUpdateForm
                           account={account}
                           roles = {roles}
                           url = {params.id}
                           />
                   
                </Row>
            </Container>



        </>
    )

}

export default DetailAccount