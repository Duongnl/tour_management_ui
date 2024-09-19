interface ICustomerDetailResponse {
    customer_id:number;
    customer_name:string;
    sex:number;
    relationship_name:string;
    phone_number:string;
    email:string;
    address:string;
    birthday:string;
    visa_expire:string;
    time:string;
    status:number;
    customerParent:ICustomerResponse;
    customerGroup:ICustomerResponse[];
}