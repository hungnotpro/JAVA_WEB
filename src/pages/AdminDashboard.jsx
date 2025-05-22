import React from 'react';
import Header from '../components/Header';
import useAuth from '../hooks/useAuth';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard Admin</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              {/* Phần thống kê */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-8">
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
                              24
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">
                            Sinh viên đã đăng ký
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              18
                            </div>
                          </dd>
                        </dl>
                      </div>
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
                            Đề tài đang chờ duyệt
                          </dt>
                          <dd>
                            <div className="text-lg font-medium text-gray-900">
                              5
                            </div>
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Phần chức năng chính */}
              <h2 className="text-xl font-semibold mb-5">Chức năng quản trị</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  <li>
                    <a href="/admin/topics" className="block hover:bg-gray-50">
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <div className="flex text-sm">
                              <p className="font-medium text-indigo-600 truncate">Quản lý đề tài</p>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <p>Xem, thêm, sửa, xóa các đề tài</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  </li>
                  
                  <li>
                    <a href="/admin/students" className="block hover:bg-gray-50">
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <div className="flex text-sm">
                              <p className="font-medium text-indigo-600 truncate">Quản lý sinh viên</p>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <p>Danh sách sinh viên và trạng thái đăng ký</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  </li>
                  
                  <li>
                    <a href="#" className="block hover:bg-gray-50">
                      <div className="px-4 py-4 flex items-center sm:px-6">
                        <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                          <div>
                            <div className="flex text-sm">
                              <p className="font-medium text-indigo-600 truncate">Báo cáo và thống kê</p>
                            </div>
                            <div className="mt-2 flex">
                              <div className="flex items-center text-sm text-gray-500">
                                <p>Xem các báo cáo và thống kê về đề tài</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="ml-5 flex-shrink-0">
                          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;