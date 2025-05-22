// Giả lập API kiểm tra email để tránh lỗi CORS
// Đây là giải pháp tạm thời cho đến khi backend được cấu hình đúng
const checkEmailLocal = (email) => {
  return new Promise((resolve) => {
    // Giả lập độ trễ của server
    setTimeout(() => {
      // Kiểm tra email theo quy tắc:
      // - Email có chứa "@student" được xem là đã tồn tại
      // - Các email khác được xem là chưa tồn tại
      const exists = email.includes('@student');
      resolve({ data: { exists } });
    }, 800);
  });
};

export default checkEmailLocal;