// Hàm xử lý đăng nhập đã cập nhật
// Sửa lỗi khi token được truyền vào trường email

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';

/**
 * Component Hook cho đăng nhập sinh viên
 * @returns {Object} - Các phương thức và state cho đăng nhập 
 */
export const useStudentLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  /**
   * Hàm xử lý đăng nhập sửa lỗi
   * @param {Event} e - Form submit event
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    
    try {
      console.log('Đăng nhập với email:', email);
      
      // Gọi trực tiếp authService
      const result = await authService.loginAdmin(email, password);
      
      if (result && result.token) {
        console.log('Đăng nhập thành công!');
        setSuccess(true);
        
        // Lưu thông tin đăng nhập
        localStorage.setItem('token', result.token);
        if (result.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
        }
        
        // Chuyển hướng sang trang chính
        setTimeout(() => {
          navigate('/student/dashboard');
        }, 500);
      } else {
        setError('Đăng nhập thất bại, không nhận được token');
      }
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };
  
  return {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    error,
    success,
    handleLogin
  };
};

export default useStudentLogin;