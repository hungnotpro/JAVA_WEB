import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Spinner from '../components/Spinner';

/**
 * Trang xử lý callback từ Google OAuth
 * Nhận token từ URL và chuyển hướng người dùng đến trang dashboard
 */
const GoogleAuthCallbackPage = () => {
  const [error, setError] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Lấy token từ URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        // Nếu không có token, kiểm tra code từ Google
        const code = params.get('code');
        
        console.log('Callback received:', { token, code });
        
        if (token) {
          // Đăng nhập bằng token nếu có
          await loginWithGoogle(token);
          navigate('/student/dashboard');
        } else if (code) {
          // Nếu có code nhưng không có token, gửi code này đến backend
          // để đổi lấy token (thường được xử lý bởi backend)
          console.log('Received authorization code:', code);
          
          // Ở đây tạm thời chuyển hướng đến trang dashboard
          // Trong thực tế, bạn cần gửi code này đến backend để nhận token
          navigate('/student/dashboard');
        } else {
          // Nếu không có cả token và code, hiển thị lỗi
          setError('Không nhận được token xác thực từ Google');
        }
      } catch (error) {
        console.error('Authentication error:', error);
        setError(error.message || 'Lỗi xác thực. Vui lòng thử lại.');
      }
    };

    handleCallback();
  }, [location, navigate, loginWithGoogle]);

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

export default GoogleAuthCallbackPage;