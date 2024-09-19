"use client";
import { useEffect, useMemo, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { Col, Container, Row } from "react-bootstrap";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import cookie from "js-cookie";
import TourErrorCode from "@/exception/tour_error_code";
import { Slide, toast } from "react-toastify";
import { ExportError } from "@/utils/export_error";

import { TourTimeModal } from "./tourtime_modal";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  defaultICategoryResponse,
  defaultITourTimeRequest,
} from "@/utils/defaults";
import { handleAddress, handleNameAndNumber, handleSlug } from "@/utils/handleUtils";
import { fetchPostTour } from "@/utils/serviceApiClient";

interface IProps {
  showTourModal: boolean;
  setShowTourModal: (value: boolean) => void;
  fetchTours: () => void;
  categories:ICategoryResponse[],
  airlines:IAirlineResponse[]
}

const TourCreateModal = (props: IProps) => {
  const { showTourModal, setShowTourModal, fetchTours, categories,airlines} = props;

  const [validation, setValidation] = useState<boolean[]>(Array(4).fill(false));

  const [tour_name, setTourName] = useState<string>("");
  const [category, setCategory] = useState<ICategoryResponse>(
    defaultICategoryResponse
  );
  const [tour_detail, setTourDetail] = useState<string>("");
  const [url, setUrl] = useState<string>("");
  const [tourTimes, setTourTimes] = useState<ITourTimeRequest[]>([]);

  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS

  const [category_error, setCategory_error] = useState<string>("");

  const [inputValue, setInputValue] = useState<number | null>(null); // Đặt giá trị mặc định là 1
  const [slideCount, setSlideCount] = useState<number>(1); // Đặt giá trị mặc định là 1
  const [showForm, setShowForm] = useState(false);

  const handleHideModal = () => {
    setShowTourModal(false);

    setTourName("");
    setCategory(defaultICategoryResponse);
    setTourDetail("");
    setUrl("");
    setTourTimes([defaultITourTimeRequest]);
    setInputValue(null);
    setShowForm(false);

    setCategory_error("");

    setValidation([]);
    setValidation(Array(4).fill(false));
  };

  const handleCreate = async () => {
    let flag: boolean = true;
    for (let i: number = 0; i < validation.length; i++) {
      if (validation[i] == false) {
        flag = false;
        break;
      }
    }

    if (flag) {
      const initTourRequest: ITourRequest = {
        tour_name: tour_name,
        tour_detail: tour_detail,
        category_id: category.category_id,
        tourTimes: tourTimes,
        url: url,
      };
      console.log("tour:", initTourRequest);

      const data = await fetchPostTour(initTourRequest)
      if (data.status == "SUCCESS") {
        toast.success(`Thêm người dùng ${tour_name} thành công`);
        setShowTourModal(false);
        fetchTours();
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

  const handleSelectedCategory = (category: ICategoryResponse) => {
    validation[3] = true;
    setCategory(category);
    setCategory_error("");
  };

  const handleCategory = (e: string) => {
    validation[3] = false;
    setCategory_error("Người này là người đại diện");
  };

  const handleValueSlides = (value: string) => {
    const numberValue = parseInt(value, 10);
    if (!isNaN(numberValue)) {
      if (numberValue > 0) {
        setInputValue(numberValue);
        setShowForm(false);
      }
    } else {
      setInputValue(numberValue);
      setShowForm(false);
    }
  };

  const handleAddForm = () => {
    if (inputValue) {
      setSlideCount(inputValue);
      setShowForm(true);
    }
  };

  const handleSetValueTourTime = (value: ITourTimeRequest, index: number) => {
    setTourTimes((prevDetails) => {
      // Tạo một bản sao của mảng prevDetails
      const updatedDetails = [...prevDetails];
      // Cập nhật hoặc thêm đối tượng mới tại vị trí index
      updatedDetails[index] = value;
      return updatedDetails;
    });
  };

  const updateValidation = (index: number, isValid: boolean) => {
    setValidation((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };

  return (
    <>
      <Modal
        show={showTourModal}
        fullscreen={true}
        backdrop="static"
        keyboard={false}
        onHide={() => {
          handleHideModal();
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Thêm mới Tour</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container className="div-tour-modal">
            <div className="row">
              <div className="col-md-5">
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
                    labelKey={(category: ICategoryResponse) =>
                      category.category_name
                    }
                    options={categories}
                    onInputChange={(e: string) => handleCategory(e)}
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

                <FloatingLabel className="mb-3" label="Số lượt khởi hành">
                  <Form.Control
                    type="number"
                    placeholder="..."
                    value={inputValue ? inputValue : ""}
                    className="form-control"
                    onChange={(e) => handleValueSlides(e.target.value)}
                  />
                </FloatingLabel>

                <Button variant="outline-secondary" onClick={handleAddForm}>
                  Tạo Thời gian
                </Button>
              </div>
              <div className="col-md-7">
                <div className="swiper-container">
                    <Swiper
                      modules={[Navigation, Pagination, Scrollbar, A11y]}
                      spaceBetween={150}
                      slidesPerView={1}
                      navigation
                      pagination={{ clickable: true }}
                      scrollbar={{ draggable: true }}
                    >
                      {Array.from(
                        { length: slideCount },
                        (_, index) =>
                          showForm && (
                            <SwiperSlide key={index}>
                              Khởi hành lần {index + 1}
                              <TourTimeModal
                                airlines={airlines}
                                index={index}
                                getTourTimeDetail={handleSetValueTourTime}
                              />
                            </SwiperSlide>
                          )
                      )}
                    </Swiper>
                </div>
              </div>
            </div>
            <div className="div-back-create">
              <Button
                className="btn-create-back"
                onClick={() => handleHideModal()}
              >
                Trở lại
              </Button>
              <Button onClick={() => handleCreate()} variant="success">
                Tạo tour mới
              </Button>
            </div>
          </Container>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default TourCreateModal;
