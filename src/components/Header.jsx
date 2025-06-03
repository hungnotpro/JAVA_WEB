import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Component Header chung cho toàn ứng dụng
 * Hiển thị menu và thông tin đăng nhập
 */
const Header = () => {
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex px-2 lg:px-0">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                Hệ thống đăng ký đề tài
              </Link>
            </div>
            <nav className="hidden lg:ml-6 lg:flex lg:space-x-8">
              <Link
                to="/"
                className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              >
                Trang chủ
              </Link>
                {isAuthenticated() && currentUser?.role === 'ADMIN' && (
                <>
                  <Link
                    to="/admin/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/admin/nhom"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Quản lý nhóm
                  </Link>
                  <Link
                    to="/admin/topics"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Quản lý đề tài
                  </Link>
                </>
              )}
              
              {isAuthenticated() && (currentUser?.role === 'STUDENT' || currentUser?.role === 'SINH_VIEN') && (
                <>
                  <Link
                    to="/student/dashboard"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/student/topics"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Đăng ký đề tài
                  </Link>
                  <Link
                    to="/student/my-topics"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    Đề tài của tôi
                  </Link>
                </>
              )}
            </nav>
          </div>
          
          <div className="flex items-center lg:hidden">
            {/* Mobile menu button */}
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {/* Icon when menu is closed */}
              <svg
                className={`${isMobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* Icon when menu is open */}
              <svg
                className={`${isMobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          
          <div className="hidden lg:ml-4 lg:flex lg:items-center">
            {isAuthenticated() ? (
              <div className="flex items-center">
                <span className="text-gray-700 mr-4">
                  {currentUser?.name || currentUser?.email}
                </span>
                <button
                  type="button"
                  className="ml-4 flex-shrink-0 bg-red-100 p-1 text-red-500 rounded-full hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={handleLogout}
                >
                  <span className="sr-only">Đăng xuất</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Đăng nhập Admin
                </Link>
                <Link
                  to="/student/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Đăng nhập Sinh viên
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} lg:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
          >
            Trang chủ
          </Link>
            {isAuthenticated() && currentUser?.role === 'ADMIN' && (
            <>
              <Link
                to="/admin/dashboard"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/admin/nhom"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Quản lý nhóm
              </Link>
              <Link
                to="/admin/topics"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Quản lý đề tài
              </Link>
            </>
          )}
          
          {isAuthenticated() && (currentUser?.role === 'STUDENT' || currentUser?.role === 'SINH_VIEN') && (
            <>
              <Link
                to="/student/dashboard"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Dashboard
              </Link>
              <Link
                to="/student/topics"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Đăng ký đề tài
              </Link>
              <Link
                to="/student/my-topics"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Đề tài của tôi
              </Link>
            </>
          )}
          
          {!isAuthenticated() && (
            <>
              <Link
                to="/admin/login"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Đăng nhập Admin
              </Link>
              <Link
                to="/student/login"
                className="border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                Đăng nhập Sinh viên
              </Link>
            </>
          )}
          
          {isAuthenticated() && (
            <button
              onClick={handleLogout}
              className="border-transparent text-red-600 hover:bg-gray-50 hover:border-red-300 hover:text-red-800 block pl-3 pr-4 py-2 border-l-4 text-base font-medium w-full text-left"
            >
              Đăng xuất
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;