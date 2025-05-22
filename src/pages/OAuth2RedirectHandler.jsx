import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';

/**
 * Component xử lý chuyển hướng sau khi đăng nhập OAuth2 thành công
 * URL dự kiến: /oauth2/redirect?token=xxx
 */
const OAuth2RedirectHandler = () => {
  const [error, setError] = useState(null);
  const [processed, setProcessed] = useState(false); // Thêm biến trạng thái đã xử lý
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    // Nếu đã xử lý token, không làm gì thêm
    if (processed) return;
    
    // Lấy token từ query parameters
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    
    // Hiển thị token để debug
    console.log('Received token from redirect:', token);
    
    if (!token) {
      setError('Không nhận được token xác thực từ server');
      return;
    }
    
    // Xử lý đăng nhập với token nhận được từ backend
    const handleLogin = async () => {
      try {
        console.log('Attempting to login with token:', token);
        // Sử dụng token để đăng nhập
        await loginWithGoogle(token);
        
        // Đánh dấu đã xử lý token
        setProcessed(true);
        
        // Sử dụng replace: true để thay thế lịch sử hiện tại thay vì thêm vào
        // Giúp tránh nút Back quay lại trang redirect
        navigate('/student/dashboard', { replace: true });
      } catch (err) {
        console.error('Error during login with token:', err);
        setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
      }
    };
    
    handleLogin();
  }, [location, navigate, loginWithGoogle, processed]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full p-6 bg-white shadow-lg rounded-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-2">Lỗi xác thực</h2>
            <p className="text-gray-700 mb-4">{error}</p>
            <button
              onClick={() => navigate('/student/login')}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Quay lại trang đăng nhập
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <Spinner size="lg" />
      <p className="mt-4 text-lg text-gray-600">Đang xử lý đăng nhập...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;