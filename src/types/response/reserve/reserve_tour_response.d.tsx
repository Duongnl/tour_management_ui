interface IReserveTourResponse {
     tour_id:number;
     tour_name:string;
     url:string;
     status:number;

     category_name:string;

     tourTime:IReserveTourTimeResponse;
}