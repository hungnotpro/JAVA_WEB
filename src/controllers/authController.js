import authService from '../services/authService';
import UserModel from '../models/UserModel';

/**
 * Controller cho việc quản lý xác thực
 * Xử lý logic nghiệp vụ trước khi gọi services
 */
const authController = {
  /**
   * Xử lý đăng nhập Admin
   * @param {string} email Email của admin
   * @param {string} password Mật khẩu của admin
   * @returns {Promise<UserModel>} Thông tin người dùng
   */  async loginAdmin(email, password) {
    // Kiểm tra dữ liệu đầu vào
    if (!email || !email.trim()) {
      throw new Error('Email không được để trống');
    }

    if (!password || password.length < 6) {
      throw new Error('Mật khẩu phải có ít nhất 6 ký tự');
    }

    try {
      // Gọi service để xác thực
      const response = await authService.loginAdmin(email, password);
      
      // Kiểm tra dữ liệu phản hồi
      if (!response || !response.token || !response.user) {
        throw new Error('Phản hồi từ máy chủ không hợp lệ');
      }
      
      // In ra console để debug
      console.log('Login response:', response);
      
      // Chuyển đổi dữ liệu thành model
      const user = UserModel.fromAPI(response.user);
      
      // Đảm bảo quyền admin
      if (!user.isAdmin()) {
        throw new Error('Tài khoản không có quyền admin');
      }

      return {
        user,
        token: response.token
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Xử lý đăng nhập Sinh viên qua Google
   * @param {string} token Google ID token
   * @returns {Promise<UserModel>} Thông tin người dùng
   */  async loginWithGoogle(token) {
    if (!token) {
      throw new Error('Token không hợp lệ');
    }

    try {
      const response = await authService.loginWithGoogle(token);
      
      // Kiểm tra response từ API
      if (!response || !response.token) {
        throw new Error('Phản hồi từ máy chủ không hợp lệ');
      }
      
      // In ra console để debug
      console.log('Google login response:', response);
      
      // Nếu không có user info trong response, lấy từ token
      let userData = response.user;
      if (!userData) {
        userData = authService.getUserFromToken(response.token);
      }
      
      // Chuyển đổi dữ liệu thành model
      const user = UserModel.fromAPI(userData);
      
      return {
        user,
        token: response.token
      };
    } catch (error) {
      console.error('Google login error:', error);
      throw error;
    }
  }
};

export default authController;