import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StudentLogin = () => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    // Initialize Google Sign-In
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: 'YOUR_GOOGLE_CLIENT_ID', // Thay thế bằng client ID thực của bạn
        callback: handleCredentialResponse,
        auto_select: false
      });

      window.google.accounts.id.renderButton(
        document.getElementById('googleSignInDiv'),
        { theme: 'outline', size: 'large', width: 300, text: 'signin_with' }
      );
    }
  }, []);
  
  const handleCredentialResponse = async (response) => {
    try {
      setError('');
      setLoading(true);
      
      // Google Sign-In successful, now send the token to your backend
      await loginWithGoogle(response.credential);
      navigate('/student/dashboard');
    } catch (error) {
      setError(error.message || 'Đăng nhập thất bại. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Đăng nhập Sinh viên</h2>
          <p className="text-gray-600 mt-2">Hệ thống đăng ký đề tài</p>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-sm text-gray-600">Vui lòng đăng nhập bằng tài khoản Google của trường</p>
          
          {/* Google Sign-In Button */}
          <div id="googleSignInDiv" className="w-full flex justify-center"></div>
          
          <div className="mt-4 w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">hoặc</span>
              </div>
            </div>
          </div>
          
          <Link
            to="/admin/login"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Đăng nhập dành cho Admin
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;