 interface ITourTimeDetailResponse {
    tour_time_id:number;
    time_name:string;
    departure_time:string;
    departure_date:string;
    return_time:string;
    return_date:string;
    visa_expire:string;
    quantity:number;
    quantity_reserve:number;
    quantity_sell:number;
    quantity_left:number;
    price_min:number;
    commission:number;
    departureAirline:IAirlineResponse|null;
    returnAirline:IAirlineResponse|null;
    status:number;
}