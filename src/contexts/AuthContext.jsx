import React, { createContext, useState, useEffect, useContext } from 'react';
import authService from '../services/authService';
import UserModel from '../models/UserModel';

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
      const userData = authService.getCurrentUser();
      
      if (userData) {
        // Chuyển dữ liệu thô thành instance của UserModel
        setCurrentUser(new UserModel(userData));
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  }, []);  const login = async (email, password) => {
    try {
      setError(null);
      const data = await authService.loginAdmin(email, password);
      
      // Đảm bảo dữ liệu user từ API có đúng định dạng hoặc lấy từ token
      let user;
      if (data && data.token) {
        if (data.user) {
          // Sử dụng thông tin user từ response nếu có
          user = UserModel.fromAPI(data.user);
        } else {
          // Nếu không có user trong response, lấy từ token
          const userFromToken = authService.getUserFromToken(data.token);
          user = UserModel.fromAPI(userFromToken);
        }
        
        // Lưu token và dữ liệu người dùng
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(user.toJSON()));
        
        setCurrentUser(user);
        return user;
      } else {
        throw new Error('Dữ liệu đăng nhập không hợp lệ');
      }
    } catch (error) {
      console.error('Login error in context:', error);
      setError(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  };  const loginWithGoogle = async (token) => {
    try {
      setError(null);
      
      console.log('Processing login with token:', token);
      
      // Với luồng OAuth2 của Spring Boot, chúng ta nhận trực tiếp JWT token
      // Không cần gọi API nữa vì backend đã tạo và gửi token cho chúng ta
      
      // Lấy thông tin từ token
      const userFromToken = authService.getUserFromToken(token);
      console.log('User extracted from token:', userFromToken);
      
      const user = UserModel.fromAPI(userFromToken);
      console.log('User model created:', user);
      
      // Lưu token và dữ liệu người dùng
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user.toJSON()));
      console.log('User data saved to localStorage');
      
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Google login error in context:', error);
      setError(error.message || 'Đăng nhập thất bại');
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    loginWithGoogle,
    logout,
    isAuthenticated: authService.isAuthenticated,
    error,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;