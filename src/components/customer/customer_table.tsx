"use client";
import Table from "react-bootstrap/Table";
import "@/styles/customer.css";
import { Button, InputGroup } from "react-bootstrap";
import { useEffect, useState } from "react";
import cookie from "js-cookie";
import Form from "react-bootstrap/Form";
import ChangeStatusModal from "../change_status_modal";
import CustomerCreateModal from "./customer_create_modal";
import Link from "next/link";
import { formatDateHour } from "@/utils/dateUtils";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { CreateSlug } from "@/utils/create_slug";
import CustomerErrorCode from "@/exception/customer_error_code";
import PaginationTable from "../pagination";
interface IProps {
  customers: ICustomerResponse[];
}

const CustomerTable = (props: IProps) => {
  const [customers, setCustomers] = useState(props.customers);
  const [showChangeStatusModal, setShowChangeStatusModal] =
    useState<boolean>(false);
  const [showCustomerModal, setShowCustomerModal] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const [customersCopy, setCustomersCopy] =
    useState<ICustomerResponse[]>(customers);

  const [apiChangeStatus, setApiChangeStatus] = useState<string>("");
  const [customer_id, setCustomer_id] = useState<number | null>(null);
  const [statusObject, setStatusObject] = useState<number>(0);

  const currentPage = searchParams.get("page");
  const status = searchParams.get("status");
  const router = useRouter();
  const pathname = usePathname();

  const [numberPages, setNumberPages] = useState<number>(
    Math.ceil(customers != undefined ? customers.length / 8 : 0)
  );
  const [numberStart, setNumberStart] = useState<number>(0);
  const [numberEnd, setNumberEnd] = useState<number>(0);
  const [search, setSearch] = useState<string>("");

  const [detail, setDetail] = useState<string>("");

  useEffect(() => {
    if (status == "active") {
      fetchActiveCustomers();
    } else if (status == "locked") {
      fetchLockedCustomers();
    } else if (status == "all") {
      fetchCustomers();
    }
    console.log("vao status");
  }, [status]);

  useEffect(() => {
    let start = 1;
    let end = 8;

    for (let i = 1; i < Number(currentPage); i++) {
      start += 8;
      end += 8;
    }

    setNumberStart(start); // khi useEffect kết thúc thì mới lên lịch cập nhật biến vào number start
    setNumberEnd(end); // nên không nên cập nhật liên tục để dựa vào biến number để tính toán ngay trong useEffect
    console.log("vao status");
  }, [currentPage]);

  const fetchCustomers = async () => {
    const res = await fetch("http://localhost:8080/api/customer", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
    });
    const data = await res.json();
    const customers: ICustomerResponse[] = data.result;
    setCustomers(customers);
    const numPages = Math.ceil(
      customers != undefined ? customers.length / 8 : 0
    );
    setNumberPages(numPages);
    setCustomersCopy(customers);
  };

  const fetchLockedCustomers = async () => {
    const res = await fetch("http://localhost:8080/api/customer/locked", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
    });
    const data = await res.json();
    const customers: ICustomerResponse[] = data.result;
    setCustomers(customers);
    const numPages = Math.ceil(
      customers != undefined ? customers.length / 8 : 0
    );
    setNumberPages(numPages);
    setCustomersCopy(customers);
  };

  const fetchActiveCustomers = async () => {
    const res = await fetch("http://localhost:8080/api/customer/active", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
    });
    const data = await res.json();
    const customers: ICustomerResponse[] = data.result;
    setCustomers(customers);
    const numPages = Math.ceil(
      customers != undefined ? customers.length / 8 : 0
    );
    setNumberPages(numPages);
    setCustomersCopy(customers);
  };

  const handleChangeStatus = async (customer: ICustomerResponse) => {
    setCustomer_id(customer.customer_id);

    setStatusObject(customer.status);
    setShowChangeStatusModal(true);
    setApiChangeStatus(
      `http://localhost:8080/api/customer/change-status/${
        customer.customer_name + "-" + customer.customer_id
      }`
    );
    if (customer.status == 1) {
      setDetail(`Bạn có muốn khóa tài khoản ${customer.customer_name} không ?`);
    } else {
      setDetail(
        `Bạn có muốn mở khóa tài khoản ${customer.customer_name} không ?`
      );
    }
  };

  const handleCreate = () => {
    setShowCustomerModal(true);
  };

  const handleSelectStatus = (e: string) => {
    router.push(`${pathname}?status=${e}`);
  };

  const handleSearch = (e: string) => {
    router.push(`${pathname}?${status != null ? `status=${status}` : ""}`);
    setSearch(e);
    const filteredData = customersCopy.filter((item) => {
      return Object.values(item).some((value) => {
        // Kiểm tra nếu value không phải là null hoặc undefined
        return (
          value != null &&
          value.toString().toLowerCase().includes(e.toLowerCase())
        );
      });
    });
    console.log("filter data : ", filteredData);
    setCustomers(filteredData);
    setNumberPages(Math.ceil(filteredData.length / 8));
  };

  const handleChangeStatusState = () => {
    setCustomers(
      customers.map((a) =>
        a.customer_id === customer_id
          ? { ...a, status: a.status === 1 ? 0 : 1 }
          : a
      )
    );
    setCustomersCopy(
      customersCopy.map((a) =>
        a.customer_id === customer_id
          ? { ...a, status: a.status === 1 ? 0 : 1 }
          : a
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
          Thêm khách hàng
        </Button>
      </div>

      <Table striped bordered hover className="table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên khách hàng</th>
            <th>Số điện thoại</th>
            <th>Thời gian tạo</th>
            <th>Ngày sinh</th>
            <th>Khóa</th>
            <th>Chi tiết</th>
          </tr>
        </thead>
        <tbody>
          {customers?.map((customer, index) => {
            if (index + 1 >= numberStart && index + 1 <= numberEnd) {
              return (
                <tr key={customer.customer_id}>
                  <td>{index + 1}</td>
                  <td>{customer.customer_name}</td>
                  <td>{customer.phone_number}</td>
                  <td>{formatDateHour(customer.time)}</td>
                  <td>{formatDateHour(customer.birthday)}</td>
                  <td>
                    <Form.Check
                      className="check-active"
                      checked={customer.status == 1}
                      onChange={() => handleChangeStatus(customer)}
                      type="switch"
                      id="custom-switch"
                    />
                  </td>
                  <td>
                    <Button variant="outline-secondary" className="btn-update">
                      <Link
                        href={
                          "/management/customer/" +
                          CreateSlug(
                            `${customer.customer_name} ${customer.customer_id}`
                          )
                        }
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
        </tbody>
      </Table>
      <ChangeStatusModal
        showChangeStatusModal={showChangeStatusModal}
        setShowChangeStatusModal={setShowChangeStatusModal}
        statusObject={statusObject}
        detail={detail}
        api={apiChangeStatus}
        objectError={CustomerErrorCode}
        handleChangeStatusState={handleChangeStatusState}
      />
      <CustomerCreateModal
        showCustomerModal={showCustomerModal}
        setShowCustomerModal={setShowCustomerModal}
        fetchCustomers={fetchCustomers}
      />
      <PaginationTable
        numberPages={numberPages}
        currentPage={Number(currentPage)}
      />
    </>
  );
};

export default CustomerTable;
