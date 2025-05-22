import apiClient from '../utils/apiClient';
import { parseJwtToken } from '../utils/jwtUtils';

const API_URL = 'http://localhost:8080/api';

// Authentication services
export const authService = {
  // Admin login with email and password
  loginAdmin: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      
      console.log('API response:', response.data);
      
      // Xử lý cấu trúc phản hồi: { code: 1000, result: { token, authenticated } }
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        const token = response.data.result.token;
        
        // Giải mã JWT để lấy thông tin user
        const tokenPayload = parseJwtToken(token);
        console.log('Token payload:', tokenPayload);
        
        // Tạo thông tin user từ JWT payload
        const user = {
          email: tokenPayload.email || email,
          role: tokenPayload.scope || 'ADMIN',
          name: tokenPayload.name || email.split('@')[0]
        };
        
        return {
          token: token,
          user: user
        };
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Student login with Google token
  loginWithGoogle: async (token) => {
    try {
      const response = await apiClient.post('/auth/google-login', {
        token
      });
      
      console.log('Google login response:', response.data);
      
      // Xử lý cấu trúc phản hồi: { code: 1000, result: { token, authenticated } }
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        const accessToken = response.data.result.token;
        
        // Giải mã JWT để lấy thông tin user
        const tokenPayload = parseJwtToken(accessToken);
        
        // Tạo thông tin user từ JWT payload
        const user = {
          email: tokenPayload.email,
          role: tokenPayload.scope || 'SINH_VIEN', // Đặt role mặc định là SINH_VIEN
          name: tokenPayload.name || (tokenPayload.email ? tokenPayload.email.split('@')[0] : 'Student')
        };
        
        return {
          token: accessToken,
          user: user
        };
      }
      
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Log out and clear storage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    if (user) {
      return JSON.parse(user);
    }
    
    // Nếu không có user trong localStorage nhưng có token, lấy từ token
    const token = localStorage.getItem('token');
    if (token) {
      const tokenPayload = parseJwtToken(token);
      return {
        email: tokenPayload.email,
        role: tokenPayload.scope || 'SINH_VIEN',
        name: tokenPayload.email ? tokenPayload.email.split('@')[0] : 'User'
      };
    }
    
    return null;
  },

  // Lấy thông tin user từ token JWT
  getUserFromToken: (token) => {
    if (!token) return null;
    
    const tokenPayload = parseJwtToken(token);
    // Xác định role từ scope trong token
    let role = tokenPayload.scope || 'STUDENT';
    
    // Map 'scope' từ JWT sang role trong ứng dụng nếu cần
    if (role === 'ADMIN' || role === 'admin') {
      role = 'ADMIN';
    } else if (role === 'STUDENT' || role === 'student' || role === 'SINH_VIEN') {
      role = 'SINH_VIEN';
    }
    
    return {
      email: tokenPayload.email,
      role: role,
      name: tokenPayload.name || (tokenPayload.email ? tokenPayload.email.split('@')[0] : 'User')
    };
  }
};

export default authService;