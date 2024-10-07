import { getSessionId } from "@/utils/session_store";

const BASE_URL = process.env.NEXT_PUBLIC_URL_API_LOCALHOST;

export const fetchGetTour = async (tourId: number) => {
  let url = `/tour/${tourId}`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetTours = async (
  status?: number
): Promise<ITourResponse[]> => {
  let url = `/tour`;
  switch (status) {
    case 0:
      url = `/tour/locked`;
      break;
    case 1:
      url = `/tour/active`;
      break;
    default:
      url = `/tour`;
  }

  return fetchGetAuthorizedData(url);
};

export const fetchGetCategories = async (
  status?: number
): Promise<ICategoryResponse[]> => {
  let url = `/category`;
  switch (status) {
    case 0:
      url = `/category/locked`;
      break;
    case 1:
      url = `/category/active`;
      break;
    default:
      url = `/category`;
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetAccount = async (): Promise<any> => {
  let url = `/account/my-info`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetCustomers = async (
  status?: number
): Promise<ICustomerResponse[]> => {
  let url = `/customer`;
  switch (status) {
    case 0:
      url = `/customer/locked`;
      break;
    case 1:
      url = `/customer/active`;
      break;
    default:
      url = `/customer`;
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetDataSale = async (): Promise<IDataReportInMonth[]> => {
  let url = `/overview/sale`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetDataCommission = async (): Promise<
  IDataReportInMonth[]
> => {
  let url = `/overview/commission`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetReportSale = async (): Promise<
  IDataReportInYearEmployee[]
> => {
  let url = `/overview/report/sale`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetReportCommission = async (): Promise<
  IDataReportInYearEmployee[]
> => {
  let url = `/overview/report/commission`;
  return fetchGetAuthorizedData(url);
};

const fetchGetAuthorizedData = async (url: string) => {
  const res = await fetch(BASE_URL + url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSessionId()}`,
    },
  });

  const data = await res.json();
  return data.result;
};
