export const defaultITourTimeRequest: ITourTimeRequest = {
  time_name: "",
  departure_time: "",
  return_time: "",
  departure_date: "",
  return_date: "",
  visa_expire: "",
  quantity: 0,
  quantity_reserve: 0,
  quantity_sell: 0,
  quantity_left: 0,
  price_min: 0,
  commission: 0,
  departure_airline_id: 0,
  return_airline_id: 0,
};

export const defaultICategoryResponse: ICategoryResponse = {
  category_id: 0,
  category_name: "",
  category_detail: "",
  url: "",
  status: 0,
};

export const defaultRelatioshipResponse: ICustomerResponse = {
  customer_id: null,
  customer_name: "",
  status: 0,
  sex: 0,
  relationship_name: "",
  phone_number: "",
  email: "",
  address: "",
  birthday: "",
  visa_expire: "",
  time: "",
};

export const defaultIAirlineResponse: IAirlineResponse = {
  airline_id: 0,
  airline_name: "",
  airline_detail: "",
  status: 0,
};

export const defaultITourTimeDetailResponse: ITourTimeDetailResponse = {
  tour_time_id: 0,
  time_name: "",
  departure_time: "",
  departure_date: "",
  return_time: "",
  return_date: "",
  visa_expire: "",
  quantity: 0,
  quantity_reserve: 0,
  quantity_sell: 0,
  quantity_left: 0,
  price_min: 0,
  commission: 0,
  departureAirline: defaultIAirlineResponse,
  returnAirline: defaultIAirlineResponse,
  status: 0,
};

export const defaultITourDetailResponse: ITourDetailResponse = {
  tour_id: 0,
  tour_name: "",
  tour_detail: "",
  status: 0,
  category_id: 0,
  category_name: "",
  tourTimes: [defaultITourTimeDetailResponse],
  url: "",
};

export const defaultICustomerResponse: ICustomerResponse = {
  customer_id: 0,
  customer_name: "",
  sex: 0,
  relationship_name: "",
  phone_number: "",
  email: "",
  address: "",
  birthday: "",
  visa_expire: "",
  time: "",
  status: 0,
};

export const defaultICustomerDetailResponse: ICustomerDetailResponse = {
  customer_id: 0,
  customer_name: "",
  email: "",
  phone_number: "",
  time: "",
  status: 0,
  sex: 0,
  relationship_name: "",
  address: "",
  birthday: "",
  visa_expire: "",
  customerParent: defaultICustomerResponse,
  customerGroup: [defaultICustomerResponse],
};

export const defaultIEmployeeResponse: IEmployeeResponse = {
  employee_id: 0,
  employee_name: "",
  birthday: "",
  total_commission: 0,
  total_sales: 0,
  status: 0,
};

export const defaultIPermissionResponse: IPermissionResponse = {
  permission_id: "",
  permission_name: "",
  status: 0,
};

export const defaultIRoleResponse: IRoleResponse = {
  role_id: 0,
  role_name: "",
  status: 0,
  permissions: [defaultIPermissionResponse],
};

export const defaultIGetAccountResponse: IGetAccountResponse = {
  account_id: "",
  account_name: "",
  email: "",
  phone_number: "",
  time: "",
  status: 0,
  employee: defaultIEmployeeResponse,
  role: defaultIRoleResponse,
};
export const defaultIDataReportInYearEmployee: IDataReportInYearEmployee = {
  employeeName: "",
  months:[0],
  total: 0,
};
export const defaultIDataReportInMonth: IDataReportInMonth = {
  days:[0],
  total:0,
  month:"",
  year:"",
};
