/**
 * Hàm định dạng ngày tháng từ chuỗi ISO hoặc Date object thành định dạng dễ đọc
 * @param {string|Date} dateInput - Chuỗi thời gian ISO hoặc Date object
 * @param {boolean} includeTime - Có hiển thị giờ phút hay không
 * @returns {string} Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (dateInput, includeTime = false) => {
  if (!dateInput) return 'N/A';
  
  try {
    const date = new Date(dateInput);
    
    // Kiểm tra ngày hợp lệ
    if (isNaN(date.getTime())) {
      return 'Ngày không hợp lệ';
    }
    
    // Định dạng ngày tháng năm
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    let formattedDate = `${day}/${month}/${year}`;
    
    // Thêm giờ phút nếu cần
    if (includeTime) {
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      formattedDate += ` ${hours}:${minutes}`;
    }
    
    return formattedDate;
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'N/A';
  }
};

/**
 * Hàm định dạng số thành chuỗi có dấu phẩy ngăn cách hàng nghìn
 * @param {number} number - Số cần định dạng
 * @returns {string} Chuỗi số đã định dạng
 */
export const formatNumber = (number) => {
  if (number === null || number === undefined) return 'N/A';
  
  try {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (error) {
    console.error('Error formatting number:', error);
    return number.toString();
  }
};