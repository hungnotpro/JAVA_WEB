import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/Button';

const HomePage = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
              Hệ thống đăng ký đề tài
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
              Nền tảng đăng ký đề tài dành cho sinh viên và giảng viên
            </p>
              <div className="mt-10">
              {typeof isAuthenticated === 'function' && isAuthenticated() ? (
                <div className="space-y-6">
                  <p className="text-lg text-gray-600">
                    Xin chào, {currentUser?.name || currentUser?.email}!
                  </p>                  <Link to={currentUser?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}>
                    <Button variant="primary" size="lg">
                      Đi đến Dashboard
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5">
                  <Link to="/admin/login">
                    <Button variant="secondary" size="lg" fullWidth>
                      Đăng nhập Admin
                    </Button>
                  </Link>
                  
                  <Link to="/student/login">
                    <Button variant="primary" size="lg" fullWidth>
                      Đăng nhập Sinh viên
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Đăng ký đề tài</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Sinh viên có thể dễ dàng đăng ký đề tài một cách nhanh chóng và thuận tiện.
                  </p>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Quản lý đề tài</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Giảng viên có thể dễ dàng quản lý các đề tài và sinh viên đăng ký.
                  </p>
                </div>
              </div>
              
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg font-medium text-gray-900">Theo dõi tiến độ</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Theo dõi tiến độ thực hiện đề tài một cách trực quan và cập nhật.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
          <div className="mt-8 md:mt-0">
            <p className="text-center text-base text-gray-400">
              &copy; 2024 Hệ thống đăng ký đề tài. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;