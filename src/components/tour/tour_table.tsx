"use client";
import Table from "react-bootstrap/Table";
import { Button, InputGroup, Row } from "react-bootstrap";
import { Suspense, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import ChangeStatusModal from "../change_status_modal";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import PaginationTable from "../pagination";
import TourErrorCode from "@/exception/tour_error_code";
import TourCreateModal from "./tour_create_modal";
import Loading from "@/components/loading";
import { defaultIAirlineResponse } from "@/utils/defaults";
import {
  fetchGetTours,
  fetchGetToursCategory,
} from "@/utils/serviceApiClient";
import "@/styles/table.css";
interface IProps {
  tours: ITourResponse[];
  categories: ICategoryResponse[];
}

const TourTable = (props: IProps) => {
  const [tours, setTours] = useState(props.tours);
  const [categories] = useState(props.categories);
  const [showChangeStatusModal, setShowChangeStatusModal] =
    useState<boolean>(false);
  const [showTourModal, setShowTourModal] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const [toursCopy, setToursCopy] = useState<ITourResponse[]>(tours);

  const [apiChangeStatus, setApiChangeStatus] = useState<string>("");
  const [tour_id, setTour_id] = useState<number | null>(null);
  const [statusObject, setStatusObject] = useState<number>(0);

  const currentPage = searchParams.get("page");
  const status = searchParams.get("status");
  const category = searchParams.get("category");
  const router = useRouter();
  const pathname = usePathname();

  const [numberPages, setNumberPages] = useState<number>(
    Math.ceil(tours != undefined ? tours.length / 8 : 0)
  );
  const [numberStart, setNumberStart] = useState<number>(0);
  const [numberEnd, setNumberEnd] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (category == null || category == "all") {
          if (status == "active") updateTourList(await fetchGetTours(1));
          if (status == "locked") updateTourList(await fetchGetTours(0));
          if (status == "all" || status == null)
            updateTourList(await fetchGetTours());
        } else {
          if (status == "active")
            updateTourList(await fetchGetToursCategory(category, 1));
          if (status == "locked")
            updateTourList(await fetchGetToursCategory(category, 0));
          if (status == "all" || status == null)
            updateTourList(await fetchGetToursCategory(category));
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    fetchData();
  }, [status, category]);

  useEffect(() => {
    let start = 1;
    let end = 8;

    for (let i = 1; i < Number(currentPage); i++) {
      start += 8;
      end += 8;
    }

    setNumberStart(start); // khi useEffect kết thúc thì mới lên lịch cập nhật biến vào number start
    setNumberEnd(end); // nên không nên cập nhật liên tục để dựa vào biến number để tính toán ngay trong useEffect
  }, [currentPage]);

  const updateTourList = (tours: ITourResponse[]) => {
    setTours(tours);
    const numPages = Math.ceil(tours != undefined ? tours.length / 8 : 0);
    setNumberPages(numPages);
    setToursCopy(tours);
  };

  // const fetchActiveTours = async (category_id?: string) => {};

  const handleChangeStatus = async (tour: ITourResponse) => {
    setTour_id(tour.tour_id);
    setStatusObject(tour.status ? tour.status : 0);
    setShowChangeStatusModal(true);
    setApiChangeStatus(
      `http://localhost:8080/api/tour/change-status/${tour.tour_id}`
    );
    if (tour.status == 1) {
      setDetail(`Bạn có muốn khóa tài khoản ${tour.tour_name} không ?`);
    } else {
      setDetail(`Bạn có muốn mở khóa tài khoản ${tour.tour_name} không ?`);
    }
  };

  const handleCreate = () => {
    setShowTourModal(true);
  };

  const handleSelectStatus = (e: string) => {
    // Lấy tất cả các tham số truy vấn hiện tại
    const currentParams = new URLSearchParams(searchParams.toString());
    // Thay đổi giá trị của tham số 'status'
    currentParams.set("status", e);
    // Tạo URL mới với các tham số truy vấn hiện tại và tham số 'status' mới
    // Chuyển hướng đến URL mới
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const handleSelectCategory = (e: string) => {
    router.push(`${pathname}?category=${e}`);
  };

  const handleSearch = (e: string) => {
    router.push(`${pathname}?${status != null ? `status=${status}` : ""}`);
    setSearch(e);
    const filteredData = toursCopy.filter((item) => {
      return Object.values(item).some((value) => {
        return (
          value != null &&
          value.toString().toLowerCase().includes(e.toLowerCase())
        );
      });
    });
    console.log("filter data : ", filteredData);
    setTours(filteredData);
    setNumberPages(Math.ceil(filteredData.length / 8));
  };

  const handleChangeStatusState = () => {
    setTours(
      tours.map((a) =>
        a.tour_id === tour_id ? { ...a, status: a.status === 1 ? 0 : 1 } : a
      )
    );
    setToursCopy(
      toursCopy.map((a) =>
        a.tour_id === tour_id ? { ...a, status: a.status === 1 ? 0 : 1 } : a
      )
    );
  };

  return (
    <>
      <div className="div-add mb-4 d-flex flex-wrap justify-content-start">
          <InputGroup className="input-search width-primary m-1">
            <InputGroup.Text id="basic-addon1">
              <i className="fa-solid fa-magnifying-glass"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="Tìm kiếm"
              aria-describedby="basic-addon1"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </InputGroup>

          <Form.Select
            aria-label="Default select example"
            className="select-status width-primary m-1"
            value={status || ""} // Đặt giá trị hiện tại
            onChange={(e) => handleSelectStatus(e.target.value)}
          >
            <option hidden>Trạng thái</option>
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đã khóa</option>
          </Form.Select>

          <Form.Select
            aria-label="Default select example"
            className="select-status width-primary m-1"
            value={category || ""}
            onChange={(e) => handleSelectCategory(e.target.value)}
          >
            <option hidden>Danh mục</option>
            <option value="all">Tất cả</option>
            {categories.map((category: ICategoryResponse, index: number) => (
              <option key={index} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </Form.Select>

        <Button className="btn-add width-primary mr-1 my-1 ms-auto" onClick={() => handleCreate()}>
          <i
            className="fa-solid fa-user-plus"
            style={{ paddingRight: "8px" }}
          ></i>
          Thêm Tour
        </Button>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Tour</th>
              <th>Tên danh mục</th>
              <th>Mã danh mục</th>
              <th>Chi tiết</th>
              <th>Hoạt động</th>
              <th>Chi tiết</th>
            </tr>
          </thead>
          <tbody>
            <Suspense fallback={<Loading />}>
              {tours?.map((tour, index) => {
                if (index + 1 >= numberStart && index + 1 <= numberEnd) {
                  return (
                    <tr key={tour.tour_id}>
                      <td>{index + 1}</td>
                      <td>{tour.tour_name}</td>
                      <td>{tour.category_name}</td>
                      <td>
                        <Button
                          onClick={() =>
                            handleSelectCategory(
                              (tour.category_id ? tour.category_id : 0).toString()
                            )
                          }
                          variant="outline-primary"
                        >
                          {tour.category_id}
                        </Button>
                      </td>
                      <td>{tour.tour_detail}</td>
                      <td>
                        <Form.Check
                          className="check-active"
                          checked={tour.status == 1}
                          onChange={() => handleChangeStatus(tour)}
                          type="switch"
                          id="custom-switch"
                        />
                      </td>
                      <td>
                        <Button
                          variant="outline-secondary"
                          className="btn-update"
                        >
                          <Link
                            href={"/management/tour/" + tour.tour_id}
                            className=""
                          >
                            <i
                              className="fa-solid fa-user-pen"
                              style={{ color: "black" }}
                            ></i>
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  );
                }
              })}
            </Suspense>
          </tbody>
        </Table>
      </div>
      <ChangeStatusModal
        showChangeStatusModal={showChangeStatusModal}
        setShowChangeStatusModal={setShowChangeStatusModal}
        statusObject={statusObject}
        detail={detail}
        api={apiChangeStatus}
        objectError={TourErrorCode}
        handleChangeStatusState={handleChangeStatusState}
      />
      <TourCreateModal
        showTourModal={showTourModal}
        setShowTourModal={setShowTourModal}
        fetchTours={fetchGetTours}
      />
      <PaginationTable
        numberPages={numberPages}
        currentPage={Number(currentPage)}
      />
    </>
  );
};

export default TourTable;
