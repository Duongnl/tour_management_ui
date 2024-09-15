import { getSessionId } from "@/utils/session_store";

const BASE_URL = "http://localhost:8080/api";

export const fetchGetTour = async (tourId: number) => {
  let url = `${BASE_URL}/tour/${tourId}`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetTours = async (status?: number): Promise<ITourResponse[]> => {
  let url = `${BASE_URL}/tour`;
  switch (status) {
    case 0:
      url = `${BASE_URL}/tour/locked`;
      break;
    case 1:
      url = `${BASE_URL}/tour/active`;
      break;
    default:
      url = `${BASE_URL}/tour`;
  }

  return fetchGetAuthorizedData(url);
};

export const fetchGetCategories = async (
  status?: number
): Promise<ICategoryResponse[]> => {
  let url = `${BASE_URL}/tour`;
  switch (status) {
    case 0:
      url = `${BASE_URL}/tour/locked`;
      break;
    case 1:
      url = `${BASE_URL}/tour/active`;
      break;
    default:
      url = `${BASE_URL}/tour`;
  }
  return fetchGetAuthorizedData(url);
};

export const fetchGetAccount = async (): Promise<any> => {
  let url = `${BASE_URL}/account/my-info`;
  return fetchGetAuthorizedData(url);
};

export const fetchGetCustomers = async (
  status?: number
): Promise<ICustomerResponse[]> => {
  let url = `${BASE_URL}/customer`;
  switch (status) {
    case 0:
      url = `${BASE_URL}/customer/locked`;
      break;
    case 1:
      url = `${BASE_URL}/customer/active`;
      break;
    default:
      url = `${BASE_URL}/customer`;
  }
  return fetchGetAuthorizedData(url);
};

const fetchGetAuthorizedData = async (url: string) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${getSessionId()}`,
    },
  });

  const data = await res.json();
  return data.result;
};