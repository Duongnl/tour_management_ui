'use client'
// import { getSessionId } from "@/utils/session_store"
import { Suspense, useEffect, useState } from "react";
import "@/styles/account.css"
import { Container, Row } from "react-bootstrap"
import AccountUpdateForm from "@/components/account/account_update_form";
import cookie from 'js-cookie';
import Loading from "../loading";
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
        const fetchGetAccount = async () => {
            const resGetAccount = await fetch(
                `http://localhost:8080/api/account/${params.id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                    },
                }
            );
        
            const accountData = await resGetAccount.json();
            const account:IGetAccountResponse = accountData.result;
             setAccount(account)
        }

        const fetchRoles =  async()=>{
            const resRoles = await fetch(
                `http://localhost:8080/api/role`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                    },
                }
            );
        
            const RoleData = await resRoles.json();
            const roles:IRoleResponse[] = RoleData.result;
             setRoles(roles)
        }
 
        const fetchData = async () => {
            await fetchGetAccount();
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