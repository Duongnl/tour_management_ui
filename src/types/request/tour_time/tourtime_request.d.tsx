 interface ITourTimeRequest{
    time_name:string;
    departure_time:string;
    return_time:string;
    departure_date:string;
    return_date:string;
    visa_expire:string;
    quantity:number;
    quantity_reserve:number;
    quantity_sell:number;
    quantity_left:number;
    price_min:number;
    commission:number;
    departure_airline_id:number|null;
    return_airline_id:number|null;
}