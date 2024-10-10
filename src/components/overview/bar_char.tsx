"use client";
import {
  fetchGetReportCommission,
  fetchGetReportSale,
} from "@/utils/serviceApiClient";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Bar } from "react-chartjs-2";

interface Props {
  title: string;
  data: IDataReportInYearEmployee[];
  color?: string;
  option: 1 | 2;
}
const BarChart = (props: Props) => {
  const title = props.title;
  const [dataYear, setDataYear] = useState<IDataReportInYearEmployee[]>(
    props.data
  );
  const color = props.color;
  const option = props.option;

  const today = new Date();
  const [totalMonths, setTotalMonths] = useState<number[]>([0]);
  const [year, setYear] = useState<number>(today.getFullYear());

  const fetchData = async () => {
    let data: IDataReportInYearEmployee[] = [];
    if (option == 1) data = await fetchGetReportCommission(year);
    if (option == 2) data = await fetchGetReportSale(year);
    setDataYear(data);
  };

  useEffect(() => {
    let updatedTotalMonths = Array(dataYear[0]?.months.length).fill(0);
    if (dataYear.length != 0) {
      dataYear.forEach((element) => {
        for (var i = 0; i < element.months.length; i++) {
          updatedTotalMonths[i] =
            (updatedTotalMonths[i] || 0) + element.months[i]; // Đảm bảo phần tử đã tồn tại
        }
      });
    }
    setTotalMonths(updatedTotalMonths);
  }, [dataYear]);

  const data = {
    labels: [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ],
    datasets: [
      {
        label: title + " (VNĐ)",
        data: totalMonths,
        backgroundColor: color != null ? color : "rgba(75, 192, 192, 1)",
        borderColor: color != null ? color : "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      yAxes: [
        {
          type: "linear",
          beginAtZero: true,
        },
      ],
    },
  };

  return (
    <>
      <div className="mb-4 d-flex flex-wrap justify-content-start">
        <Form.Select
          aria-label="Chọn năm"
          className="width-primary m-1"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={year + i - 2}>
              {year + i - 2}
            </option>
          ))}
        </Form.Select>
        <Button className="width-primary m-1" onClick={fetchData}>Lọc</Button>
      </div>
      <Bar data={data} options={options} />
    </>
  );
};

export default BarChart;
