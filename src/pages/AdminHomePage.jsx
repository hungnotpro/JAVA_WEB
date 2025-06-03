import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import topicController from '../controllers/topicController';
import nhomController from '../controllers/nhomController';
import useAuth from '../hooks/useAuth';

/**
 * Trang chủ dành riêng cho Admin
 */
const AdminHomePage = () => {
  const { currentUser } = useAuth();
  
  // State cho dữ liệu thống kê
  const [stats, setStats] = useState({
    totalTopics: 0,
    totalGroups: 0,
    pendingGroups: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recentTopics, setRecentTopics] = useState([]);
  const [recentGroups, setRecentGroups] = useState([]);
  
  // Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // Hàm fetch dữ liệu thống kê
  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch danh sách đề tài
      const topics = await topicController.getAllTopics();
      
      // Fetch danh sách nhóm
      const groups = await nhomController.getAllNhom();
      
      // Lấy 5 đề tài mới nhất
      const sortedTopics = [...topics].sort((a, b) => 
        new Date(b.thoiGianTao || 0) - new Date(a.thoiGianTao || 0)
      ).slice(0, 5);
      
      // Lấy 5 nhóm mới nhất
      const sortedGroups = [...groups].sort((a, b) => 
        new Date(b.thoiGianTao || 0) - new Date(a.thoiGianTao || 0)
      ).slice(0, 5);
      
      setRecentTopics(sortedTopics);
      setRecentGroups(sortedGroups);
      
      // Tính toán thống kê
      setStats({
        totalTopics: topics.length,
        totalGroups: groups.length,
        pendingGroups: groups.filter(g => g.trangThai === 'CHO_DUYET').length || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Không thể tải dữ liệu trang chủ');
    } finally {
      setLoading(false);
    }
  };
  
  // Format thời gian
  const formatDate = (dateString) => {
    if (!dateString) return 'Không xác định';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('vi-VN', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Trang chủ Admin
            </h1>
            {currentUser && (
              <p className="mt-1 text-gray-500">
                Xin chào, {currentUser.name || currentUser.email}
              </p>
            )}
          </div>
        </header>
        
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Hiển thị lỗi nếu có */}
              {error && (
                <Alert
                  type="error"
                  message={error}
                  dismissible
                  onDismiss={() => setError(null)}
                  className="mb-6"
                />
              )}
              
              {/* Phần thống kê */}
              {loading ? (
                <div className="py-12">
                  <Spinner size="lg" text="Đang tải dữ liệu..." />
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Tổng số đề tài
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {stats.totalTopics}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <Link to="/admin/topics" className="font-medium text-indigo-600 hover:text-indigo-900">
                            Xem tất cả
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Tổng số nhóm
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {stats.totalGroups}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <Link to="/admin/nhom" className="font-medium text-indigo-600 hover:text-indigo-900">
                            Xem tất cả
                          </Link>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                            <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Nhóm chờ duyệt
                              </dt>
                              <dd>
                                <div className="text-lg font-medium text-gray-900">
                                  {stats.pendingGroups}
                                </div>
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                      <div className="bg-gray-50 px-5 py-3">
                        <div className="text-sm">
                          <Link to="/admin/dashboard" className="font-medium text-indigo-600 hover:text-indigo-900">
                            Xem chi tiết
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Đề tài mới nhất */}
                  <h2 className="text-xl font-semibold mb-5">Đề tài mới nhất</h2>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
                    {recentTopics.length === 0 ? (
                      <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                        Chưa có đề tài nào
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {recentTopics.map(topic => (
                          <li key={topic.id}>
                            <Link to={`/admin/topics/${topic.id}`} className="block hover:bg-gray-50">
                              <div className="px-4 py-4 flex items-center sm:px-6">
                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                  <div>
                                    <div className="flex text-sm">
                                      <p className="font-medium text-indigo-600 truncate">{topic.tenDeTai}</p>
                                    </div>
                                    <div className="mt-2 flex">
                                      <div className="flex items-center text-sm text-gray-500">
                                        <p>
                                          {topic.moTa?.substring(0, 100)}{topic.moTa?.length > 100 ? '...' : ''}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                                    <div className="flex space-x-4 overflow-hidden">
                                      <p className="text-sm text-gray-500">
                                        {formatDate(topic.thoiGianTao)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-5 flex-shrink-0">
                                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  
                  {/* Nhóm mới đăng ký */}
                  <h2 className="text-xl font-semibold mb-5">Nhóm mới đăng ký</h2>
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    {recentGroups.length === 0 ? (
                      <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                        Chưa có nhóm nào đăng ký
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-200">
                        {recentGroups.map(group => (
                          <li key={group.id}>
                            <Link to={`/admin/nhom/${group.id}`} className="block hover:bg-gray-50">
                              <div className="px-4 py-4 flex items-center sm:px-6">
                                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                                  <div>
                                    <div className="flex text-sm">
                                      <p className="font-medium text-indigo-600 truncate">{group.tenDeTai}</p>
                                    </div>
                                    <div className="mt-2 flex">
                                      <div className="flex items-center text-sm text-gray-500">
                                        <p>
                                          Nhóm trưởng: {group.emailNhomTruong}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="mt-2 flex">
                                      <div className="flex items-center text-sm text-gray-500">
                                        <p>
                                          Số thành viên: {group.thanhVienNhoms?.length || 0}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                                    <div className="flex space-x-4 overflow-hidden">
                                      <p className="text-sm text-gray-500">
                                        {formatDate(group.thoiGianTao)}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                                <div className="ml-5 flex-shrink-0">
                                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminHomePage;