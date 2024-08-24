enum AccountErrorCode {
    ACCOUNT_1= "Tên tài khoản đã tồn tại",
    ACCOUNT_2 = "Tài khoản không tồn tại",
    ACCOUNT_3 = "Sai mật khẩu",
    ACCOUNT_4 = "Tài khoản phải từ 5 đến 20 ký tự, chỉ chứa số, chữ, dấu . _ -",
    ACCOUNT_5 = "Mật khẩu từ 8 đến 20 ký tự, chứa ít nhất một số, chữ thường, hoa,ký tự đặc biệt",
    ACCOUNT_6 = "Tài khoản đã bị khóa",
    ACCOUNT_7 = "Email chỉ chứa chữ cái, số, dấu . _ - . , kết thúc với @example.com",
    ACCOUNT_8 = "Số điện thoại không hợp lệ",
    PERMISSION_2 = "Bạn không có quyền thao tác"
}

export default AccountErrorCode