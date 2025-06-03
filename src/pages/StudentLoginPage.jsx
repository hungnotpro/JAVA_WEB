import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import useAuth from '../hooks/useAuth';
import Button from '../components/Button';
import Header from '../components/Header';
import { redirectToGoogleLogin } from '../utils/OAuth2Config';
import { getUserFromToken } from '../utils/jwtUtils';

const StudentLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loginStep, setLoginStep] = useState('EMAIL'); // 'EMAIL', 'PASSWORD', 'REGISTER'

  const navigate = useNavigate();
  const { login } = useAuth();

  // Kiểm tra định dạng email student
  const isValidStudentEmail = (email) => {
    const studentEmailPattern = /^[a-zA-Z0-9._%+-]+@student\.stu\.edu\.vn$/;
    return studentEmailPattern.test(email);
  };

  // Hàm xử lý đăng nhập Google
  const handleGoogleLogin = () => {
    setError('');
    setLoading(true);

    try {
      redirectToGoogleLogin();
    } catch (error) {
      console.error('Google login error:', error);
      setError('Không thể kết nối đến dịch vụ đăng nhập Google. Vui lòng thử lại sau.');
      setLoading(false);
    }
  };

  // Hàm kiểm tra email
  const handleCheckEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    // Kiểm tra định dạng email trước
    if (!isValidStudentEmail(email)) {
      setError('Email phải có định dạng @student.stu.edu.vn');
      setLoading(false);
      return;
    }

    try {
      // Gọi API kiểm tra email
      const response = await apiClient.post('/auth/check-email', {
        email: email
      });
      
      console.log('Email check response:', response.data);

      // Kiểm tra cấu trúc phản hồi đúng từ API
      // { code: 1000, result: { exists: true/false } }
      if (response.data && response.data.code === 1000 && response.data.result) {
        const exists = response.data.result.exists;
        
        if (exists) {
          // Email đã tồn tại, hiển thị form nhập mật khẩu
          setLoginStep('PASSWORD');
          setMessage('');
          console.log('Email đã tồn tại, chuyển sang bước nhập mật khẩu');
        } else {
          // Email chưa tồn tại, hiển thị form đăng ký
          setLoginStep('REGISTER');
          setMessage('Email chưa được đăng ký. Hệ thống sẽ gửi email xác thực để tạo tài khoản mới.');
          console.log('Email chưa tồn tại, chuyển sang bước đăng ký');
        }
      } else {
        // Cấu trúc phản hồi không đúng
        console.error('Cấu trúc phản hồi không đúng:', response.data);
        setError('Không thể xác định trạng thái email. Vui lòng thử lại sau.');
      }
    } catch (err) {
      console.error('Email check error:', err);

      if (err.response && err.response.status === 400) {
        setError('Email không hợp lệ. Vui lòng kiểm tra lại.');
      } else if (err.response && err.response.status === 500) {
        setError('Lỗi hệ thống. Vui lòng thử lại sau.');
      } else {
        setError('Không thể kiểm tra email. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };
  // Hàm xử lý đăng nhập bằng email/password
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Email before login request:', email);
    
    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      setLoading(false);
      return;
    }

    try {
      // Sử dụng login từ context để đăng nhập
      const userData = await login(email, password);
      console.log('Login successful, user data:', userData);
      
      // authService và login đã xử lý việc lưu token và user
      
      // Chuyển hướng đến trang dashboard
      setTimeout(() => {
        navigate('/student/dashboard');
      }, 100);
    } catch (err) {
      console.error('Login error:', err);

      if (err.response && err.response.status === 401) {
        setError('Email hoặc mật khẩu không đúng.');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(err.message || 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm xử lý gửi email xác thực
  const handleSendVerificationEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const response = await apiClient.post('/auth/register/email', {
        email: email
      });
      
      console.log('Registration response:', response.data);

      if (response.data.code === 1000 && response.data.result && response.data.result.success) {
        setMessage(
            response.data.result.message ||
            'Đã gửi email xác nhận đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư và nhấn vào link xác thực để hoàn tất đăng ký.'
        );

        // Reset form sau khi gửi thành công
        setTimeout(() => {
          setEmail('');
          setLoginStep('EMAIL');
          setMessage('');
        }, 5000);
      } else {
        setError(response.data.result?.message || 'Có lỗi xảy ra khi gửi email xác thực');
      }
    } catch (err) {
      console.error('Registration error:', err);

      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else if (err.response && err.response.status === 409) {
        setError('Email này đã được đăng ký. Vui lòng sử dụng email khác.');
      } else {
        setError('Không thể gửi email xác thực. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Hàm quay lại bước nhập email
  const handleBackToEmail = () => {
    setLoginStep('EMAIL');
    setError('');
    setMessage('');
    setPassword('');
  };

  return (
      <div className="min-h-screen bg-gray-50">
        <Header />

        <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {loginStep === 'REGISTER' ? 'Đăng ký tài khoản' : 'Đăng nhập Sinh viên'}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              {loginStep === 'REGISTER'
                  ? 'Gửi email xác thực để tạo tài khoản mới'
                  : (loginStep === 'PASSWORD'
                      ? 'Nhập mật khẩu để đăng nhập'
                      : 'Nhập email sinh viên (@student.stu.edu.vn)')}
            </p>
          </div>

          <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              {/* Hiển thị thông báo lỗi */}
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

              {/* Hiển thị thông báo thành công */}
              {message && (
                  <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">{message}</p>
                      </div>
                    </div>
                  </div>
              )}

              {/* Form nhập email */}
              {loginStep === 'EMAIL' && (
                  <form className="space-y-6" onSubmit={handleCheckEmail}>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email sinh viên
                      </label>
                      <input
                          id="email"
                          name="email"
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="example@student.stu.edu.vn"
                      />
                      <p className="mt-1 text-xs text-gray-500">
                        Vui lòng sử dụng email có định dạng @student.stu.edu.vn
                      </p>
                    </div>

                    <div>
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Đang kiểm tra...' : 'Tiếp tục'}
                      </button>
                    </div>

                    {/* Divider */}
                    <div className="relative w-full mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Hoặc</span>
                      </div>
                    </div>

                    {/* Google Login Button */}
                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <img
                          className="h-5 w-5 mr-2"
                          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                          alt="Google logo"
                      />
                      Đăng nhập với Google
                    </button>

                    {/* Divider */}
                    <div className="relative w-full mt-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Tài khoản khác</span>
                      </div>
                    </div>

                    {/* Admin Login Link */}
                    <Link to="/admin/login" className="w-full">
                      <Button variant="secondary" fullWidth>
                        Đăng nhập dành cho Admin
                      </Button>
                    </Link>
                  </form>
              )}

              {/* Form nhập mật khẩu */}
              {loginStep === 'PASSWORD' && (
                  <form className="space-y-6" onSubmit={handleEmailLogin}>
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-display" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <button
                            type="button"
                            className="text-xs text-indigo-600 hover:text-indigo-500"
                            onClick={handleBackToEmail}
                        >
                          Thay đổi
                        </button>
                      </div>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-700">{email}</p>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                        Mật khẩu
                      </label>
                      <input
                          id="password"
                          name="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="Nhập mật khẩu"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm">
                        <Link to="/forgot-password" className="font-medium text-indigo-600 hover:text-indigo-500">
                          Quên mật khẩu?
                        </Link>
                      </div>
                    </div>

                    <div>
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                      </button>
                    </div>

                    <div>
                      <button
                          type="button"
                          onClick={handleBackToEmail}
                          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Quay lại
                      </button>
                    </div>
                  </form>
              )}

              {/* Form gửi email xác thực */}
              {loginStep === 'REGISTER' && (
                  <form className="space-y-6" onSubmit={handleSendVerificationEmail}>
                    <div>
                      <div className="flex items-center justify-between">
                        <label htmlFor="email-display" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <button
                            type="button"
                            className="text-xs text-indigo-600 hover:text-indigo-500"
                            onClick={handleBackToEmail}
                        >
                          Thay đổi
                        </button>
                      </div>
                      <div className="mt-1 p-3 bg-gray-50 border border-gray-200 rounded-md">
                        <p className="text-sm text-gray-700">{email}</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm text-blue-700">
                            Email này chưa được đăng ký. Hệ thống sẽ gửi email xác thực để bạn có thể tạo tài khoản mới.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                          type="submit"
                          disabled={loading}
                          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Đang gửi email...' : 'Gửi email xác thực'}
                      </button>
                    </div>

                    <div>
                      <button
                          type="button"
                          onClick={handleBackToEmail}
                          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Quay lại
                      </button>
                    </div>
                  </form>
              )}

              {/* Loading indicator */}
              {loading && (
                  <div className="text-center mt-4">
                    <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="mt-2 text-sm text-gray-500">Đang xử lý yêu cầu...</p>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default StudentLoginPage;