interface ITourDetailResponse {
    tour_id:number;
    tour_name:string;
    tour_detail:string;
    status:number;
    category_id:number;
    category_name:string;
    tourTimes:ITourTimeDetailResponse[];
    url:string;
}