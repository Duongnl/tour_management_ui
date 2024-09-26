import cookie from "js-cookie";

export const fetchGetTour = async (
  tourId: string
): Promise<ITourDetailResponse> => {
  let url = `http://localhost:8080/api/tour/${tourId}`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetCustomer = async (
  customerId: string
): Promise<ICustomerDetailResponse> => {
  let url = `http://localhost:8080/api/customer/${customerId}`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetParents = async (): Promise<ICustomerResponse[]> => {
  let url = `http://localhost:8080/api/customer/parent`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetTours = async (
  status?: number
): Promise<ITourResponse[]> => {
  let url = `http://localhost:8080/api/tour`;
  switch (status) {
    case 0:
      url = `http://localhost:8080/api/tour/locked`;
      break;
    case 1:
      url = `http://localhost:8080/api/tour/active`;
      break;
    default:
      url = `http://localhost:8080/api/tour`;
  }

  return fetchGetAuthorizedData(url);
};

export const fetchGetCategories = async (
  status?: number
): Promise<ICategoryResponse[]> => {
  let url = `http://localhost:8080/api/category`;
  switch (status) {
    case 0:
      url = `http://localhost:8080/api/category/locked`;
      break;
    case 1:
      url = `http://localhost:8080/api/category/active`;
      break;
    default:
      url = `http://localhost:8080/api/category`;
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetCustomers = async (
  status?: number
): Promise<ICustomerResponse[]> => {
  let url = `http://localhost:8080/api/customer`;
  switch (status) {
    case 0:
      url = `http://localhost:8080/api/customer/locked`;
      break;
    case 1:
      url = `http://localhost:8080/api/customer/active`;
      break;
    default:
      url = `http://localhost:8080/api/customer`;
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetAirlines = async (
  status?: number
): Promise<IAirlineResponse[]> => {
  let url = `http://localhost:8080/api/airline`;
  switch (status) {
    case 0:
      url = `http://localhost:8080/api/airline/locked`;
      break;
    case 1:
      url = `http://localhost:8080/api/airline/active`;
      break;
    default:
      url = `http://localhost:8080/api/airline`;
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetToursCategory = async (
  category_id: string,
  status?: number
): Promise<ITourResponse[]> => {
  let url = `http://localhost:8080/api/tour/category/${category_id}`;
  switch (status) {
    case 0:
      url = `http://localhost:8080/api/tour/category/${category_id}/locked`;
      break;
    case 1:
      url = `http://localhost:8080/api/tour/category/${category_id}/active`;
      break;
    default:
      url = `http://localhost:8080/api/tour/category/${category_id}`;
  }
  return fetchGetAuthorizedData(url);
};

const fetchGetAuthorizedData = async (url: string): Promise<any> => {
  try {
    const res = await fetch(url, {
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
    const res = await fetch(url, {
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
  const url = "http://localhost:8080/api/tour";
  return fetchPostAuthorizedData(url, newData);
};

export const fetchPostCustomer = async (
  newData: ICustomerRequest
): Promise<any> => {
  const url = "http://localhost:8080/api/customer";
  return fetchPostAuthorizedData(url, newData);
};

export const fetchPostTourTime = async (
  tourId: string,
  newTourData: ITourTimeRequest
): Promise<any> => {
  const url = `http://localhost:8080/api/tour/${tourId}`;
  return fetchPostAuthorizedData(url, newTourData);
};

const fetchPutAuthorizedData = async (
  url: string,
  bodyData: any
): Promise<any> => {
  try {
    const res = await fetch(url, {
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
  const url = `http://localhost:8080/api/customer/${customerId}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutTour = async (
  tourId: string,
  updateData: ITourUpdateRequest
): Promise<any> => {
  const url = `http://localhost:8080/api/tour/${tourId}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutEmployee = async (
  slug: string,
  updateData: IEmployeeRequest
): Promise<any> => {
  const url = `http://localhost:8080/api/account/employee/${slug}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutAccount = async (
  slug: string,
  updateData: IAccountUpdateRequest
): Promise<any> => {
  const url = `http://localhost:8080/api/account/${slug}`;
  return fetchPutAuthorizedData(url, updateData);
};

export const fetchPutTourTime = async (
  tourId: string,
  tourTimeId: string,
  updateData: ITourTimeRequest
): Promise<any> => {
  const url = `http://localhost:8080/api/tour/${tourId}/${tourTimeId}`;
  return fetchPutAuthorizedData(url, updateData);
};
