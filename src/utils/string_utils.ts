export const formatCurrency = (amount: number):string => {
    return new Intl.NumberFormat('vi-VN').format(amount) + ' VND';
}

export const getCurrentLocalDateTimeString = ():string =>{
    const now = new Date();
  
    // Lấy các thành phần của thời gian
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0 nên cần +1
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
  
    // Tạo chuỗi định dạng theo kiểu LocalDateTime của Java
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }