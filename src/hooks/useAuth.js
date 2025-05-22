import { useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

/**
 * Hook tùy chỉnh để truy cập context xác thực
 * @returns {Object} AuthContext - Các phương thức và trạng thái xác thực
 */
const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;