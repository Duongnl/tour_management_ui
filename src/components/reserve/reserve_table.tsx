'use client'
import Table from 'react-bootstrap/Table';
import { formatCurrency } from '@/utils/string_utils';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import PaginationTable from '../pagination';
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import cookie from 'js-cookie';
import { CreateSlug } from '@/utils/create_slug';
import Link from 'next/link';
import { Button } from 'react-bootstrap';
import "@/styles/reserve.css"
interface IProps {
    reserveTours: IReserveTourResponse[]
    categories: ICategoryResponse[]
}


const ReserveTable = (props: IProps) => {
    const { categories } = props

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
    const startDayParams = searchParams.get('startDay')
    const endDayParams = searchParams.get('endDay')
    const categoryParams = searchParams.get('category')
    const dayFilterParams = searchParams.get('dayFilter')



    // tim kiem
    const [search, setSearch] = useState<string>('')


    const [startDay, setStartDay] = useState<string>(startDayParams == null ? '' : startDayParams)
    const [endDay, setEndDay] = useState<string>(endDayParams == null ? '' : endDayParams)
    const [dayFilter, setDayFilter] = useState<boolean>(dayFilterParams == 'false' || dayFilterParams == 'true' ?
        (dayFilterParams == 'false' ? false : true)
        : false)
    const [categorySlug, setCategorySlug] = useState<string>(categoryParams == null ? '' : categoryParams)

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


    const handleSearch = (e: string) => {
        setSearch(e)
        const searchInObject = (obj: any, searchText: string): boolean => {
            return Object.values(obj).some((value) => {
                if (value !== null && value !== undefined) {
                    if (typeof value === 'object') {
                        return searchInObject(value, searchText); // Gọi đệ quy cho object lồng nhau
                    }
                    return value.toString().toLowerCase().includes(searchText.toLowerCase());
                }
                return false;
            });
        };

        const filteredData = reserveTours.filter((item) => searchInObject(item, e));


        setReserveToursFilter(filteredData)
        setNumberPages(Math.ceil(filteredData.length / 3))
    }

    const fetchFilterReserveTours = async (initDataFilter: IReserveTourFilterRequest) => {
        const res = await fetch(
            "http://localhost:8080/api/reserve/filter-reserve-tour",
            {
                method: "POST",
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                },
                body: JSON.stringify(initDataFilter)
            }
        );
        const data = await res.json();
        const reserveToursRes: IReserveTourResponse[] = data.result
        setReserveToursFilter(reserveToursRes)
        const numPages = Math.ceil(reserveToursRes != undefined ? reserveToursRes.length / 3 : 0);
        setNumberPages(numPages);
        setReserveTours(reserveToursRes)
    };

    const handleStartDay = (e: string) => {
        setStartDay(e)

        if (endDay != '' && dayFilter) {
            const initDataFilter: IReserveTourFilterRequest = {
                start_date: e,
                end_date: endDay,
                date_filter: dayFilter,
                category_slug: categorySlug,
            }
            fetchFilterReserveTours(initDataFilter)
            console.log("Data fiter start day >>> ", initDataFilter)
        }



    }


    const handleEndDay = (e: string) => {
        setEndDay(e)

        if (startDay != '' && dayFilter) {
            const initDataFilter: IReserveTourFilterRequest = {
                start_date: startDay,
                end_date: e,
                date_filter: dayFilter,
                category_slug: categorySlug,
            }
            fetchFilterReserveTours(initDataFilter)
            console.log("Data fiter end day >>> ", initDataFilter)
        }
    }

    const handleSelectCategory = async (e: string) => {
        setCategorySlug(e)

        const initDataFilter: IReserveTourFilterRequest = {
            start_date: dayFilter ? startDay : '',
            end_date: dayFilter ? endDay : '',
            date_filter: dayFilter,
            category_slug: e,
        }

        console.log("Data fiter category >>> ", initDataFilter)
        fetchFilterReserveTours(initDataFilter)

    }

    useEffect(() => {

        router.push(`${pathname}?category=${categorySlug}&&dayFilter=${dayFilter}&&startDay=${startDay}&&endDay=${endDay}`)


    }, [dayFilter, startDay, endDay, categorySlug])

    const handleSetDayFilter = (e: boolean) => {
        setDayFilter(e);

        if (endDay != '' && startDay != '') {

            if (e) {
                const initDataFilter: IReserveTourFilterRequest = {
                    start_date: startDay,
                    end_date: endDay,
                    date_filter: e,
                    category_slug: categorySlug,
                }
                fetchFilterReserveTours(initDataFilter)
                console.log("Data fiter date >>> ", initDataFilter)
            } else {
                const initDataFilter: IReserveTourFilterRequest = {
                    start_date: '',
                    end_date: '',
                    date_filter: false,
                    category_slug: categorySlug,
                }
                fetchFilterReserveTours(initDataFilter)
                console.log("Data fiter date >>> ", initDataFilter)
            }
        }
    }


    return (
        <>
            <div className='div-filter' >
                <div style={{ display: "flex", paddingLeft: '0px', marginTop: '20px' }} >
                    <InputGroup className="mb-3 select-date">
                        <InputGroup.Checkbox aria-label="Checkbox for following text input"
                            checked={dayFilter}
                            onChange={(e) => { handleSetDayFilter(e.target.checked) }}
                        />
                        <Form.Control aria-label="Text input with checkbox"
                            type='date'
                            value={startDay}
                            onChange={(e) => { handleStartDay(e.target.value) }}
                        />
                        <Form.Control aria-label="Text input with checkbox"
                            type='date'
                            value={endDay}
                            onChange={(e) => { handleEndDay(e.target.value) }}
                        />
                    </InputGroup>

                    <Form.Select aria-label="Default select example" className='select-category'
                        // value={status || ''} // Đặt giá trị hiện tại
                        onChange={(e) => handleSelectCategory(e.target.value)}
                    >
                        <option hidden>Danh mục</option>
                        <option value='' >Tất cả danh mục</option>
                        {categories?.map((category, index) => (
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
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                    />
                </InputGroup>
            </div>

            <div className="table-wrapper">
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
                                                    {/* <Button
                                                        variant="success"
                                                    >Đặt chổ</Button> */}

                                                    {reserveTour.tourTime.quantity_left > 0 ? (<>
                                                        <Button variant='outline-secondary' className='btn-reserve' >
                                                        <Link href={'/management/reserve/' + CreateSlug(`${reserveTour.tourTime.time_name} ${reserveTour.tourTime.tour_time_id}`)} className='link-reserve' >
                                                            Đặt chổ
                                                        </Link>
                                                    </Button>
                                                    </>) : (<> <span  style={{ color: "red", fontSize: '20px', fontWeight: 'bold' }}> Hết chổ </span> </>) }
                                                
                                                </td>
                                            </tr>
                                        </>
                                    )
                                }

                            })
                        }
                    </tbody>
                </Table>
            </div>
            <PaginationTable
                numberPages={numberPages}
                currentPage={Number(currentPage)}
            />
        </>
    )
}

export default ReserveTable