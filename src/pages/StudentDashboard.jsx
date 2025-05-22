import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import useAuth from '../hooks/useAuth';
import topicController from '../controllers/topicController';
import Spinner from '../components/Spinner';
import Alert from '../components/Alert';

const StudentDashboard = () => {
  const [studentTopics, setStudentTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  
  useEffect(() => {
    // Lấy danh sách đề tài đã đăng ký của sinh viên
    const fetchStudentTopics = async () => {
      try {
        setLoading(true);
        const topics = await topicController.getStudentTopics();
        setStudentTopics(topics);
      } catch (err) {
        console.error('Error fetching student topics:', err);
        setError('Không thể tải danh sách đề tài. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchStudentTopics();
  }, []);
  
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Dashboard
            </h1>
          </div>
        </header>
        
        <main className="mt-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            {/* Thông tin sinh viên */}
            <Card
              title="Thông tin cá nhân"
              className="mb-8"
            >
              <div className="space-y-4">
                <div className="flex items-center">
                  {currentUser?.avatar ? (
                    <img
                      src={currentUser.avatar}
                      alt="Avatar"
                      className="h-16 w-16 rounded-full mr-4"
                    />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                      <svg className="h-10 w-10 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{currentUser?.name}</h3>
                    <p className="text-sm text-gray-500">{currentUser?.email}</p>
                    <p className="text-sm text-gray-500">Role: {currentUser?.role}</p>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* Đề tài đã đăng ký */}
            <Card
              title="Đề tài đã đăng ký"
            >
              {error && (
                <Alert
                  type="error"
                  message={error}
                  dismissible
                  onDismiss={() => setError(null)}
                />
              )}
              
              {loading ? (
                <div className="py-12">
                  <Spinner size="lg" text="Đang tải dữ liệu đề tài..." />
                </div>
              ) : studentTopics.length === 0 ? (
                <div className="text-center py-6">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa đăng ký đề tài nào</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Bạn chưa đăng ký đề tài nào. Vui lòng đăng ký để bắt đầu.
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/student/topics"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                      Đăng ký đề tài
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 divide-y divide-gray-200">
                  {studentTopics.map(topic => (
                    <div key={topic.id} className="pt-6 first:pt-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-medium text-gray-900">{topic.title}</h4>
                          <p className="mt-1 text-sm text-gray-500">
                            Giảng viên hướng dẫn: {topic.lecturer}
                          </p>
                        </div>
                        <Link
                          to={`/student/topics/${topic.id}`}
                          className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                      {topic.description && (
                        <p className="mt-2 text-sm text-gray-600">
                          {topic.description.length > 150 
                            ? `${topic.description.substring(0, 150)}...` 
                            : topic.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
            
            {/* Quick links */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Card hoverable className="flex flex-col">
                <Link to="/student/topics" className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Đăng ký đề tài</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Xem danh sách và đăng ký đề tài mới
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                      <span>Xem tất cả đề tài</span>
                      <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Card>
              
              <Card hoverable className="flex flex-col">
                <Link to="/student/my-topics" className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Đề tài của tôi</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Quản lý các đề tài đã đăng ký
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                      <span>Xem đề tài của tôi</span>
                      <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </Link>
              </Card>
              
              <Card hoverable className="flex flex-col">
                <a href="https://example.com/help" target="_blank" rel="noopener noreferrer" className="flex-1 flex flex-col">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">Hướng dẫn</h3>
                    <p className="mt-2 text-sm text-gray-500">
                      Hướng dẫn sử dụng hệ thống
                    </p>
                  </div>
                  <div className="mt-4">
                    <span className="inline-flex items-center text-sm font-medium text-indigo-600">
                      <span>Xem hướng dẫn</span>
                      <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </a>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;