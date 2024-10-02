'use client'
import cookie from 'js-cookie';
import { useEffect, useState } from "react"
import { Button, Table } from "react-bootstrap"
import ReserveCustomerCreateModal from "./reserve_customer_create_modal";
import { toast } from "react-toastify";
import { formatCurrency } from '@/utils/string_utils';
import "@/styles/reserve.css"
interface IProps {
    reserveTour: IReserveTourResponse;
}


const ReserveCustomer = (props: IProps) => {
    const { reserveTour } = props
    const [reserveRequests, setReserveRequests] = useState<IReserveRequest[]>([]);
    const [total, setTotal] = useState<number>(0)

    const initCustomerRequest: ICustomerResponse = {
        customer_id: 0,
        customer_name: '',
        sex: 0,
        relationship_name: '',
        phone_number: '',
        email: '',
        address: '',
        birthday: '',
        visa_expire: '',
        time: '',
        status: 0,
    }
    const initReserveRequest: IReserveRequest = {
        customerResponse: initCustomerRequest,

        tour_time_id: reserveTour.tourTime.tour_time_id,

        employee_id: 0,

        note: '',

        price_min: 0,

        price: 0,

        commission: 0
    }


    const [reserveRequest, setReserveRequest] = useState<IReserveRequest>(initReserveRequest)
    const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);

    const handleCreate = () => {
        setShowCustomerModal(true);
        console.log("Đã bấm")
    };

    const handleCreateReserve = (reserveRequest: IReserveRequest) => {
        let flag = true;
        for (let i: number = 0; i < reserveRequests.length; i++) {
            if (reserveRequest.customerResponse.customer_id != null && reserveRequests[i].customerResponse.customer_id == reserveRequest.customerResponse.customer_id) {
                flag = false
                break;
            }
        }
        if (flag) {
            setReserveRequests((prevReserves) => [...prevReserves, reserveRequest]);
            toast.success("Thêm thành công")
        } else {
            toast.error("Khách hàng này đã có trong thông tin hành khách chuyến đi này")
        }
    }

    const handleDeleteCustomer = (reserveRequest: IReserveRequest) => {
        setReserveRequests((prevReserves) =>
            prevReserves.filter((reserve) => reserve !== reserveRequest)
        );
        toast.success("Xóa thành công")
    };

    const handleReserve = async () => {
        if (reserveRequests.length > 0) {
            const initReserveRequests: IReserveRequests = {
                reserveRequests: reserveRequests,
            }

            const res = await fetch(
                "http://localhost:8080/api/reserve/reserve-tour",
                {
                    method: "POST",
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${cookie.get('session-id')}`, // Set Authorization header
                    },
                    body: JSON.stringify(initReserveRequests)
                }
            );
            const data = await res.json();
            if (data.status === "SUCCESS") {
                toast.success("Đặt chổ thành công")
                setReserveRequests([])
            } else {
                toast.error("Không đủ chổ")
            }
            console.log("Reserve requests >>> ", initReserveRequests)
            console.log("result >>> ", data)
        } else {
            toast.error("Không có thông tin hành khách")
        }


    }


    const handleSex = (sex: number): string => {
        switch (sex) {
            case 1:
                return 'Nam'
            case 0:
                return 'Nữ'
            case 3:
                return 'Khác'
            default:
                return 'Unknow'
        }

    }

    useEffect(() => {
        let total = 0
        for (let i: number = 0; i < reserveRequests.length; i++) {
            total += reserveRequests[i].price
        }
        setTotal(total)


    }, [reserveRequests])



    return (
        <>
            <div className="div-add" >
                <Button className="btn-add-customer"
                    onClick={() => handleCreate()}
                >Thêm hành khách</Button>
                <span style={{ color: "red", fontSize: '20px', fontWeight: 'bold', textAlign: 'center' }} >{`Tổng tiền : ${formatCurrency(total)}`}  </span>
            </div>
            <Table striped bordered hover className="table" style={{ margin: '12px' }}>
                <thead>
                    <tr>
                        <th>STT</th>
                        <th>Tên khách hàng</th>
                        <th>Giới tính</th>
                        <th>Ngày sinh</th>
                        <th>Giá</th>
                        <th>Xóa</th>
                    </tr>
                </thead>
                <tbody>
                    {reserveRequests?.map((reserve, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{reserve.customerResponse.customer_name}</td>
                                <td>{handleSex(reserve.customerResponse.sex)}</td>
                                <td>{reserve.customerResponse.birthday}</td>
                                <td>{formatCurrency(reserve.price)}</td>
                                <td><Button
                                    onClick={() => handleDeleteCustomer(reserve)}
                                    variant="danger" >Xóa</Button></td>
                            </tr>
                        );

                    })}
                </tbody>
            </Table>
            <div className="div-add-reserve" >
                <Button className="btn-add-reserve"
                    onClick={() => handleReserve()}
                >Đặt chổ</Button>
            </div>



            <ReserveCustomerCreateModal
                setShowCustomerModal={setShowCustomerModal}
                showCustomerModal={showCustomerModal}
                handleCreateReserve={handleCreateReserve}
                reserveTour={reserveTour}
            />
        </>
    )

}

export default ReserveCustomer