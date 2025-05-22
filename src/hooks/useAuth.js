import { useContext } from 'react';
import AuthContext, { useAuth as useAuthContext } from '../contexts/AuthContext';

/**
 * Custom hook để sử dụng AuthContext
 * Giúp truy cập dễ dàng đến các phương thức và trạng thái xác thực
 */
const useAuth = () => {
  // Sử dụng useAuth trực tiếp từ AuthContext nếu có
  if (useAuthContext) {
    return useAuthContext();
  }
  
  // Fallback cho trường hợp không có useAuth trong AuthContext
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default useAuth;