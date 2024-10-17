'use client'
import { useState } from "react"
import { formatCurrency } from '@/utils/string_utils';
import ReserveCustomer from "./reserve_customer";
import "@/styles/reserve.css"
interface IProps {
    reserveTour: IReserveTourResponse
}

const ReserveForm = (props: IProps) => {

    const [reserveTour, setReserveTour] = useState<IReserveTourResponse>(props.reserveTour)
    // console.log(reserveTour)

    return (
        <>
            <div className='div-text' >
                <i className="fa-solid fa-location-dot" style={{ color: 'red' }}></i>  <span>{reserveTour.category_name}</span>
            </div>
            <div className='div-text'>
                <i className="fa-solid fa-globe" style={{ color: 'green' }}></i> <span>{reserveTour.tour_name}</span>
            </div>
            <div className='div-time'>
                <i className="fa-regular fa-calendar-days" style={{ color: 'green' }} ></i> <span> {`Đi: ${reserveTour.tourTime.departure_date}`}</span>
                
                <i className="fa-solid fa-plane-departure" style={{ color: 'green', marginLeft:'50px' }} ></i><span>{` ${reserveTour.tourTime.departureAirline.airline_name} ${reserveTour.tourTime.departureAirline.airline_detail} ${reserveTour.tourTime.departure_time}`} </span>
            </div>
            <div className='div-time'>
                <i className="fa-regular fa-calendar-days" style={{ color: 'green' }} ></i> <span>{`Về: ${reserveTour.tourTime.return_date}`} </span>
            
                <i className="fa-solid fa-plane-departure" style={{ color: 'green', marginLeft:'50px' }} ></i><span>{` ${reserveTour.tourTime.returnAirline.airline_name} ${reserveTour.tourTime.returnAirline.airline_detail} ${reserveTour.tourTime.return_time}`} </span>
            </div>
            <div className="div-time" >
                <i className="fa-brands fa-cc-visa" style={{ color: 'red' }} ></i>  <span style={{ color: "red" }} >{`Hạn visa: ${reserveTour.tourTime.visa_expire}`}</span>
            </div>
            <div>
            <span style={{ color: "red", fontSize: '20px', fontWeight: 'bold' }} >{`Giá tour : ${formatCurrency(reserveTour.tourTime.price_min)} / 1 người`}  </span>
            </div>
            <h4 style={{marginTop:'20px'}}>Thông tin hành khách</h4>
            <ReserveCustomer
            reserveTour = {reserveTour}
            />
         
          
        </>
    )
}

export default ReserveForm