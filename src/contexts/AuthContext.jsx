import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import { getUserFromToken, isTokenExpired } from '../utils/jwtUtils';

// Create authentication context
const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load user from localStorage on initialization
    try {
      const token = localStorage.getItem('token');
      
      if (token && !isTokenExpired(token)) {
        const userData = localStorage.getItem('user');
        if (userData) {
          // Nếu có user data, sử dụng data đó
          setCurrentUser(JSON.parse(userData));
        } else {
          // Nếu không, lấy từ token
          const userFromToken = getUserFromToken(token);
          setCurrentUser(userFromToken);
          
          // Lưu vào localStorage để lần sau
          localStorage.setItem('user', JSON.stringify(userFromToken));
        }
      } else if (token) {
        // Token hết hạn
        console.log('Token expired, logging out');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);  // Hàm đăng nhập
  const login = async (email, password) => {
    try {
      setError(null);
      
      // Sử dụng authService để đăng nhập
      const userData = await authService.loginAdmin(email, password);
      
      // authService đã xử lý việc lưu token và user vào localStorage
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error('Login error in context:', error);
      setError(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  // Đăng nhập với Google
  const loginWithGoogle = async (token) => {
    try {
      setError(null);
      
      if (!token) {
        throw new Error('Token không hợp lệ');
      }
      
      // Xử lý token OAuth từ Google
      const userFromToken = getUserFromToken(token);
      userFromToken.role = 'SINH_VIEN'; // Đảm bảo role là SINH_VIEN
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userFromToken));
      
      setCurrentUser(userFromToken);
      return userFromToken;
    } catch (error) {
      console.error('Google login error:', error);
      setError(error.message || 'Đăng nhập Google thất bại');
      throw error;
    }
  };

  // Đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
  };

  // Kiểm tra đã đăng nhập chưa
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return !!token && !isTokenExpired(token);
  };

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;