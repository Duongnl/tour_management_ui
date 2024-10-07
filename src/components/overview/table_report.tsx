"use client";
import Table from "react-bootstrap/Table";
import { Button } from "react-bootstrap";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import {
  fetchGetReportCommission,
  fetchGetReportSale,
} from "@/utils/serviceApiClient";

interface IProps {
  dataCommissions: IDataReportInYearEmployee[];
  dataSales: IDataReportInYearEmployee[];
}

const TableReport = (props: IProps) => {
  const [dataCommissions, setDataCommissions] = useState<
    IDataReportInYearEmployee[]
  >(props.dataCommissions);
  const [dataSales, setDataSales] = useState<IDataReportInYearEmployee[]>(
    props.dataSales
  );

  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());

  const fetchData = async () => {
    const [sales, commissions] = await Promise.all([
      fetchGetReportSale(year),
      fetchGetReportCommission(year),
    ]);

    setDataSales(sales);
    setDataCommissions(commissions);
  };

  // Hàm tạo danh sách năm
  const generateYearOptions = () => {
    return Array.from({ length: 5 }, (_, i) => year + i - 2);
  };

  return (
    <>
      <div className="d-flex justify-content-start mb-3">
        <Form.Select
          aria-label="Chọn năm"
          className="mx-2"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {generateYearOptions().map((yearOption, i) => (
            <option key={i} value={yearOption}>
              {yearOption}
            </option>
          ))}
        </Form.Select>
        <Button onClick={fetchData}>Lọc</Button>
      </div>
      <div className="position-relative">
      <h3>Doanh số</h3>
      <div className="table-wrapper">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Tháng 1</th>
              <th>Tháng 2</th>
              <th>Tháng 3</th>
              <th>Tháng 4</th>
              <th>Tháng 5</th>
              <th>Tháng 6</th>
              <th>Tháng 7</th>
              <th>Tháng 8</th>
              <th>Tháng 9</th>
              <th>Tháng 10</th>
              <th>Tháng 11</th>
              <th>Tháng 12</th>
              <th>Tổng cộng</th>
            </tr>
          </thead>
          <tbody>
            {dataSales?.map((dataPE, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{dataPE.employeeName}</td>
                {dataPE.months.map((monthData, i) => (
                  <td key={i}>{monthData}</td>
                ))}
                <td>{dataPE.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <h3>Hoa hồng</h3>
      <div className="table-wrapper">
        <Table striped bordered hover className="table">
          <thead>
            <tr>
              <th>STT</th>
              <th>Tên</th>
              <th>Tháng 1</th>
              <th>Tháng 2</th>
              <th>Tháng 3</th>
              <th>Tháng 4</th>
              <th>Tháng 5</th>
              <th>Tháng 6</th>
              <th>Tháng 7</th>
              <th>Tháng 8</th>
              <th>Tháng 9</th>
              <th>Tháng 10</th>
              <th>Tháng 11</th>
              <th>Tháng 12</th>
              <th>Tổng cộng</th>
            </tr>
          </thead>
          <tbody>
            {dataCommissions?.map((dataPE, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{dataPE.employeeName}</td>
                {dataPE.months.map((monthData, i) => (
                  <td key={i}>{monthData}</td>
                ))}
                <td>{dataPE.total}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      </div>
    </>
  );
};

export default TableReport;
