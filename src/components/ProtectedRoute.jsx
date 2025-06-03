import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component bảo vệ route theo role
 * @param {Object} props
 * @param {string} props.requiredRole - Role yêu cầu để truy cập ('ADMIN' hoặc 'STUDENT')
 */
const ProtectedRoute = ({ requiredRole }) => {
  const { currentUser, isAuthenticated } = useAuth();
  
  // Nếu chưa đăng nhập, chuyển hướng về trang chủ
  if (typeof isAuthenticated !== 'function' || !isAuthenticated()) {
    return <Navigate to="/" replace />;
  }  
  // Nếu đã xác định role cụ thể và user không có role đó
  if (requiredRole) {
    const userRole = currentUser?.role || '';
    const isRoleMatch = 
      (requiredRole === 'ADMIN' && (userRole === 'ADMIN' || userRole === 'admin')) ||
      (requiredRole === 'SINH_VIEN' && (userRole === 'SINH_VIEN')) ||
      (requiredRole === 'STUDENT' && (userRole === 'STUDENT' || userRole === 'student' || userRole === 'SINH_VIEN'));
    
    if (!isRoleMatch) {
      console.log('Role mismatch, current role:', userRole, 'required role:', requiredRole);
      // Chuyển hướng về dashboard tương ứng với role của user
      if (userRole === 'ADMIN' || userRole === 'admin') {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userRole === 'STUDENT' || userRole === 'student' || userRole === 'SINH_VIEN') {
        return <Navigate to="/student/dashboard" replace />;
      } else {
        return <Navigate to="/" replace />;
      }
    }
  }
  
  // Người dùng có quyền truy cập
  return <Outlet />;
};

export default ProtectedRoute;