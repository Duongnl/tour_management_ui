// Chuyển đổi từ yyyy-MM-dd sang yyyy-MM-ddTHH:mm:ss.sssZ

export const parseDate = (dateString: string): string => {
    const [year, month, day] = dateString.split('-');
    const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    return date.toISOString(); // Trả về định dạng yyyy-MM-ddTHH:mm:ss.sssZ
  };
  
  // Định dạng ngày thành yyyy-MM-dd
  export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // Chỉ lấy phần yyyy-MM-dd
  };
  
    // Định dạng ngày thành yyyy-MM-dd hh:mm
    export const formatDateHour = (dateString: string): string => {
      const date = new Date(dateString);
  
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0-11, cần cộng 1
      const day = String(date.getDate()).padStart(2, '0'); // Ngày trong tháng
      const hours = String(date.getHours()).padStart(2, '0'); // Giờ trong ngày
      const minutes = String(date.getMinutes()).padStart(2, '0'); // Phút trong giờ
  
      return `${year}-${month}-${day} ${hours}:${minutes}`; // Trả về định dạng 
  };