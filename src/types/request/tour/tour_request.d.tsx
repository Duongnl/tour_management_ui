interface ITourRequest {
    tour_name:string;
    tour_detail:string;
    category_id:number;
    tourTimes:ITourTimeRequest[];
    url:string;
}