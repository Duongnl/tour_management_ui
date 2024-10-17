'use client'

import { useState, useEffect } from "react";
import { Button, Table } from 'react-bootstrap';
import Link from 'next/link';
import { CreateSlug } from '@/utils/create_slug';
import '@/styles/table.css'
import PaginationTable from '../pagination';
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import InputGroup from 'react-bootstrap/InputGroup';
import Form from 'react-bootstrap/Form';
import { fetchGetAirlines } from "@/utils/serviceApiClient";
import AirlineCreateModal from "./airline_create_modal";
import ChangeStatusModal from "../change_status_modal";
import AirlineErrorCode from "@/exception/airline_error_code";
import AirlineUpdateModal from "./airline_update_modal";

interface IProps {
    airlines: IAirlineResponse[]
}
const AirlineTable = (props: IProps) => {

    const [airlines, setAirlines] = useState<IAirlineResponse[]>(props.airlines)

    const [airlinesFilter, setAirlinesFilter] = useState<IAirlineResponse[]>(props.airlines);

    const [showAirlineCreateModal, setShowAirlineCreateModal] = useState<boolean>(false)
    const [showAirlineUpdateModal, setShowAirlineUpdateModal] = useState<boolean>(false)

    // trang hiện tại
    const searchParams = useSearchParams();
    const currentPage = searchParams.get('page')
    // kiem tra trang thai
    const status = searchParams.get('status')
    const airline_slug = searchParams.get('airline')
    // tổng số trang
    const [numberPages, setNumberPages] = useState<number>(Math.ceil(airlines != undefined ? airlines.length / 8 : 0))

    // số phần tử hiển thị
    const [numberStart, setNumberStart] = useState<number>(0);
    const [numberEnd, setNumberEnd] = useState<number>(0);

    // tim kiem
    const [search, setSearch] = useState<string>('')

    const router = useRouter()
    const pathname = usePathname();

    const [airline_id, setAirline_id] = useState<number>(0)

    const [showChangeStatusModal, setShowChangeStatusModal] = useState<boolean>(false)

    const [apiChangeStatus, setApiChangeStatus] = useState<string>('')

    const [statusObject, setStatusObject] = useState<number>(0);

    const [detail, setDetail] = useState<string>('')

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

        const filteredData = airlines.filter((item) => searchInObject(item, e));
        setAirlinesFilter(filteredData)
        setNumberPages(Math.ceil(filteredData.length / 8))
    }

    const handleChangeStatus = (airline: IAirlineResponse) => {
        setAirline_id(airline.airline_id)
        setStatusObject(airline.status)
        setShowChangeStatusModal(true)
        setApiChangeStatus(`${process.env.NEXT_PUBLIC_URL_API}/airline/change-status/${airline.airline_id}`)
        if (airline.status == 1) {
            setDetail(`Bạn có muốn tắt ${airline.airline_name} ?`)
        } else {
            setDetail(`Bạn có muốn mở ${airline.airline_name} ?`)
        }
    }

    const handleChangeStatusState = () => {
        setAirlines(
            airlines.map(a => a.airline_id === airline_id ? { ...a, status: a.status === 1 ? 0 : 1 } : a)
        )
        setAirlinesFilter(
            airlinesFilter.map(a => a.airline_id === airline_id ? { ...a, status: a.status === 1 ? 0 : 1 } : a)
        )
    }

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

    const handleSelectStatus = (e: string) => {
        router.push(`${pathname}?status=${e}`)
    }


    useEffect(() => {
        if (status == "active") {
            fetchActiveAirlines()
        } else if (status == "locked") {
            fetchLockedAirlines()
        } else if (status == "all") {
            fetchAirlines()
        }
    }, [status])

    const fetchAirlines = async () => {
        const airlines: IAirlineResponse[] = await fetchGetAirlines()
        setAirlinesFilter(airlines)
        const numPages = Math.ceil(airlines != undefined ? airlines.length / 8 : 0);
        setNumberPages(numPages);
        setAirlines(airlines)
    };

    const fetchActiveAirlines = async () => {
        const airlines: IAirlineResponse[] = await fetchGetAirlines(1)
        setAirlinesFilter(airlines)
        const numPages = Math.ceil(airlines != undefined ? airlines.length / 8 : 0);
        setNumberPages(numPages);
        setAirlines(airlines)
    };

    const fetchLockedAirlines = async () => {
        const airlines: IAirlineResponse[] = await fetchGetAirlines(0)
        setAirlinesFilter(airlines)
        const numPages = Math.ceil(airlines != undefined ? airlines.length / 8 : 0);
        setNumberPages(numPages);
        setAirlines(airlines)
    };


    const handleCreate = () => {
        setShowAirlineCreateModal(true)
    }

    useEffect(() => {

        if (airline_slug != null && airline_slug != '') {
            setShowAirlineUpdateModal(true)
        } else {
            setShowAirlineUpdateModal(false)
        }
    }, [airline_slug])


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
                    <option value="active">Đang hoạt động</option>
                    <option value="locked">Đã khóa</option>
                </Form.Select>


                <Button className='btn-add width-primary mr-1 my-1 ms-auto'
                    onClick={() => handleCreate()}
                >
                    <i className="fa-solid fa-plus" style={{ paddingRight: '10px' }}></i>
                    Thêm chuyến bay</Button>
            </div>
            <div className="table-wrapper">
                <Table striped bordered hover id="myTable" className="table"  >
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Tên chuyến bay</th>
                            <th>Hoạt động</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {airlinesFilter?.map((airline, index) => {
                            if ((index + 1) >= numberStart && (index + 1) <= numberEnd) {
                                return (
                                    <tr key={airline.airline_id}>
                                        <td>{index + 1}</td>
                                        <td>{airline.airline_name}</td>
                                        <td>
                                            <Form.Check className='check-active'
                                                checked={airline.status == 1}
                                                onChange={() => handleChangeStatus(airline)}
                                                type="switch"
                                                id="custom-switch"

                                            />
                                        </td>
                                        <td>
                                        <Button variant='outline-secondary' className='btn-update' >
                                                <Link href={`${pathname}?airline=${CreateSlug(airline.airline_name)}-${airline.airline_id}`} className='' >
                                                    <i className="fa-solid fa-pen-to-square" style={{ color: "black" }}  ></i>
                                                </Link>
                                            </Button>
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
            <AirlineCreateModal
                showAirlineCreateModal={showAirlineCreateModal}
                setShowAirlineCreateModal={setShowAirlineCreateModal}
                fetchAirlines={fetchAirlines}
                setSearch={setSearch}
            />

            <AirlineUpdateModal
                showAirlineUpdateModal={showAirlineUpdateModal}
                setShowAirlineUpdateModal={setShowAirlineUpdateModal}
                fetchAirlines={fetchAirlines}
            />

            <ChangeStatusModal
                showChangeStatusModal={showChangeStatusModal}
                setShowChangeStatusModal={setShowChangeStatusModal}
                handleChangeStatusState={handleChangeStatusState}
                statusObject={statusObject}
                detail={detail}
                api={apiChangeStatus}
                objectError={AirlineErrorCode}
            />


        </>
    )
}

export default AirlineTable