import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';

// Lazy load các trang để tối ưu hiệu suất
const StudentLoginPage = lazy(() => import('./pages/StudentLoginPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const Loading = lazy(() => import('./components/Loading'));

// Route Guard - Kiểm tra quyền truy cập
const PrivateRoute = ({ element, requiredRole }) => {
  const { currentUser, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <Loading />;
  }
  
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Kiểm tra role
  if (requiredRole && currentUser?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return element;
};

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<StudentLoginPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/student/dashboard" 
          element={<PrivateRoute element={<StudentDashboard />} requiredRole="SINH_VIEN" />} 
        />
        <Route 
          path="/admin/dashboard" 
          element={<PrivateRoute element={<AdminDashboard />} requiredRole="ADMIN" />} 
        />
        
        {/* 404 route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;