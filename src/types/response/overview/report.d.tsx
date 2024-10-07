interface IDataReportInYearEmployee {
  employeeName: string;
  total: number;
  months: number[];
}

interface IDataReportInMonth {
  days: number[];
  total: number;
  month: string;
  year: string;
}