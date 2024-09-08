"use client";
import Table from "react-bootstrap/Table";
import "@/styles/tour.css";
import { Button, InputGroup, Row } from "react-bootstrap";
import { Suspense, useEffect, useState } from "react";
import cookie from "js-cookie";
import Form from "react-bootstrap/Form";
import ChangeStatusModal from "../change_status_modal";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import PaginationTable from "../pagination";
import TourErrorCode from "@/exception/tour_error_code";
import TourCreateModal from "./tour_create_modal";
import Loading from "@/app/management/loading";
interface IProps {
  tours: ITourResponse[];
}

const TourTable = (props: IProps) => {
  const [tours, setTours] = useState(props.tours);
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
    if (category != null) {
      if (status) {
        if (status == "active") fetchActiveTours(category);
        if (status == "locked") fetchLockedTours(category);
        if (status == "all") fetchTours(category);
      } else fetchTours(category);
    } else {
      if (status == "active") fetchActiveTours();
      if (status == "locked") fetchLockedTours();
      if (status == "all") fetchTours();
    }
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

  const fetchTours = async (category_id?: string) => {
    const url = category_id
      ? `http://localhost:8080/api/tour/category/${category_id}`
      : "http://localhost:8080/api/tour";
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
    });
    const data = await res.json();
    const tours: ITourResponse[] = data.result;
    setTours(tours);
    const numPages = Math.ceil(tours != undefined ? tours.length / 8 : 0);
    setNumberPages(numPages);
    setToursCopy(tours);
  };

  const fetchLockedTours = async (category_id?: string) => {
    const url = category_id
      ? `http://localhost:8080/api/tour/category/${category_id}/locked`
      : "http://localhost:8080/api/tour/locked";
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
    });
    const data = await res.json();
    const tours: ITourResponse[] = data.result;
    setTours(tours);
    const numPages = Math.ceil(tours != undefined ? tours.length / 8 : 0);
    setNumberPages(numPages);
    setToursCopy(tours);
  };

  const fetchActiveTours = async (category_id?: string) => {
    const url = category_id
      ? `http://localhost:8080/api/tour/category/${category_id}/active`
      : "http://localhost:8080/api/tour/active";
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
    });
    const data = await res.json();
    const tours: ITourResponse[] = data.result;
    setTours(tours);
    const numPages = Math.ceil(tours != undefined ? tours.length / 8 : 0);
    setNumberPages(numPages);
    setToursCopy(tours);
  };

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

  const handleCategoryClick = (e: number) => {
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
      <div className="div-add">
        <div style={{ display: "flex" }}>
          <InputGroup className="input-search">
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
            className="select-status"
            value={status || ""} // Đặt giá trị hiện tại
            onChange={(e) => handleSelectStatus(e.target.value)}
          >
            <option hidden>Trạng thái</option>
            <option value="all">Tất cả</option>
            <option value="active">Đang hoạt động</option>
            <option value="locked">Đã khóa</option>
          </Form.Select>
        </div>

        <Button className="btn-add" onClick={() => handleCreate()}>
          <i
            className="fa-solid fa-user-plus"
            style={{ paddingRight: "10px" }}
          ></i>
          Thêm Tour
        </Button>
      </div>

      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên Tour</th>
            <th>Tên danh mục</th>
            <th>Mã danh mục</th>
            <th>Chi tiết</th>
            <th>Khóa</th>
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
                          handleCategoryClick(
                            tour.category_id ? tour.category_id : 0
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
                          className="link-update"
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
        fetchTours={fetchTours}
      />
      <PaginationTable
        numberPages={numberPages}
        currentPage={Number(currentPage)}
      />
    </>
  );
};

export default TourTable;
