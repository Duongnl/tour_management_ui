import BarChart from "@/components/overview/bar_char";
import LineChart from "@/components/overview/line_chart";
import TableReport from "@/components/overview/table_report";
import {
  fetchGetDataCommission,
  fetchGetDataSale,
  fetchGetReportCommission,
  fetchGetReportSale,
} from "@/utils/serviceApiServer";
import "@/styles/overview.css"
import { Container, Row } from "react-bootstrap";


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
          <div className="col col-md-6">
            <BarChart
              title="Hoa hồng"
              data={reportCommissions}
              option={1}
            />
          </div>
          <div className="col col-md-6">
            <BarChart
              title="Doanh thu"
              data={reportSales}
              color={"#f56868"}
              option={1}
            />
          </div>
        </div>
        <div className="table-wrapper">
          <TableReport
            dataCommissions={reportCommissions}
            dataSales={reportSales}
          />
        </div>
        <LineChart dataSales={sales} dataCommissions={commissions} />
      </Container>
    );
  } catch (error) {
    console.error(error);
    return <div>Error fetching data</div>;
  }
};

export default Home;
