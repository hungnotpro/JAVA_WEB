import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../contexts/AuthContext';

/**
 * Trang Dashboard chính cho Admin
 */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const adminFeatures = [
    {
      title: 'Quản lý nhóm đăng ký',
      description: 'Xem, quản lý tất cả các nhóm đã đăng ký đề tài',
      icon: '👥',
      path: '/admin/nhom',
      color: 'bg-blue-500'
    },
    {
      title: 'Quản lý người dùng',
      description: 'Quản lý tài khoản sinh viên và giảng viên',
      icon: '👤',
      path: '/admin/users',
      color: 'bg-green-500'
    },
    {
      title: 'Quản lý đề tài',
      description: 'Thêm, sửa, xóa các đề tài nghiên cứu',
      icon: '📋',
      path: '/admin/topics',
      color: 'bg-purple-500'
    },
    {
      title: 'Thống kê báo cáo',
      description: 'Xem thống kê và báo cáo hệ thống',
      icon: '📊',
      path: '/admin/reports',
      color: 'bg-orange-500'
    }
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      
      <div className="py-10">
        {/* Header */}
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold leading-tight text-gray-900">
                Bảng điều khiển Admin
              </h1>
              <p className="mt-2 text-lg text-gray-600">
                Chào mừng {currentUser?.fullName || currentUser?.email}
              </p>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-3xl">👥</div>
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold">-</div>
                        <div className="text-blue-100">Tổng nhóm</div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-3xl">👤</div>
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold">-</div>
                        <div className="text-green-100">Người dùng</div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-3xl">📋</div>
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold">-</div>
                        <div className="text-purple-100">Đề tài</div>
                      </div>
                    </div>
                  </div>
                </Card>
                
                <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="text-3xl">⚡</div>
                      </div>
                      <div className="ml-4">
                        <div className="text-2xl font-bold">Active</div>
                        <div className="text-orange-100">Hệ thống</div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Admin Features */}
              <Card title="Chức năng quản lý">
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminFeatures.map((feature, index) => (
                      <div
                        key={index}
                        className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => handleNavigate(feature.path)}
                      >
                        <div className="text-center">
                          <div className={`inline-flex items-center justify-center w-16 h-16 ${feature.color} text-white rounded-full text-2xl mb-4`}>
                            {feature.icon}
                          </div>
                          
                          <h3 className="text-lg font-medium text-gray-900 mb-2">
                            {feature.title}
                          </h3>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            {feature.description}
                          </p>
                          
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleNavigate(feature.path);
                            }}
                          >
                            Truy cập
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Recent Activities */}
              <Card title="Hoạt động gần đây" className="mt-8">
                <div className="p-6">
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-4xl mb-4">📈</div>
                    <p className="text-gray-500">
                      Thông tin hoạt động gần đây sẽ được hiển thị ở đây
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;