import BarChart from "@/components/overview/bar_char";
import LineChart from "@/components/overview/line_chart";
import TableReport from "@/components/overview/table_report";
import {
  fetchGetDataCommission,
  fetchGetDataSale,
  fetchGetReportCommission,
  fetchGetReportSale,
} from "@/utils/serviceApiServer";
import { Container, Row } from "react-bootstrap";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement, // Đăng ký thêm LineElement cho biểu đồ đường
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Đăng ký tất cả các thành phần liên quan, bao gồm LinearScale và LineElement
ChartJS.register(
  CategoryScale,
  LinearScale, // Đảm bảo LinearScale đã được đăng ký
  BarElement,
  LineElement, // Đăng ký LineElement cho LineChart
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Home = async () => {
  try {
    const reportSales = await fetchGetReportSale();
    const reportCommissions = await fetchGetReportCommission();

    const sales: IDataReportInMonth[] = await fetchGetDataSale();
    const commissions = await fetchGetDataCommission();

    return (
      <Container style={{ paddingTop: "80px", marginBottom: "40px" }}>
        <h4>Tổng quan</h4>
        <div className="row">
          <div className="col col-6">
            <BarChart
              title="Hoa hồng năm 2024"
              data={reportCommissions}
              option={1}
            />
          </div>
          <div className="col col-6">
            <BarChart
              title="Doanh thu năm 2024"
              data={reportSales}
              color={"#f56868"}
              option={1}
            />
          </div>
        </div>
        <TableReport
          dataCommissions={reportCommissions}
          dataSales={reportSales}
        />
        <LineChart dataSales={sales} dataCommissions={commissions} />
      </Container>
    );
  } catch (error) {
    console.error(error);
    return <div>Error fetching data</div>;
  }
};

export default Home;
