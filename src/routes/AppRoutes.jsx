import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AdminLoginPage from '../pages/AdminLoginPage';
import StudentLoginPage from '../pages/StudentLoginPage';
import OAuth2RedirectHandler from '../pages/OAuth2RedirectHandler';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import StudentTopicsPage from '../pages/StudentTopicsPage';

/**
 * Component chứa tất cả các route của ứng dụng
 */
const AppRoutes = () => {
  return (
    <Routes>      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      
      {/* Protected Admin routes */}
      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/topics" element={<div>Quản lý đề tài</div>} />
        <Route path="/admin/students" element={<div>Quản lý sinh viên</div>} />
      </Route>
      
      {/* Protected Student routes */}
      <Route element={<ProtectedRoute requiredRole="STUDENT" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/topics" element={<StudentTopicsPage />} />
        <Route path="/student/my-topics" element={<div>Đề tài của tôi</div>} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;