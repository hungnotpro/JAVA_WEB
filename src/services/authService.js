import apiClient from '../utils/apiClient';
import UserModel from '../models/UserModel';

// Hàm phân tích JWT để lấy thông tin người dùng
const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error parsing JWT:', e);
    return {};
  }
};

// Kiểm tra token đã hết hạn chưa
const isTokenExpired = (token) => {
  try {
    const decoded = parseJwt(token);
    return decoded.exp < Date.now() / 1000;
  } catch (e) {
    return true;
  }
};

// Authentication services
export const authService = {
  // Admin login with email and password
  loginAdmin: async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        const token = response.data.result.token;
        localStorage.setItem('token', token);
        
        // Lấy thông tin user từ token
        const payload = parseJwt(token);
        const user = {
          email: payload.email,
          role: payload.scope,
          name: payload.sub
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Student login with Google token
  loginWithGoogle: async (token) => {
    try {
      const response = await apiClient.post('/auth/google', { token });
      
      if (response.data && response.data.code === 1000 && response.data.result && response.data.result.token) {
        const authToken = response.data.result.token;
        localStorage.setItem('token', authToken);
        
        // Lấy thông tin user từ token
        const payload = parseJwt(authToken);
        const user = {
          email: payload.email,
          role: payload.scope || 'SINH_VIEN',
          name: payload.name || payload.sub
        };
        
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      }
      
      throw new Error('Google login failed');
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  },

  // Log out and clear storage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    return !!token && !isTokenExpired(token);
  },

  // Get current user from localStorage
  getCurrentUser: () => {
    try {
      const userJson = localStorage.getItem('user');
      if (!userJson) return null;
      
      const userData = JSON.parse(userJson);
      return new UserModel(userData);
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Extract user info from JWT token
  getUserFromToken: (token) => {
    try {
      const payload = parseJwt(token);
      return {
        email: payload.email,
        role: payload.scope,
        name: payload.sub
      };
    } catch (error) {
      console.error('Error extracting user from token:', error);
      return null;
    }
  }
};

export default authService;