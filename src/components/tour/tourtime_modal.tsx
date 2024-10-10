import {
  handleDate,
  handleNameAndNumber,
  handleNumber,
} from "@/utils/handleUtils";
import { useEffect, useState } from "react";
import { FloatingLabel, Form } from "react-bootstrap";

// Import các file CSS
import "swiper/css";
import "swiper/css/navigation";

import { defaultIAirlineResponse, defaultITourTimeRequest } from "@/utils/defaults";
import TourTimeErrorCode from "@/exception/tourtime_error_code";

interface IProps {
  tourtime?: ITourTimeDetailResponse;
  airlines: IAirlineResponse[];
  index: number;
  getTourTimeDetail: (value: ITourTimeRequest,validationCheck:boolean, index: number) => void;
}

export const TourTimeModal = (props: IProps) => {
  const { tourtime, airlines, index, getTourTimeDetail } = props;

  var Typeahead = require("react-bootstrap-typeahead").Typeahead; // CommonJS

  const [validation, setValidation] = useState<boolean[]>(
    Array(11).fill(false)
  );

  const [time_name, setTimeName] = useState<string>("");
  const [departure_date, setDepartureDate] = useState<string>("");
  const [return_date, setReturnDate] = useState<string>("");
  const [visa_expire, setVisaExpire] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [quantity_reserve, setQuantityReserve] = useState<number>(0);
  const [quantity_sell, setQuantitySell] = useState<number>(0);
  const [quantity_left, setQuantityLeft] = useState<number>(0);
  const [price_min, setPriceMin] = useState<number>(0);
  const [commission, setCommission] = useState<number>(0);
  const [departure_airline, setDepartureAirline] = useState<IAirlineResponse>(
    defaultIAirlineResponse
  );
  const [return_airline, setReturnAirline] = useState<IAirlineResponse>(
    defaultIAirlineResponse
  );

  const [departure_airline_error, setDepartureAirline_error] =
    useState<string>("");
  const [return_airline_error, setReturnAirline_error] = useState<string>("");

  useEffect(() => {
    if (tourtime) {
      setValidation(Array(11).fill(true));
      setTimeName(tourtime.time_name);
      setDepartureDate(tourtime.departure_time);
      setReturnDate(tourtime.return_time);
      setVisaExpire(tourtime.visa_expire);
      setQuantity(tourtime.quantity);
      setQuantityReserve(tourtime.quantity_reserve);
      setQuantitySell(tourtime.quantity_sell);
      setQuantityLeft(tourtime.quantity_left);
      setPriceMin(tourtime.price_min);
      setCommission(tourtime.commission);

      if (tourtime.departureAirline && tourtime.departureAirline != null) {
        const airlinenew = tourtime.departureAirline;
        const foundAirline = airlines.find(
          (airline) => airline.airline_id === airlinenew.airline_id
        );
        setDepartureAirline(foundAirline || defaultIAirlineResponse);
      }

      if (tourtime.returnAirline && tourtime.returnAirline != null) {
        const airlinenew = tourtime.returnAirline;
        const foundAirline = airlines.find(
          (airline) => airline.airline_id === airlinenew.airline_id
        );
        setReturnAirline(foundAirline || defaultIAirlineResponse);
      }
    }
  }, []);

  useEffect(() => {
    if (quantity > 0) {
      var x = quantity - quantity_sell - quantity_reserve;
      setQuantityLeft(x > 0 ? x : 0);
    }
  }, [quantity, quantity_reserve, quantity_sell]);

  useEffect(() => {
    if (validation.every((value) => value === true)) {
      const initITourTimeRequest: ITourTimeRequest = {
        time_name: time_name,
        departure_time: departure_date,
        return_time: return_date,
        departure_date: departure_date,
        return_date: return_date,
        visa_expire: visa_expire,
        quantity: quantity,
        quantity_reserve: quantity_reserve,
        quantity_sell: quantity_sell,
        quantity_left: quantity_left,
        price_min: price_min,
        commission: commission,
        departure_airline_id: departure_airline?.airline_id,
        return_airline_id: return_airline?.airline_id,
      };
      getTourTimeDetail(initITourTimeRequest,true,index);
    }
    else getTourTimeDetail(defaultITourTimeRequest,false,index);
  }, [
    time_name,
    departure_date,
    return_date,
    visa_expire,
    quantity,
    quantity_reserve,
    quantity_sell,
    price_min,
    commission,
    departure_airline,
    return_airline,
  ]);


  const updateValidation = (index: number, isValid: boolean) => {
    setValidation((prevValidation) => {
      const newValidation = [...prevValidation];
      newValidation[index] = isValid;
      return newValidation;
    });
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <FloatingLabel className="mb-3" label="Tên thời gian">
          <Form.Control
            type="text"
            placeholder="..."
            value={time_name}
            className="form-control"
            onChange={(e) =>
              handleNameAndNumber(
                e.target.value,
                (isValid) => updateValidation(0, isValid),
                setTimeName
              )
            }
            isValid={validation[0]}
            isInvalid={time_name != "" && !validation[0]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_8}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Ngày khởi hành">
          <Form.Control
            type="datetime-local"
            className="form-control rbt-input"
            placeholder="Ngày khởi hành"
            value={departure_date}
            onChange={(e) =>
              handleDate(
                e.target.value,
                (isValid) => updateValidation(1, isValid),
                setDepartureDate
              )
            }
            isValid={validation[1]}
            isInvalid={departure_date != "" && !validation[1]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_9}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Ngày kết thúc">
          <Form.Control
            type="datetime-local"
            className="form-control rbt-input"
            placeholder="Ngày kết thúc"
            value={return_date}
            onChange={(e) =>
              handleDate(
                e.target.value,
                (isValid) => updateValidation(2, isValid),
                setReturnDate
              )
            }
            isValid={validation[2]}
            isInvalid={return_date != "" && !validation[2]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_17}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Hết hạn visa">
          <Form.Control
            type="date"
            className="form-control rbt-input"
            placeholder="Ngày hết hạn visa"
            value={visa_expire}
            onChange={(e) =>
              handleDate(
                e.target.value,
                (isValid) => updateValidation(3, isValid),
                setVisaExpire
              )
            }
            isValid={validation[3]}
            isInvalid={visa_expire != "" && !validation[3]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_18}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Giá bán thấp nhất (VND)">
          <Form.Control
            type="text"
            placeholder="..."
            value={price_min}
            className="form-control"
            onChange={(e) =>
              handleNumber(
                e.target.value,
                (isValid) => updateValidation(4, isValid),
                setPriceMin
              )
            }
            isValid={validation[4]}
            isInvalid={price_min != 0 && !validation[4]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_5}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Hoa hồng chung (VND)">
          <Form.Control
            type="text"
            placeholder="..."
            value={commission}
            className="form-control"
            onChange={(e) =>
              handleNumber(
                e.target.value,
                (isValid) => updateValidation(5, isValid),
                setCommission
              )
            }
            isValid={validation[5]}
            isInvalid={commission != 0 && !validation[5]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_5}
          </Form.Control.Feedback>
        </FloatingLabel>
      </div>
      <div className="col-md-6">

        <div className="form-floating mb-3">
          <Typeahead
            placeholder="Chọn chuyến khởi hành"
            onChange={(airlines: IAirlineResponse[]) => {
              setDepartureAirline(airlines[0]);
              setDepartureAirline_error("");
              validation[6] = true;
            }}
            labelKey={(airline: IAirlineResponse) => airline.airline_name}
            options={airlines}
            onInputChange={() => {
              setDepartureAirline_error("Mục bạn chọn không có sẵn");
              validation[6] = false;
            }}
            selected={departure_airline ? [departure_airline] : []}
          ></Typeahead>
          <input
            type="text"
            className="input-error"
            value={departure_airline_error}
            disabled
          />
        </div>

        <div className="form-floating mb-3">
          <Typeahead
            placeholder="Chọn chuyến trở về"
            onChange={(airlines: IAirlineResponse[]) => {
              setReturnAirline(airlines[0]);
              setReturnAirline_error("");
              validation[7] = true;
            }}
            labelKey={(airline: IAirlineResponse) => airline.airline_name}
            options={airlines}
            onInputChange={() => {
              setReturnAirline_error("Mục bạn chọn không có sẵn");
              validation[7] = false;
            }}
            selected={return_airline ? [return_airline] : []}
          ></Typeahead>
          <input
            type="text"
            className="input-error"
            value={return_airline_error}
            disabled
          />
        </div>

        <FloatingLabel className="mb-3" label="Số lượng">
          <Form.Control
            type="text"
            placeholder="..."
            value={quantity}
            className="form-control"
            onChange={(e) =>
              handleNumber(
                e.target.value,
                (isValid) => updateValidation(8, isValid),
                setQuantity
              )
            }
            isValid={validation[8]}
            isInvalid={quantity != 0 && !validation[8]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_2}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Số lượng đã bán">
          <Form.Control
            type="text"
            placeholder="..."
            value={quantity_sell}
            className="form-control"
            onChange={(e) =>
              handleNumber(
                e.target.value,
                (isValid) => updateValidation(9, isValid),
                setQuantitySell
              )
            }
            isValid={validation[9]}
            isInvalid={quantity_sell != 0 && !validation[9]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_3}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Số lượng đang đặt">
          <Form.Control
            type="text"
            placeholder="..."
            className="form-control"
            value={quantity_reserve}
            onChange={(e) =>
              handleNumber(
                e.target.value,
                (isValid) => updateValidation(10, isValid),
                setQuantityReserve
              )
            }
            isValid={validation[10]}
            isInvalid={quantity_reserve != 0 && !validation[10]}
          />
          <Form.Control.Feedback type="invalid">
            {TourTimeErrorCode.TOURTIME_4}
          </Form.Control.Feedback>
        </FloatingLabel>

        <FloatingLabel className="mb-3" label="Số lượng còn lại (chưa đặt)">
          <Form.Control
            type="text"
            placeholder="..."
            value={quantity_left}
            className="form-control"
            disabled
          />
        </FloatingLabel>
      </div>
    </div>
  );
};

export default TourTimeModal;
