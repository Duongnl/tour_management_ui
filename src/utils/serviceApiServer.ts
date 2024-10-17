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

export const fetchGetAccounts = async (
  status?: number
): Promise<IAccountResponse[]> => {
  let url = `/account`;
  switch (status) {
    case 0:
      url = `/account/locked`;
      break;
    case 1:
      url = `/account/active`;
      break;
    default:
      url = `/account`;
  }

  return fetchGetAuthorizedData(url);
};

export const fetchGetRoles = async (
  status?: number
): Promise<IRoleResponse[]> => {
  let url = `/role`;
  switch (status) {
    case 0:
      url = `/role/locked`;
      break;
    case 1:
      url = `/role/active`;
      break;
    default:
      url = `/role`;
  }

  return fetchGetAuthorizedData(url);
};

export const fetchGetAirlines = async (
  status?: number
): Promise<IAirlineResponse[]> => {
  let url = `/airline`;
  switch (status) {
    case 0:
      url = `/airline/locked`;
      break;
    case 1:
      url = `/airline/active`;
      break;
    default:
      url = `/airline`;
  }

  return fetchGetAuthorizedData(url);
};


export const fetchGetRole = async (
  slug?: string
): Promise<IRoleResponse> => {
  let url = `/role/${slug}`;
  
  return fetchGetAuthorizedData(url);
};

export const fetchGetReserves = async (
  status?: number
): Promise<IReserveTourResponse[]> => {
  let url = `/reserve/tour`;
  
  return fetchGetAuthorizedData(url);
};

export const fetchGetHistories = async (
  status?: number
): Promise<IHistoryResponse[]> => {
  let url = `/history/order-by-time`;
  
  return fetchGetAuthorizedData(url);
};

export const fetchGetReserve = async (
  slug?: string
): Promise<IReserveTourResponse> => {
  let url = `/reserve/${slug}`;
  
  return fetchGetAuthorizedData(url);
};

export const fetchGetBooked = async (
  slug?: string
): Promise<IReserveResponse[]> => {
  let url = `/reserve/booked/${slug}`;
  
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
