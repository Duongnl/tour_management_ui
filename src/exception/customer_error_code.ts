enum CustomerErrorCode {
    CUSTOMER_1= "Tên tài khoản đã tồn tại",
    CUSTOMER_2 = "Tài khoản không tồn tại",
    CUSTOMER_3 = "Sai mật khẩu",
    CUSTOMER_4 = "Sai định dạng tài khoản",
    CUSTOMER_5 = "Sai định dạng mật khẩu",
    CUSTOMER_6 = "Tài khoản đã bị khóa",
    CUSTOMER_7 = "Email chỉ chứa chữ cái, số, dấu . _ - . , kết thúc với @example.com",
    CUSTOMER_8 = "Số điện thoại không hợp lệ",
    CUSTOMER_9 = "Chỉ được dùng các kí tự và khoảng trắng"
    
}

export default CustomerErrorCode