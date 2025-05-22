import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import Header from '../components/Header';
import { redirectToGoogleLogin } from '../utils/OAuth2Config';

const StudentLoginPage = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    // Không cần khởi tạo Google Sign-In API
    // Vì chúng ta đang sử dụng OAuth2 redirect flow từ Spring Boot
  }, []);
  
  // Hàm xử lý sự kiện khi người dùng nhấn nút đăng nhập Google
  const handleGoogleLogin = () => {
    setError('');
    setLoading(true);
    
    try {
      // Chuyển hướng trực tiếp đến trang đăng nhập Google
      redirectToGoogleLogin();
    } catch (error) {
      console.error('Google login error:', error);
      setError('Không thể kết nối đến dịch vụ đăng nhập Google. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Đăng nhập Sinh viên
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sử dụng tài khoản Google của trường
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
              <div className="flex flex-col items-center space-y-6">
              <p className="text-sm text-gray-600">
                Vui lòng đăng nhập bằng tài khoản Google
              </p>
              
              {/* Google Sign-In Button */}
              <button
                onClick={handleGoogleLogin}
                disabled={loading}
                className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <img
                  className="h-5 w-5 mr-2"
                  src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                  alt="Google logo"
                />
                Đăng nhập với Google
              </button>
              
              {loading && (
                <div className="text-center">
                  <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-2 text-sm text-gray-500">Đang chuyển hướng đến đăng nhập Google...</p>
                </div>
              )}
              
              <div className="relative w-full">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Hoặc
                  </span>
                </div>
              </div>
              
              <Link to="/admin/login" className="w-full">
                <Button variant="secondary" fullWidth>
                  Đăng nhập dành cho Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentLoginPage;