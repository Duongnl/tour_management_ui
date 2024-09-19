interface IReserveTourTimeResponse {
    
     tour_time_id:number,
     time_name:string,
     quantity_sell:number,
     quantity_reserve:number,
     quantity_left:number,
     visa_expire:string,

     departure_time:string,
     return_time:string,
     
     departure_date:string,
     return_date:string,
     price_min:number

     departureAirline:IAirlineResponse,
     returnAirline:IAirlineResponse,

}