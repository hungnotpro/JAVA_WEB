import axios from 'axios';

// Tạo một instance của axios với cấu hình mặc định
const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Thiết lập timeout để tránh chờ quá lâu
  timeout: 10000,
  // Cho phép gửi cookie trong các request cross-origin
  withCredentials: true
});

// Thêm interceptor xử lý lỗi
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    
    // Xử lý các lỗi cụ thể
    if (error.response) {
      // Server trả về lỗi với status code
      console.log('Error data:', error.response.data);
      console.log('Error status:', error.response.status);
      console.log('Error headers:', error.response.headers);
    } else if (error.request) {
      // Không nhận được phản hồi
      console.log('No response received:', error.request);
    } else {
      // Lỗi khi thiết lập request
      console.log('Request error:', error.message);
    }
    
    // Tiếp tục truyền lỗi đến component
    return Promise.reject(error);
  }
);

// Thêm interceptor xử lý request
apiClient.interceptors.request.use(
  config => {
    // Lấy token từ localStorage nếu có
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log request cho việc debug
    console.log('Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default apiClient;