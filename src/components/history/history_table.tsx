"use client";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import PaginationTable from "../pagination";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { InputGroup } from "react-bootstrap";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

interface IProps {
  histories: IHistoryResponse[];
}

const HistoryTable = (props: IProps) => {
  const { histories } = props;
  const searchParams = useSearchParams();
  const currentPage = searchParams.get("page");
  const status = searchParams.get("history");
  const router = useRouter();
  const pathname = usePathname();

  // search date
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const [search, setSearch] = useState<string>("");
  const [historiesFilter, setHistoriesFilter] =
    useState<IHistoryResponse[]>(histories);
  const [numberPages, setNumberPages] = useState<number>(
    Math.ceil(histories.length / 8)
  );
  const [numberStart, setNumberStart] = useState<number>(0);
  const [numberEnd, setNumberEnd] = useState<number>(0);

  useEffect(() => {
    let start = 1;
    let end = 8;

    for (let i = 1; i < Number(currentPage); i++) {
      start += 8;
      end += 8;
    }

    setNumberStart(start);
    setNumberEnd(end);
  }, [currentPage]);

  const filterHistories = () => {
    let filteredData = histories;

    // Lọc theo ngày
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Bao gồm cả ngày kết thúc

      filteredData = filteredData.filter((history) => {
        const historyDate = new Date(history.time);
        return historyDate >= start && historyDate <= end;
      });
    }

    // Lọc theo từ khóa tìm kiếm
    if (search) {
      filteredData = filteredData.filter((item) => {
        return Object.values(item).some((value) => {
          return (
            value != null &&
            value.toString().toLowerCase().includes(search.toLowerCase())
          );
        });
      });
    }

    setHistoriesFilter(filteredData);
    setNumberPages(Math.ceil(filteredData.length / 8));
  };

  useEffect(() => {
    filterHistories();
  }, [startDate, endDate, search]); // Gọi lại khi thay đổi ngày hoặc từ khóa tìm kiếm

  return (
    <>
      <div className="div-add mb-4 d-flex flex-wrap justify-content-start">
        <InputGroup className="input-search width-primary m-1 height-primary">
          <InputGroup.Text id="basic-addon1">
            <i className="fa-solid fa-magnifying-glass"></i>
          </InputGroup.Text>
          <Form.Control
            placeholder="Tìm kiếm"
            aria-describedby="basic-addon1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </InputGroup>

        <FloatingLabel
          controlId="floatingInput"
          label="Ngày Bắt Đầu"
          className=" width-primary m-1"
        >
          <Form.Control
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </FloatingLabel>

        <FloatingLabel
          controlId="floatingInput"
          label="Ngày Kết Thúc"
          className="width-primary m-1"
        >
          <Form.Control
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </FloatingLabel>
      </div>
      <div className="table-wrapper">
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên Tài Khoản </th>
              <th>Lịch sử </th>
              <th>Thời Gian</th>
              <th>Trạng Thái</th>
            </tr>
          </thead>
          <tbody>
            {historiesFilter?.map((history, index) => {
              if (index + 1 >= numberStart && index + 1 <= numberEnd) {
                return (
                  <tr key={history.history_id}>
                    <td>{index + 1}</td>
                    <td>{history.account_name}</td>
                    <td>{history.history_detail}</td>
                    <td>{history.time}</td>
                    <td>{history.status}</td>
                  </tr>
                );
              }
            })}
          </tbody>
        </Table>
        </div>
      <PaginationTable
        numberPages={numberPages}
        currentPage={Number(currentPage)}
      />
    </>
  );
};

export default HistoryTable;
