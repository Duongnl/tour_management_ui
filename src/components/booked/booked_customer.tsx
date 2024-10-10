'use client'
import { useState, useEffect } from 'react';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import { Button } from 'react-bootstrap';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import InputGroup from 'react-bootstrap/InputGroup';
import '@/styles/table.css'
import Link from 'next/link';
import PaginationTable from '../pagination';
import { formatCurrency } from '@/utils/string_utils';
import cookie from 'js-cookie';
import { toast } from 'react-toastify';
import ReserveErrorCode from '@/exception/reserve_error_code';
import { ExportError } from "@/utils/export_error";
import { fetchChangeStatusReserve, fetchGetBookes } from '@/utils/serviceApiClient';
interface IProps {
    reserveResponses: IReserveResponse[],
    slug: string
}


const BookedCustomer = (props: IProps) => {
    const { slug } = props

    const [reserves, setReserves] = useState<IReserveResponse[]>(props.reserveResponses)

    const [reservesFilter, setReservesFilter] = useState<IReserveResponse[]>(props.reserveResponses);


    // trang hiện tại
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page')
    // kiem tra trang thai
    const status = searchParams.get('status')

    // tổng số trang
    const [numberPages, setNumberPages] = useState<number>(Math.ceil(reserves != undefined ? reserves.length / 6 : 0))

    // số phần tử hiển thị
    const [numberStart, setNumberStart] = useState<number>(0);
    const [numberEnd, setNumberEnd] = useState<number>(0);

    // tim kiem
    const [search, setSearch] = useState<string>('')

    const router = useRouter()
    const pathname = usePathname();

    useEffect(() => {
        let start = 1;
        let end = 8;

        for (let i = 1; i < Number(currentPage); i++) {
            start += 8;
            end += 8;
        }

        setNumberStart(start); // khi useEffect kết thúc thì mới lên lịch cập nhật biến vào number start
        setNumberEnd(end);// nên không nên cập nhật liên tục để dựa vào biến number để tính toán ngay trong useEffect
    }, [currentPage])

    const handleSearch = (e: string) => {
        setSearch(e);
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

        const filteredData = reserves.filter((item) => searchInObject(item, e));

        setReservesFilter(filteredData);
        setNumberPages(Math.ceil(filteredData.length / 6));
    }

    const handleSelectStatus = (e: string) => {
        router.push(`${pathname}?status=${e}`)
    }



    useEffect(() => {
        if (status == "paid") {
            console.log("paid >>> ", pathname)
            fetchPaidReserves()
        } else if (status == "unpaid") {
            fetchUnpaidReserves()
        } else if (status == "canceled") {
            fetchCanceledReserves()
        } else if (status == "all") {
            fetchReserves()
        }
    }, [status])

    const fetchPaidReserves = async () => {
        const reserves: IReserveResponse[] = await fetchGetBookes(1,slug)

        setReservesFilter(reserves)
        const numPages = Math.ceil(reserves != undefined ? reserves.length / 6 : 0);
        setNumberPages(numPages);
        setReserves(reserves)
    };


    const fetchUnpaidReserves = async () => {

        const reserves: IReserveResponse[] = await fetchGetBookes(2,slug)

        setReservesFilter(reserves)
        const numPages = Math.ceil(reserves != undefined ? reserves.length / 6 : 0);
        setNumberPages(numPages);
        setReserves(reserves)
    };

    const fetchCanceledReserves = async () => {
        const reserves: IReserveResponse[] = await fetchGetBookes(0,slug)

        setReservesFilter(reserves)
        const numPages = Math.ceil(reserves != undefined ? reserves.length / 6 : 0);
        setNumberPages(numPages);
        setReserves(reserves)
    };

    const fetchReserves = async () => {
      
        const reserves: IReserveResponse[] = await fetchGetBookes(-1,slug)
        setReservesFilter(reserves)
        const numPages = Math.ceil(reserves != undefined ? reserves.length / 6 : 0);
        setNumberPages(numPages);
        setReserves(reserves)
    };




    const handleStatusView = (status: number): string => {
        switch (status) {
            case 1:
                return 'green'
            case 0:
                return 'red'
            case 2:
                return 'yellow'
            default:
                return 'Unknow'
        }

    }

    const handleChangeStatus  = async (reserve_id:string, status:string) => {
        
        const initReserveStatusRequest:IReserveStatusRequest = {
            reserve_id:reserve_id,
            status:Number(status)
        }

        const data = await fetchChangeStatusReserve(initReserveStatusRequest)
        if (data.status == "SUCCESS") {
            toast.success("Thay đổi trạng thái thành công")
            fetchReserves()
            router.push(`${pathname}`)
            setSearch('')
        } else {
            let errors = ExportError(data, ReserveErrorCode);
            for (let i: number = 0; i < errors.length; i++) {
              toast.error(errors[i]);
            }
        }

     

    }

    return (
        <>
            <div className='div-add mb-4 d-flex flex-wrap justify-content-start'>
                    <InputGroup className="input-search width-primary m-1"
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

                    <Form.Select aria-label="Default select example" className='select-status width-primary m-1'
                        value={status || ''} // Đặt giá trị hiện tại
                        onChange={(e) => handleSelectStatus(e.target.value)}
                    >
                        <option hidden>Trạng thái</option>
                        <option value='all' >Tất cả</option>
                        <option value="paid">Đã thanh toán</option>
                        <option value="unpaid">Chưa thanh toán</option>
                        <option value="canceled">Đã hủy</option>
                    </Form.Select>
            </div>
            <div className="table-wrapper">
                <Table striped bordered hover id="myTable" className="table"  >
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên khách hàng</th>
                            <th>Tên nhân viên</th>
                            <th>Note</th>
                            <th>Giá</th>
                            <th>Thời gian</th>
                            <th>Hoa hồng</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservesFilter?.map((reserve, index) => {
                            if ((index + 1) >= numberStart && (index + 1) <= numberEnd) {
                                return (
                                    <tr key={reserve.reserve_id}>
                                        <td>{index + 1}</td>
                                        <td>{reserve.customer.customer_name}</td>
                                        <td>{reserve.employee.employee_name}</td>
                                        <td>{reserve.note}</td>
                                        <td>{formatCurrency(reserve.price)}</td>
                                        <td>{reserve.time}</td>
                                        <td>{formatCurrency(reserve.commission)}</td>
                                        <td>
                                            <Form.Select aria-label="Default select example" className='select-status'
                                                style={{backgroundColor:`${handleStatusView(reserve.status)}`}}

                                                value={reserve.status } // Đặt giá trị hiện tại
                                                onChange={(e) => handleChangeStatus( reserve.reserve_id ,e.target.value)}
                                            >
                                                <option value="1" style={{backgroundColor:'white'}} >Đã thanh toán</option>
                                                <option value="2"  style={{backgroundColor:'white'}} >Chưa thanh toán</option>
                                                <option value="0"   style={{backgroundColor:'white'}}>Đã hủy</option>
                                            </Form.Select>
                                        </td>
                                    </tr>
                                )
                            }
                        })}

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

export default BookedCustomer