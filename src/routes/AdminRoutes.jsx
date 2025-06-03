import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Admin Pages
import AdminDashboard from '../pages/AdminDashboard';
import AdminNhomListPage from '../pages/AdminNhomListPage';
import AdminUserManagement from '../pages/AdminUserManagement';

/**
 * Admin Routes - Routes dành cho Admin
 */
const AdminRoutes = () => {
  const { currentUser } = useAuth();

  // Kiểm tra quyền admin
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return <Navigate to="/login" replace />;
  }

  return (
    <Routes>
      <Route path="/" element={<AdminDashboard />} />
      <Route path="/dashboard" element={<AdminDashboard />} />
      <Route path="/nhom" element={<AdminNhomListPage />} />
      <Route path="/nhom/:id" element={<AdminNhomDetailPage />} />
      <Route path="/users" element={<AdminUserManagement />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AdminRoutes;