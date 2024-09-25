"use client";
import { useEffect, useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import TourErrorCode from "@/exception/tour_error_code";
import { toast } from "react-toastify";
import { ExportError } from "@/utils/export_error";
import TourTimeModal from "./tourtime_modal";
import {
  defaultICategoryResponse,
  defaultITourTimeRequest,
} from "@/utils/defaults";
import {
  handleAddress,
  handleNameAndNumber,
  handleSlug,
} from "@/utils/handleUtils";
import ChangeStatusModal from "../change_status_modal";
import {
  fetchGetTour,
  fetchPostTourTime,
  fetchPutTour,
  fetchPutTourTime,
} from "@/utils/serviceApiClient";

interface IProps {
  tour: ITourDetailResponse;
  categories: ICategoryResponse[];
  airlines: IAirlineResponse[];
  slug: string;
}

const TourUpdateForm = (props: IProps) => {
  // nhận các giá trị tour và các mảng cần thiết
  const [tourRes, setTourRes] = useState(props.tour);
  const categoriesRes = props.categories;
  const airlinesRes = props.airlines;
  const slug = props.slug;

  const [statusValitationTourTime, setStatusValitationTourTime] =
    useState<boolean>(false);
  // tạo danh sách kiểm tra giá trị hợp lệ các field
  const [validation, setValidation] = useState<boolean[]>(Array(4).fill(true));

  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS

  //tạo các biến lưu trữ giá trị cần thiết cho tour tourtime
  const [tour_name, setTourName] = useState<string>(tourRes.tour_name);
  const [category, setCategory] = useState<ICategoryResponse>(
    categoriesRes.find(
      (category) => category.category_id === tourRes.category_id
    ) || defaultICategoryResponse
  );
  const [tour_detail, setTourDetail] = useState<string>(tourRes.tour_detail);
  const [url, setUrl] = useState<string>(tourRes.url);
  useEffect(() => {
    setListTourTime(tourRes.tourTimes);
  }, [tourRes]);

  //TourTime nhận lại từ TourTimeModal
  const [tourTimeReq, setTourTimeReq] = useState<ITourTimeRequest>(
    defaultITourTimeRequest
  );

  //listTourTime để thực hiện khóa
  const [listTourTime, setListTourTime] = useState<ITourTimeDetailResponse[]>(
    tourRes.tourTimes
  );
  const [apiChangeStatus, setApiChangeStatus] = useState<string>("");
  const [tour_time_id, setTour_time_id] = useState<number | null>(null);
  const [statusObject, setStatusObject] = useState<number>(0);
  const [detail, setDetail] = useState<string>("");
  const [showChangeStatusModal, setShowChangeStatusModal] =
    useState<boolean>(false);

  //tại các biến lưu trữ giá trị nếu lỗi định dạng
  const [category_error, setCategory_error] = useState<string>("");

  // nhận sự kiện khi bấm vào cập nhật tour
  const handleUpdateTour = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validation.length; i++) {
      if (validation[i] == false) {
        flag = false;
        break;
      }
    }

    if (flag) {
      const initTourRequest: ITourUpdateRequest = {
        tour_name: tour_name,
        tour_detail: tour_detail,
        category_id: category.category_id,
        url: url,
      };
      console.log(initTourRequest);

      const data = await fetchPutTour(
        tourRes.tour_id.toString(),
        initTourRequest
      );
      if (data.status == "SUCCESS") {
        setTourRes(await fetchGetTour(slug));
        toast.success(`Cập nhật tour ${initTourRequest.tour_name} thành công`);
        handleClose();
      } else {
        let errors = ExportError(data, TourErrorCode);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        console.log("response:", data);
      }
    } else {
      toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ");
    }
  };

  // nhận sự kiện khi bấm vào cập nhật tourtime
  const handleUpdateTourTime = async (index: number) => {
    if (statusValitationTourTime) {
      const data = await fetchPutTourTime(
        tourRes.tour_id.toString(),
        listTourTime[index].tour_time_id.toString(),
        tourTimeReq
      );
      if (data.status == "SUCCESS") {
        setTourRes(await fetchGetTour(slug));
        toast.success(`Cập nhật Thời gian ${tourTimeReq.time_name} thành công`);
        handleClose();
      } else {
        let errors = ExportError(data, TourErrorCode);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        console.log("response:", data);
      }
    } else toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ");
  };

  // nhận sự kiện khi bấm vào thêm tour time
  const handleCreateNewTourTime = async () => {
    if (statusValitationTourTime) {
      const data = await fetchPostTourTime(
        tourRes.tour_id.toString(),
        tourTimeReq
      );
      if (data.status == "SUCCESS") {
        setTourRes(await fetchGetTour(slug));
        toast.success(`Thêm Thời gian ${tourTimeReq.time_name} thành công`);
        handleClose();
      } else {
        let errors = ExportError(data, TourErrorCode);
        console.log(errors);
        for (let i: number = 0; i < errors.length; i++) {
          toast.error(errors[i]);
        }
        console.log("response:", data);
      }
    } else toast.error("Vui lòng nhập đầy đủ thông tin hợp lệ");
  };

  //hàm kiểm tra giá trị khi lưu
  const handleSelectedCategory = (category: ICategoryResponse) => {
    validation[3] = true;
    setCategory(category);
    setCategory_error("");
  };

  const handleCategory = () => {
    validation[3] = false;
    setCategory_error("Người này là người đại diện");
  };

  const handleSetTourTimeDetail = (
    value: ITourTimeRequest,
    validationCheck: boolean
  ) => {
    if (validationCheck) {
      setTourTimeReq(value);
      setStatusValitationTourTime(true);
    } else {
      setStatusValitationTourTime(false);
    }
  };

  const [show, setShow] = useState(false);
  const [indexData, setIndexData] = useState<number>(-1);

  const handleShow = (index: number) => {
    setIndexData(index); // Truyền dữ liệu vào modal
    setShow(true); // Hiển thị modal
  };

  const handleClose = () => {
    setShow(false); // Đóng modal
    setTourTimeReq(defaultITourTimeRequest);
  };

  const updateValidation = (index: number, isValid: boolean) => {
    setValidation((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };

  const handleChangeStatus = async (tourTimeReq: ITourTimeDetailResponse) => {
    setTour_time_id(tourTimeReq.tour_time_id);
    setStatusObject(tourTimeReq.status);
    setApiChangeStatus(
      `http://localhost:8080/api/tour/change-status/${
        tourRes.tour_id + `/` + tourTimeReq.tour_time_id
      }`
    );
    setShowChangeStatusModal(true);
    if (tourTimeReq.status == 1) {
      setDetail(`Bạn có muốn khóa tài khoản ${tourRes.tour_name} không ?`);
    } else {
      setDetail(`Bạn có muốn mở khóa tài khoản ${tourRes.tour_name} không ?`);
    }
  };

  const handleChangeStatusState = () => {
    setListTourTime(
      listTourTime.map((a) =>
        a.tour_time_id === tour_time_id
          ? { ...a, status: a.status === 1 ? 0 : 1 }
          : a
      )
    );
  };

  return (
    <>
      <div className="row">
        <div className="col-md-6">
          <FloatingLabel className="mb-3" label="Tên Tour">
            <Form.Control
              type="text"
              placeholder="..."
              value={tour_name}
              onChange={(e) =>
                handleNameAndNumber(
                  e.target.value,
                  (isValid) => updateValidation(0, isValid),
                  setTourName
                )
              }
              isValid={validation[0]}
              isInvalid={tour_name != "" && !validation[0]}
            />
            <Form.Control.Feedback type="invalid">
              {TourErrorCode.TOUR_1}
            </Form.Control.Feedback>
          </FloatingLabel>

          <FloatingLabel className="mb-4" label="Chi tiết Tour">
            <Form.Control
              as="textarea"
              className="form-control"
              rows={5}
              placeholder="..."
              value={tour_detail}
              onChange={(e) =>
                handleAddress(
                  e.target.value,
                  (isValid) => updateValidation(1, isValid),
                  setTourDetail
                )
              }
              isValid={validation[1]}
              isInvalid={tour_detail != "" && !validation[1]}
            />
            <Form.Control.Feedback type="invalid">
              {TourErrorCode.TOUR_1}
            </Form.Control.Feedback>
          </FloatingLabel>

          <div className="form-floating mb-3">
            <Typeahead
              placeholder="Danh mục"
              onChange={(categoriesRes: ICategoryResponse[]) =>
                handleSelectedCategory(categoriesRes[0])
              }
              labelKey={(category: ICategoryResponse) => category.category_name}
              options={categoriesRes}
              onInputChange={handleCategory}
              selected={category ? [category] : []}
            />
            <input
              type="text"
              className="input-error"
              value={category_error}
              disabled
              only-read
            />
          </div>

          <FloatingLabel className="mb-3" label="Đường dẫn">
            <Form.Control
              type="text"
              placeholder="..."
              value={url}
              className="form-control"
              onChange={(e) =>
                handleSlug(
                  e.target.value,
                  (isValid) => updateValidation(2, isValid),
                  setUrl
                )
              }
              isValid={validation[2]}
              isInvalid={url != "" && !validation[2]}
            />
            <Form.Control.Feedback type="invalid">
              {TourErrorCode.TOUR_1}
            </Form.Control.Feedback>
          </FloatingLabel>

          <div className="div-back-create">
            <Button className="btn-back">
              <Link href={"/management/tour/"} className="link-back px-2 text-decoration-none text-white">
                Thoát
              </Link>
            </Button>
            <Button onClick={() => handleUpdateTour()} variant="success" className="mx-2">
              Cập nhật Tour
            </Button>
          </div>
        </div>
        <div className="col-md-6">
          <div className="head-tour_time d-flex justify-content-around">
            <h4>Danh sách lịch khởi hành tour </h4>
            <Button variant="primary" onClick={() => handleShow(-1)}>
              <i className="fa-regular fa-square-plus"></i>
            </Button>
          </div>
          <div className="list-tour_time">
            {Array.from({ length: listTourTime.length }, (_, index) => (
              <div
                className={`tour_time tour_time_${index} border border-1 border-info d-block rounded-3 p-2 mb-2`}
                key={index}
              >
                <h5>{listTourTime[index].time_name}</h5>
                <div className="row">
                  <div className="col-md-10">
                    <div className="mb-2">
                      Giá: {listTourTime[index].price_min} VND
                    </div>
                    <div className="mb-2">
                      Hãng:
                      {`${listTourTime[index].departureAirline?.airline_detail} - 
                      ${listTourTime[index].returnAirline?.airline_detail}`}
                    </div>
                    <div className="mb-2">
                      Ngày đi: {listTourTime[index].departure_time}
                    </div>
                    <div className="mb-2">
                      Ngày về: {listTourTime[index].departure_time}
                    </div>
                  </div>
                  <div className="col-md-2">
                    <Button variant="primary" onClick={() => handleShow(index)}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </Button>
                    <Form.Check
                      className="check-active"
                      checked={listTourTime[index].status == 1}
                      onChange={() => handleChangeStatus(listTourTime[index])}
                      type="switch"
                      id="custom-switch"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} fullscreen={"lg-down"} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tour Time Detail</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {indexData > -1 ? (
            <TourTimeModal
              airlines={airlinesRes}
              index={indexData}
              getTourTimeDetail={handleSetTourTimeDetail}
              tourtime={listTourTime[indexData]}
            />
          ) : (
            <TourTimeModal
              airlines={airlinesRes}
              index={listTourTime.length}
              getTourTimeDetail={handleSetTourTimeDetail}
            />
          )}
        </Modal.Body>
        <Modal.Footer>
          {indexData > -1 ? (
            <Button
              variant="success"
              onClick={() => handleUpdateTourTime(indexData)}
            >
              Cập nhật
            </Button>
          ) : (
            <Button variant="primary" onClick={handleCreateNewTourTime}>
              Tạo mới
            </Button>
          )}

          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ChangeStatusModal
        showChangeStatusModal={showChangeStatusModal}
        setShowChangeStatusModal={setShowChangeStatusModal}
        statusObject={statusObject}
        detail={detail}
        api={apiChangeStatus}
        objectError={TourErrorCode}
        handleChangeStatusState={handleChangeStatusState}
      />
    </>
  );
};

export default TourUpdateForm;
