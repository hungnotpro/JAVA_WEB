import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Spinner from '../components/Spinner';
import { useAuth } from '../contexts/AuthContext';
import nhomService from '../services/nhomService';
import topicController from '../controllers/topicController';
import { formatDate } from '../utils/formatters';

const StudentDashboard = () => {
  const [studentTopics, setStudentTopics] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch các đề tài và nhóm của sinh viên
        const [topicsData, groupsData] = await Promise.all([
          topicController.getAllTopics(),
          nhomService.getMyGroups()
        ]);
        
        setStudentTopics(topicsData.slice(0, 5)); // Hiển thị 5 đề tài mới nhất
        setMyGroups(groupsData);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Không thể tải dữ liệu dashboard');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Header />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0 flex justify-center">
            <Spinner size="lg" text="Đang tải dashboard..." />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">
              Dashboard Sinh viên
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Xin chào, {currentUser?.name || currentUser?.email}
            </p>
          </div>
        </header>

        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              
              {error && (
                <Alert
                  type="error"
                  message={error}
                  dismissible
                  onDismiss={() => setError(null)}
                  className="mb-6"
                />
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Đề tài</h3>
                    <Button
                      variant="primary"
                      fullWidth
                      onClick={() => navigate('/student/topics')}
                    >
                      Xem danh sách đề tài
                    </Button>
                  </div>
                </Card>
                
                <Card>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Nhóm của tôi</h3>
                    <Button
                      variant="secondary"
                      fullWidth
                      onClick={() => navigate('/student/my-topics')}
                    >
                      Quản lý nhóm
                    </Button>
                  </div>
                </Card>

                <Card>
                  <div className="p-6 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Thống kê</h3>
                    <p className="text-2xl font-bold text-blue-600">
                      {myGroups.length}
                    </p>
                    <p className="text-sm text-gray-500">Nhóm đã đăng ký</p>
                  </div>
                </Card>
              </div>

              {/* My Groups Section */}
              <Card className="mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Nhóm đã đăng ký
                    </h2>
                    <Link
                      to="/student/my-topics"
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Xem tất cả
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  {myGroups.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500 mb-4">Bạn chưa đăng ký nhóm nào</p>
                      <Button
                        variant="primary"
                        onClick={() => navigate('/student/topics')}
                      >
                        Đăng ký đề tài ngay
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {myGroups.slice(0, 3).map((group) => (
                        <div key={group.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">
                                {group.tenDeTai || 'Đề tài không xác định'}
                              </h4>
                              <p className="text-sm text-gray-500">
                                Nhóm trưởng: {group.emailNhomTruong}
                              </p>
                              <p className="text-sm text-gray-500">
                                Số thành viên: {group.thanhVienNhoms?.length || 0}
                              </p>
                            </div>
                            <Link
                              to={`/student/my-topics/${group.id}`}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200"
                            >
                              Quản lý
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>

              {/* Recent Topics Section */}
              <Card>
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Đề tài mới nhất
                    </h2>
                    <Link
                      to="/student/topics"
                      className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                    >
                      Xem tất cả
                    </Link>
                  </div>
                </div>
                
                <div className="p-6">
                  {studentTopics.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      Không có đề tài nào
                    </p>
                  ) : (
                    <div className="space-y-6 divide-y divide-gray-200">
                      {studentTopics.map(topic => (
                        <div key={topic.id} className="pt-6 first:pt-0">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-lg font-medium text-gray-900">
                                {topic.tenDeTai}
                              </h4>
                              <p className="mt-1 text-sm text-gray-500">
                                Số nhóm: {topic.soNhomDaDangKy}/{topic.soNhomToiDa} | 
                                Thành viên: {topic.soThanhVienToiThieu}-{topic.soThanhVienToiDa}
                              </p>
                              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                {topic.moTa}
                              </p>
                            </div>
                            <div className="ml-4 flex space-x-2">
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => navigate(`/topics/${topic.id}`)}
                              >
                                Xem chi tiết
                              </Button>
                              {topic.soNhomDaDangKy < topic.soNhomToiDa && (
                                <Button
                                  variant="primary"
                                  size="sm"
                                  onClick={() => navigate(`/student/topics/dang-ky/${topic.id}`)}
                                >
                                  Đăng ký
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;