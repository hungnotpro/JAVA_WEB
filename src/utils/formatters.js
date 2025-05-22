/**
 * Định dạng ngày tháng từ chuỗi ISO hoặc đối tượng Date
 * @param {string|Date} date - Ngày cần định dạng
 * @param {object} options - Tùy chọn định dạng
 * @returns {string} - Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  // Kiểm tra xem Date có hợp lệ không
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  // Các tùy chọn mặc định
  const defaultOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  };
  
  try {
    return new Intl.DateTimeFormat('vi-VN', defaultOptions).format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Định dạng số tiền
 * @param {number} amount - Số tiền cần định dạng
 * @param {string} currency - Loại tiền tệ (mặc định: VND)
 * @returns {string} - Chuỗi số tiền đã định dạng
 */
export const formatCurrency = (amount, currency = 'VND') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return '';
  }
};

/**
 * Rút gọn văn bản nếu quá dài
 * @param {string} text - Văn bản cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} - Văn bản đã rút gọn
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  
  if (text.length <= maxLength) {
    return text;
  }
  
  return text.substring(0, maxLength) + '...';
};