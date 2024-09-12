"use client";
import { useState } from "react";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import cookie from "js-cookie";
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

interface IProps {
  tour: ITourDetailResponse;
  categories: ICategoryResponse[];
  airlines: IAirlineResponse[];
  fetchTour: () => void;
}

const TourUpdateForm = (props: IProps) => {
  // nhận các giá trị tour và các mảng cần thiết
  const { tour, categories, airlines, fetchTour } = props;
  // tạo danh sách kiểm tra giá trị hợp lệ các field
  //giá trị mặc định là true
  const [validation, setValidation] = useState<boolean[]>(Array(4).fill(true));

  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS

  //tạo các biến lưu trữ giá trị cần thiết cho tour tourtime
  const [tour_name, setTourName] = useState<string>(tour.tour_name);
  const [category, setCategory] = useState<ICategoryResponse>(
    categories.find((category) => category.category_id === tour.category_id) ||
      defaultICategoryResponse
  );
  const [tour_detail, setTourDetail] = useState<string>(tour.tour_detail);
  const [url, setUrl] = useState<string>(tour.url);

  //TourTime nhận lại từ TourTimeModal
  const [tourTime, setTourTime] = useState<ITourTimeRequest>(
    defaultITourTimeRequest
  );

  //listTourTime để thực hiện khóa
  const [listTourTime,setListTourTime]=useState<ITourTimeDetailResponse[]>(tour.tourTimes)
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
      const res = await fetch(
        `http://localhost:8080/api/tour/${tour.tour_id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
          },
          body: JSON.stringify(initTourRequest),
        }
      );

      const data = await res.json();
      if (data.status == "SUCCESS") {
        toast.success(`Cập nhật người dùng ${tour_name} thành công`);
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
    const res = await fetch(
      `http://localhost:8080/api/tour/${tour.tour_id}/${listTourTime[index].tour_time_id}`,
      {
        method: "PUT",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
        },
        body: JSON.stringify(tourTime),
      }
    );
    const data = await res.json();
    if (data.status == "SUCCESS") {
      toast.success(`Cập nhật Thời gian ${tourTime.time_name} thành công`);
      fetchTour();
      handleClose();
    } else {
      let errors = ExportError(data, TourErrorCode);
      for (let i: number = 0; i < errors.length; i++) {
        toast.error(errors[i]);
      }
      console.log("response:", data);
    }
  };

  // nhận sự kiện khi bấm vào thêm tour time
  const handleCreateNewTourTime = async () => {
    const res = await fetch(`http://localhost:8080/api/tour/${tour.tour_id}`, {
      method: "POST",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
      body: JSON.stringify(tourTime),
    });
    const data = await res.json();
    if (data.status == "SUCCESS") {
      toast.success(`Thêm Thời gian ${tourTime.time_name} thành công`);
      fetchTour();
      handleClose();
    } else {
      let errors = ExportError(data, TourErrorCode);
      console.log(errors);
      for (let i: number = 0; i < errors.length; i++) {
        toast.error(errors[i]);
      }
      console.log("response:", data);
    }
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

  const handleSetTourTimeDetail = (value: ITourTimeRequest, index?: number) => {
    setTourTime(value);
  };

  const [show, setShow] = useState(false);
  const [indexData, setIndexData] = useState<number>(-1);

  const handleShow = (index: number) => {
    setIndexData(index); // Truyền dữ liệu vào modal
    setShow(true); // Hiển thị modal
  };

  const handleClose = () => {
    setShow(false); // Đóng modal
    setTourTime(defaultITourTimeRequest);
  };

  const updateValidation = (index: number, isValid: boolean) => {
    setValidation((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };

  const handleChangeStatus = async (tourTime: ITourTimeDetailResponse) => {
    setTour_time_id(tourTime.tour_time_id);
    setStatusObject(tourTime.status);
    setApiChangeStatus(
      `http://localhost:8080/api/tour/change-status/${
        tour.tour_id +`/`+ tourTime.tour_time_id
      }`
    );
    setShowChangeStatusModal(true);
    if (tourTime.status == 1) {
      setDetail(`Bạn có muốn khóa tài khoản ${tour.tour_name} không ?`);
    } else {
      setDetail(`Bạn có muốn mở khóa tài khoản ${tour.tour_name} không ?`);
    }
  };

  const handleChangeStatusState = () => {
    setListTourTime(
      listTourTime.map((a) =>
        a.tour_time_id === tour_time_id ? { ...a, status: a.status === 1 ? 0 : 1 } : a
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
              onChange={(categories: ICategoryResponse[]) =>
                handleSelectedCategory(categories[0])
              }
              labelKey={(category: ICategoryResponse) => category.category_name}
              options={categories}
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
              <Link href={"/management/tour/"} className="link-back">
                Thoát
              </Link>
            </Button>
            <Button onClick={() => handleUpdateTour()} variant="success">
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
                      {listTourTime[index].departureAirline?.airline_detail}
                      {listTourTime[index].returnAirline?.airline_detail}
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
              airlines={airlines}
              index={indexData}
              getTourTimeDetail={handleSetTourTimeDetail}
              tourtime={listTourTime[indexData]}
            />
          ) : (
            <TourTimeModal
              airlines={airlines}
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
