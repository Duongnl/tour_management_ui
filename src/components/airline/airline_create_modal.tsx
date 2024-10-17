'use client'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useEffect, useState } from 'react';
import AirlineErrorCode from '@/exception/airline_error_code';
import { fetchPostAirline } from '@/utils/serviceApiClient';
import { toast } from 'react-toastify';
import { ExportError } from '@/utils/export_error';
import { useRouter, usePathname } from 'next/navigation'
interface Iprops {
    showAirlineCreateModal: boolean,
    setShowAirlineCreateModal: (value: boolean) => void
    fetchAirlines: () => void

    
    setSearch: (value: string) => void
}

const AirlineCreateModal = (props: Iprops) => {
    const { showAirlineCreateModal, setShowAirlineCreateModal, fetchAirlines,setSearch } = props;

    const [airlineName, setAirlineName] = useState<string>("");
    const [airlineDetail, setAirlineDetail] = useState<string>("");
    const [validation, setValidation] = useState<boolean[]>([false, true])
    
    const pathName = usePathname()
    const router = useRouter()

    const handleClose = () => {
        setShowAirlineCreateModal(false)
        setValidation([false, true])
        setAirlineName("")
        setAirlineDetail("")
    }

    const handleAirlineName = (e: string) => {
        const regex: RegExp = /^(?=(.*\p{L}){2,})[\p{L} ]{2,255}$/u;
        if (regex.test(e)) {
            validation[0] = true
        } else {
            validation[0] = false
        }
        setAirlineName(e);
    }

    const handleAirlineDetail = (e: string) => {
        const regex: RegExp = /^[\p{L}0-9 ,.\-]{0,255}$/u;
        if (regex.test(e)) {
            validation[1] = true
        } else {
            validation[1] = false
        }

        if (e === '') {
            validation[1] = true
        }
        setAirlineDetail(e);
    }


    const createAirline = async () => {
        console.log("Validation", validation)
        if (!validation.some(v => v === false)) {

            const airlineRequest: IAirlineRequest = {
                airline_name: airlineName,
                airline_detail: airlineDetail,
            }
            const data = await fetchPostAirline(airlineRequest)

            if(data.status === "SUCCESS") {
                toast.success(`Thêm mới chuyến bay ${airlineName} thành công`)
                handleClose()
                fetchAirlines()
                router.push(pathName)
                setSearch('')
            } else {
                let errors = ExportError(data, AirlineErrorCode);
                for (let i: number = 0; i < errors.length; i++) {
                    toast.error(errors[i]);
                }
            }


        } else {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
        }



        console.log("Validation create category : ", !validation.some(v => v === false))
    }




    return (
        <>
            <Modal
                show={showAirlineCreateModal}
                onHide={() => handleClose()}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Thêm chuyến bay</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FloatingLabel className='mb-3 float-lable-input' label="Tên chuyến bay">
                        <Form.Control type="text" placeholder="..."
                            value={airlineName}
                            onChange={(e) => handleAirlineName(e.target.value)}
                            isValid={validation[0]}
                            isInvalid={airlineName != '' && !validation[0]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {AirlineErrorCode.AIRLINE_6}

                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <Form.Group
                        className="mb-3 input-textarea"
                        controlId="exampleForm.ControlTextarea1"
                    >
                        <Form.Label>Chi tiết chuyến bay</Form.Label>
                        <Form.Control as="textarea" rows={4}
                            value={airlineDetail}
                            onChange={(e) => handleAirlineDetail(e.target.value)}
                            isValid={airlineDetail != '' && validation[1]}
                            isInvalid={airlineDetail != '' && !validation[1]}
                        />
                        <Form.Control.Feedback type="invalid">
                            {AirlineErrorCode.AIRLINE_7}
                        </Form.Control.Feedback>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" className='btn-create-back '
                        onClick={() => handleClose()}
                    >
                        Trở về
                    </Button>
                    <Button
                        onClick={() => createAirline()}
                        variant="success">Tạo</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}
export default AirlineCreateModal