"use client";
import { Line } from "react-chartjs-2";
import {
  ChartOptions,
} from "chart.js";
import { Button, Form } from "react-bootstrap";
import { useEffect, useState } from "react";
import {
  fetchGetDataCommission,
  fetchGetDataSale,
} from "@/utils/serviceApiClient";
import TourErrorCode from "@/exception/tour_error_code";
import { toast } from "react-toastify";


interface Props {
  dataSales: IDataReportInMonth[];
  dataCommissions: IDataReportInMonth[];
}

const LineChart = ({
  dataSales: initialDataSale,
  dataCommissions: initialDataCommission,
}: Props) => {
  const [dataSale, setDataSale] =
    useState<IDataReportInMonth[]>(initialDataSale);
  const [dataCommission, setDataCommission] = useState<IDataReportInMonth[]>(
    initialDataCommission
  );

  const today = new Date();
  const [year, setYear] = useState<number>(today.getFullYear());
  const [from_month, setFromMonth] = useState<number>(today.getMonth() - 2);
  const [to_month, setToMonth] = useState<number>(today.getMonth() + 1);

  const generateChartData = () => {
    // if(dataSale==undefined||dataCommission==undefined)
    const labels: string[] = [];
    const salesData: number[] = [];
    const commissionData: number[] = [];

    dataSale.forEach(({ days, month, year }) => {
      days.forEach((item, index) => {
        salesData.push(item);
        labels.push(`${index + 1}/${month}/${year}`);
      });
    });

    dataCommission.forEach(({ days }) => {
      days.forEach((item) => commissionData.push(item));
    });

    return {
      labels,
      datasets: [
        {
          label: "Doanh số",
          data: salesData,
          borderColor: "rgba(75,192,192,1)",
          backgroundColor: "rgba(75,192,192,0.2)",
          fill: true,
          yAxisID: "y1",
        },
        {
          label: "Hoa hồng",
          data: commissionData,
          borderColor: "#f56868",
          fill: true,
          yAxisID: "y2",
        },
      ],
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    legend: {
      display: true,
      position: 'top' as const,
    },
    title: {
      display: true,
      text: 'Doanh thu và Hoa hồng',
    },
    scales: {
      xAxes: [{
        type: 'category',
        ticks: {
          autoSkip: true,
          maxTicksLimit: 12,
        },
      }],
      yAxes: [{
        id: "y1",
        type: 'linear',
        position: 'left',
      }, {
        id: "y2",
        type: 'linear',
        position: 'right',
        gridLines: {
          display: false,
        },
      }],
    },
  };
  

  const fetchData = async () => {
    if (from_month > to_month) {
      toast.error(`Lỗi Tháng`);
    } else {
      const [sales, commissions] = await Promise.all([
        fetchGetDataSale(year, from_month, to_month),
        fetchGetDataCommission(year, from_month, to_month),
      ]);
      setDataSale(sales);
      setDataCommission(commissions);
    }
  };

  return (
    <>
      <div className="d-flex justify-content-start mb-3">
        <Form.Select
          aria-label="Chọn năm"
          className="mx-2 "
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 5 }, (_, i) => (
            <option key={i} value={year + i - 2}>
              {year + i - 2}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          aria-label="Tháng bắt đầu"
          className="mx-2"
          value={from_month}
          onChange={(e) => setFromMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {"Từ tháng " + Number(i + 1)}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          aria-label="Tháng kết thúc"
          className="mx-2"
          value={to_month}
          onChange={(e) => setToMonth(Number(e.target.value))}
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i + 1}>
              {"Đến hết tháng " + Number(i + 1)}
            </option>
          ))}
        </Form.Select>
        <Button onClick={fetchData}>Lọc</Button>
      </div>
      <Line data={generateChartData()} options={options} redraw />
    </>
  );
};

export default LineChart;
