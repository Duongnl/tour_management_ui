'use client'
import { useEffect, useState } from "react"
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import { fetchGetAirline, fetchPutAirline } from "@/utils/serviceApiClient"
import { toast } from "react-toastify"
import AirlineErrorCode from "@/exception/airline_error_code"
import { ExportError } from "@/utils/export_error"
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Button from 'react-bootstrap/Button';
import "@/styles/category.css"
interface IProps {
    showAirlineUpdateModal: boolean,
    setShowAirlineUpdateModal: (value: boolean) => void
    fetchAirlines : () =>void
}
const AirlineUpdateModal = (props:IProps) => {

    const {showAirlineUpdateModal, setShowAirlineUpdateModal, fetchAirlines} = props;

    const [validation, setValidation] = useState<boolean[]>(Array(2).fill(true))
    const router = useRouter()
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const airline_slug = searchParams.get('airline')

    const [airlineName, setAirlineName] = useState<string>("");
    const [airlineDetail, setAirlineDetail] = useState<string>("");

    const [airline, setAirline] = useState<IAirlineResponse>({
        airline_id:0,
        airline_name:'',
        airline_detail:'',
        status:0,
    })

    const handleClose = () => {
        setShowAirlineUpdateModal(false)
        router.push(pathName)
        fetchAirlines()
        setValidation(Array(2).fill(true))
    } 

    useEffect (() => {

        const fetchAirline = async () => {
       
              const airline:IAirlineResponse = await fetchGetAirline(String(airline_slug));
              if (airline.airline_id != undefined) {
                setAirlineName(airline.airline_name)
                setAirlineDetail (airline.airline_detail)
                setAirline(airline)
              } else {
                 toast.error(AirlineErrorCode.AIRLINE_4)
                 handleClose()
              }
            
          }

          if (airline_slug != null && airline_slug != '') {
            fetchAirline()
          }

    },[airline_slug])


    const handleAirlineName = (e: string) => {
        const regex: RegExp = /^(?!\s*$)[\p{L}0-9 ,.\-]{0,255}$/u;
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


    const updateAirline =  async() => {
        if (!validation.some(v => v === false)) { 
            const airlineRequest: IAirlineRequest = {
                airline_name: airlineName,
                airline_detail: airlineDetail,
            }

            const data = await fetchPutAirline(String(airline_slug), airlineRequest)
            if(data.status === "SUCCESS") {
                toast.success(`Sửa chuyến bay ${airlineName} thành công`)
                handleClose()
                fetchAirlines()
                const airline:IAirlineResponse = data.result;
                setAirline(airline)
            } else {
                let errors = ExportError(data, AirlineErrorCode);
                for (let i: number = 0; i < errors.length; i++) {
                    toast.error(errors[i]);
                }
            }

        } else {
            toast.error("Vui lòng điền đầy đủ thông tin hợp lệ")
        }
    }


    
    return (
        <>
  <Modal
                show={showAirlineUpdateModal}
                onHide={() => handleClose()}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Sửa chuyến bay</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <FloatingLabel className='mb-3 float-lable-input' label="Tên danh mục">
                        <Form.Control type="text" placeholder="..."
                            value={airlineName}
                            onChange={(e) => handleAirlineName(e.target.value)}
                            isValid={airlineName!= airline.airline_name &&  validation[0]}
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
                            isValid={airlineDetail != airline.airline_detail && validation[1]}
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
                        onClick={() => updateAirline()}
                        variant="success">Lưu</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default AirlineUpdateModal