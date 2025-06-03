import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import AdminLoginPage from '../pages/AdminLoginPage';
import StudentLoginPage from '../pages/StudentLoginPage';
import OAuth2RedirectHandler from '../pages/OAuth2RedirectHandler';
import VerifyRedirectPage from '../pages/VerifyRedirectPage';
import VerifyEmailPage from '../pages/VerifyEmailPage';
import ProtectedRoute from '../components/ProtectedRoute';
import AdminDashboard from '../pages/AdminDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import StudentTopicsPage from '../pages/StudentTopicsPage';
import StudentMyTopicsPage from '../pages/StudentMyTopicsPage';
import StudentNhomDetailPage from '../pages/StudentNhomDetailPage';
import DangKyNhomPage from '../pages/DangKyNhomPage';
import AdminTopicsPage from '../pages/AdminTopicsPage';
import AdminTopicDetailPage from '../pages/AdminTopicDetailPage';
import AdminTopicEditPage from '../pages/AdminTopicEditPage';
import AdminNhomPage from '../pages/AdminNhomPage';
import AdminNhomDetailPage from '../pages/AdminNhomDetailPage';
import TopicListPage from '../pages/TopicListPage';
import TopicDetailPage from '../pages/TopicDetailPage';

/**
 * Component chứa tất cả các route của ứng dụng
 */
const AppRoutes = () => {
  return (    <Routes>      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/student/login" element={<StudentLoginPage />} />
      <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />
      <Route path="/topics" element={<TopicListPage />} />
      <Route path="/topics/:topicId" element={<TopicDetailPage />} />
      
      {/* Email verification routes */}
      <Route path="/verify" element={<VerifyRedirectPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
        
      {/* Protected Admin routes */}      <Route element={<ProtectedRoute requiredRole="ADMIN" />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/topics" element={<AdminTopicsPage />} />
        <Route path="/admin/topics/:topicId" element={<AdminTopicDetailPage />} />
        <Route path="/admin/topics/edit/:topicId" element={<AdminTopicEditPage />} />
        <Route path="/admin/nhom" element={<AdminNhomPage />} />
        <Route path="/admin/nhom/:nhomId" element={<AdminNhomDetailPage />} />
        <Route path="/admin/students" element={<div>Quản lý sinh viên</div>} />
      </Route>      {/* Protected Student routes */}      <Route element={<ProtectedRoute requiredRole="SINH_VIEN" />}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/topics" element={<StudentTopicsPage />} />
        <Route path="/student/topics/:topicId" element={<TopicDetailPage />} />
        <Route path="/student/my-topics" element={<StudentMyTopicsPage />} />
        <Route path="/student/my-topics/:nhomId" element={<StudentNhomDetailPage />} />
        <Route path="/student/topics/dang-ky/:deTaiId" element={<DangKyNhomPage />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;