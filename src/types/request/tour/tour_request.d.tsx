interface ITourRequest {
    tour_name:string;
    tour_detail:String;
    category_id:number;
    tourTimes:ITourTimeRequest[];
    url:string;
}