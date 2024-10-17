enum AirlineErrorCode {
    PERMISSION_2 = "Bạn không có quyền thao tác",
    AIRLINE_1 = "Tên chuyến bay không được để trống",
    AIRLINE_2 = "Departure time thời gian bay không được để trống",
    AIRLINE_3 = "Thời gian về không được để trống",
    AIRLINE_4 = "Chuyến bay không được tìm thấy",
    AIRLINE_5 = "Thời gian bay phải trước thời gian về",
    AIRLINE_6 = "Tên chuyến bay chỉ chứa chữ, số và , . -",
    AIRLINE_7 = "Chi tiết chuyến bay chỉ chứa chữ, số và , . -",
    AIRLINE_8= "Chuyến bay này đang được sử dụng không thể tắt"
}

export default AirlineErrorCode