import cookie from "js-cookie";

const url_api = process.env.NEXT_PUBLIC_URL_API?process.env.NEXT_PUBLIC_URL_API:process.env.NEXT_PUBLIC_URL_API_LOCALHOST;

export const fetchGetTour = async (
  tourId: string
): Promise<ITourDetailResponse> => {
  let url = `/tour/${tourId}`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetCustomer = async (
  customerId: string
): Promise<ICustomerDetailResponse> => {
  let url = `/customer/${customerId}`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetParents = async (): Promise<ICustomerResponse[]> => {
  let url = `/customer/parent`;
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
  console.log(url_api + url);

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

export const fetchGetToursCategory = async (
  category_id: string,
  status?: number
): Promise<ITourResponse[]> => {
  let url = `/tour/category/${category_id}`;
  switch (status) {
    case 0:
      url = `/tour/category/${category_id}/locked`;
      break;
    case 1:
      url = `/tour/category/${category_id}/active`;
      break;
    default:
      url = `/tour/category/${category_id}`;
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetDataSale = async (
  year?: number,
  from_month?: number,
  to_month?: number
) => {
  let url = `/overview/sale`;
  const queryParams = [];

  if (year) queryParams.push(`year=${year}`);
  if (from_month) queryParams.push(`from_month=${from_month}`);
  if (to_month) queryParams.push(`to_month=${to_month}`);

  if (queryParams.length > 0) {
    url += "?" + queryParams.join("&");
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetDataCommission = async (
  year?: number,
  from_month?: number,
  to_month?: number
) => {
  let url = `/overview/commission`;
  const queryParams = [];

  if (year) queryParams.push(`year=${year}`);
  if (from_month) queryParams.push(`from_month=${from_month}`);
  if (to_month) queryParams.push(`to_month=${to_month}`);

  if (queryParams.length > 0) {
    url += "?" + queryParams.join("&");
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetReportSale = async (
  year?: number
): Promise<IDataReportInYearEmployee[]> => {
  let url = `/overview/report/sale`;
  const queryParams = [];
  if (year) queryParams.push(`year=${year}`);
  if (queryParams.length > 0) {
    url += "?" + queryParams.join("&");
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetReportCommission = async (
  year?: number
): Promise<IDataReportInYearEmployee[]> => {
  let url = `/overview/report/commission`;
  const queryParams = [];
  if (year) queryParams.push(`year=${year}`);
  if (queryParams.length > 0) {
    url += "?" + queryParams.join("&");
  }
  return fetchGetAuthorizedData(url);
};

const fetchGetAuthorizedData = async (url: string): Promise<any> => {
  try {
    const res = await fetch(url_api + url, {
      method: "GET", // Sửa lỗi từ "fetchGET" thành "GET"
      headers: {
        Authorization: `Bearer ${cookie.get("session-id")}`, // Giả sử bạn sử dụng thư viện cookie
      },
    });

    const data = await res.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const fetchPostAuthorizedData = async (url: string, bodyData: any) => {
  try {
    const res = await fetch(url_api + url, {
      method: "POST", // Đúng phương thức POST
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json", // Đặt Content-Type là JSON
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
      body: JSON.stringify(bodyData), // Gửi dữ liệu JSON
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const fetchPostTour = async (newData: ITourRequest): Promise<any> => {
  const url = "/tour";
  return fetchPostAuthorizedData(url, newData);
};

export const fetchPostCustomer = async (
  newData: ICustomerRequest
): Promise<any> => {
  const url = "/customer";
  return fetchPostAuthorizedData(url, newData);
};

export const fetchPostTourTime = async (
  tourId: string,
  newTourData: ITourTimeRequest
): Promise<any> => {
  const url = `/tour/${tourId}`;
  return fetchPostAuthorizedData(url, newTourData);
};

const fetchPutAuthorizedData = async (
  url: string,
  bodyData: any
): Promise<any> => {
  try {
    const res = await fetch(url_api + url, {
      method: "PUT", // Đúng phương thức PUT
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json", // Đặt Content-Type là JSON
        Authorization: `Bearer ${cookie.get("session-id")}`, // Set Authorization header
      },
      body: JSON.stringify(bodyData), // Gửi dữ liệu JSON
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error in fetching:", error);
  }
};

export const fetchPutCustomer = async (
  customerId: string,
  updateData: ICustomerRequest
): Promise<any> => {
  const url = `/customer/${customerId}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutTour = async (
  tourId: string,
  updateData: ITourUpdateRequest
): Promise<any> => {
  const url = `/tour/${tourId}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutEmployee = async (
  slug: string,
  updateData: IEmployeeRequest
): Promise<any> => {
  const url = `/account/employee/${slug}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutAccount = async (
  slug: string,
  updateData: IAccountUpdateRequest
): Promise<any> => {
  const url = `/account/${slug}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutTourTime = async (
  tourId: string,
  tourTimeId: string,
  updateData: ITourTimeRequest
): Promise<any> => {
  const url = `/tour/${tourId}/${tourTimeId}`;
  return fetchPutAuthorizedData(url, updateData);
};
