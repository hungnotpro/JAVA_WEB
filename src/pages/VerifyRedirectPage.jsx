import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

/**
 * Component chuyển hướng từ /verify sang /verify-email
 * Giữ nguyên tham số token trong URL
 */
const VerifyRedirectPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Lấy token từ URL
    const token = searchParams.get('token');
    console.log("Redirecting from /verify to /verify-email with token:", token);
    
    // Chuyển hướng sang /verify-email với token
    if (token) {
      navigate(`/verify-email?token=${token}`, { replace: true });
    } else {
      // Nếu không có token, vẫn chuyển hướng nhưng hiển thị lỗi ở trang đích
      navigate('/verify-email', { replace: true });
    }
  }, [searchParams, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <svg className="animate-spin h-8 w-8 text-indigo-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="mt-2 text-sm text-gray-500">Đang chuyển hướng...</p>
      </div>
    </div>
  );
};

export default VerifyRedirectPage;