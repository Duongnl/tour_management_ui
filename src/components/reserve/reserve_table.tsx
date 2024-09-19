'use client'
import Table from 'react-bootstrap/Table';
import '@/styles/reserve.css'
import { formatCurrency } from '@/utils/string_utils';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import PaginationTable from '../pagination';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
interface IProps {
    reserveTours: IReserveTourResponse[]
    categories : ICategoryResponse[]
}


const ReserveTable = (props: IProps) => {
    const{categories}= props

    const [reserveTours, setReserveTours] = useState<IReserveTourResponse[]>(props.reserveTours)

    const [reserveToursFilter, setReserveToursFilter] = useState<IReserveTourResponse[]>(props.reserveTours);

    // tổng số trang
    const [numberPages, setNumberPages] = useState<number>(Math.ceil(reserveTours != undefined ? reserveTours.length / 3 : 0))

    // số phần tử hiển thị
    const [numberStart, setNumberStart] = useState<number>(0);
    const [numberEnd, setNumberEnd] = useState<number>(0);

    // trang hiện tại
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page')
    const startDayParams =  searchParams.get('startDay')
    const endDayParams =  searchParams.get('endDay')
    const categoryParams = searchParams.get('category')
    const dayFilterParams = searchParams.get('dayFilter')
    
    

    const[startDay, setStartDay] = useState<string> (startDayParams==null?'':startDayParams)
    const[endDay, setEndDay] = useState <string>(endDayParams==null?'':endDayParams)
    const[dayFilter, setDayFilter] = useState<boolean> (dayFilterParams=='false' || dayFilterParams == 'true'?
        (dayFilterParams=='false'?false:true)
    :false )
    const[categorySlug,setCategorySlug] = useState<string> (categoryParams==null?'':categoryParams)

    const router = useRouter()
    const pathname = usePathname();


    useEffect(() => {
        let start = 1;
        let end = 3;

        for (let i = 1; i < Number(currentPage); i++) {
            start += 3;
            end += 3;
        }

        setNumberStart(start); // khi useEffect kết thúc thì mới lên lịch cập nhật biến vào number start
        setNumberEnd(end);// nên không nên cập nhật liên tục để dựa vào biến number để tính toán ngay trong useEffect
    }, [currentPage])

    
    const handleStartDay = (e:string) => {
        setStartDay(e)

    }

    const handleEndDay = (e:string) => {
        setEndDay(e)

    }

    const handleSelectCategory = (e:string) => {
        setCategorySlug(e)
    }

    useEffect(()=>{

        router.push(`${pathname}?category=${categorySlug}&&dayFilter=${dayFilter}&&startDay=${startDay}&&endDay=${endDay}`)
        
        
    },[dayFilter, startDay,endDay,categorySlug])

    const handleSetDayFilter = (e:boolean) => {
        setDayFilter(e);
    }

    return (
        <>
            <div className='div-filter' >
                <div style={{ display: "flex", paddingLeft: '0px', marginTop: '20px' }} >
                    <InputGroup className="mb-3 select-date">
                        <InputGroup.Checkbox aria-label="Checkbox for following text input"
                        checked={dayFilter}
                        onChange={(e) => {handleSetDayFilter(e.target.checked)}}
                        />
                        <Form.Control aria-label="Text input with checkbox"
                            type='date'
                            value={startDay}
                            onChange={(e) => {handleStartDay(e.target.value)}}
                        />
                        <Form.Control aria-label="Text input with checkbox"
                            type='date'
                            value={endDay}
                            onChange={(e) => {handleEndDay(e.target.value)}}
                        />
                    </InputGroup>

                    <Form.Select aria-label="Default select example" className='select-category'
                    // value={status || ''} // Đặt giá trị hiện tại
                    onChange={(e) => handleSelectCategory(e.target.value)}
                    >
                        <option hidden>Danh mục</option>
                        <option value='all-category' >Tất cả danh mục</option>
                        {categories?.map((category,index)=>(
                            <>  
                                   <option value={`${category.url}-${category.category_id}`} >{category.category_name}</option>
                            </>
                        ))}

                     
                    </Form.Select>
                </div>

                <InputGroup className="input-search-reserve-tour"
                >
                    <InputGroup.Text id="basic-addon1"

                    ><i className="fa-solid fa-magnifying-glass"></i></InputGroup.Text>
                    <Form.Control
                        placeholder="Tìm kiếm"
                        aria-describedby="basic-addon1"
                    // value={search}
                    // onChange={(e) => handleSearch(e.target.value)}
                    />
                </InputGroup>
            </div>


            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Tour</th>
                        <th>Số chổ</th>
                        <th>Thời gian</th>
                        <th>Hãng bay</th>
                        <th>Giá</th>
                        <th>Đặt chổ</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        reserveToursFilter?.map((reserveTour, index) => {
                            if ((index + 1) >= numberStart && (index + 1) <= numberEnd) {
                                return (
                                    <>
                                        <tr key={index} >
                                            <td>
                                                <div className='div-text' >
                                                    <i className="fa-solid fa-location-dot" style={{ color: 'red' }}></i>  <span className='category-name' >{reserveTour.category_name}</span> <br />
                                                </div>
                                                <i className="fa-solid fa-globe" style={{ color: 'green' }}></i> <span className='tour-name' >{reserveTour.tour_name}</span>
                                            </td>
                                            <td>
                                                <div className='div-text' >
                                                    <i className="fa-solid fa-user-plus icon-reserve" style={{ color: 'blue' }}></i>  <span style={{ color: "#337ab7" }} >  {`Đã bán: ${reserveTour.tourTime.quantity_sell}`} </span><br />
                                                </div>
                                                <div className='div-text' >
                                                    <i className="fa-solid fa-user-plus icon-reserve" style={{ color: 'red' }}></i>   <span style={{ color: "#337ab7" }} > {`Giữ chổ: ${reserveTour.tourTime.quantity_reserve}`} </span><br />
                                                </div>
                                                <div className='div-text' >
                                                    <i className="fa-solid fa-user-plus icon-reserve" style={{ color: 'green' }}></i>   <span style={{ color: "green" }} >{`Còn lại: ${reserveTour.tourTime.quantity_left}`} </span> <br />
                                                </div>
                                                <i className="fa-brands fa-cc-visa" style={{ color: 'red' }} ></i>  <span style={{ color: "red" }} >{`Hạn visa: ${reserveTour.tourTime.visa_expire}`}</span>
                                            </td>
                                            <td>
                                                <div className='div-text'>
                                                    <i className="fa-regular fa-calendar-days" style={{ color: 'green' }} ></i> <span className='text-schedule'> {`Đi: ${reserveTour.tourTime.departure_date}`}</span>  <br />
                                                </div>
                                                <i className="fa-regular fa-calendar-days" style={{ color: 'green' }} ></i> <span className='text-schedule'>  {`Về: ${reserveTour.tourTime.return_date}`} </span>
                                            </td>
                                            <td>
                                                <div className='div-text'>
                                                    <i className="fa-solid fa-plane-departure" style={{ color: 'green' }} ></i>  <span className='text-schedule'>  {`Đi:  ${reserveTour.tourTime.departureAirline.airline_name} ${reserveTour.tourTime.departureAirline.airline_detail} ${reserveTour.tourTime.departure_time}`} </span> <br />
                                                </div>
                                                <i className="fa-solid fa-plane-departure" style={{ color: 'green' }} ></i> <span className='text-schedule'>  {`Về:  ${reserveTour.tourTime.returnAirline.airline_name} ${reserveTour.tourTime.returnAirline.airline_detail} ${reserveTour.tourTime.return_time}`} </span>
                                            </td>
                                            <td>
                                                <span style={{ color: "red", fontSize: '20px', fontWeight: 'bold' }} >{`${formatCurrency(reserveTour.tourTime.price_min)}`}  </span>
                                            </td>
                                            <td>

                                            </td>
                                        </tr>
                                    </>
                                )
                            }

                        })
                    }
                </tbody>
            </Table>
            <PaginationTable
                numberPages={numberPages}
                currentPage={Number(currentPage)}
            />
        </>
    )
}

export default ReserveTable