import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import AdminLoginPage from './pages/AdminLoginPage';
import StudentLoginPage from './pages/StudentLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminNhomListPage from './pages/AdminNhomListPage';
import StudentNhomDetailPage from './pages/StudentNhomDetailPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Main App Component
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/student/login" element={<StudentLoginPage />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            } />
            
            <Route path="/admin/nhom" element={
              <ProtectedRoute requiredRole="ADMIN">
                <AdminNhomListPage />
              </ProtectedRoute>
            } />
            
            {/* Student Routes */}
            <Route path="/student/my-topics" element={
              <ProtectedRoute requiredRole="SINH_VIEN">
                <StudentMyTopicsPage />
              </ProtectedRoute>
            } />
            
            <Route path="/student/nhom/:nhomId" element={
              <ProtectedRoute requiredRole="SINH_VIEN">
                <StudentNhomDetailPage />
              </ProtectedRoute>
            } />
            
            {/* Default redirects */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/student" element={<Navigate to="/student/topics" replace />} />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;