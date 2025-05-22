import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const StudentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-green-600">Hệ thống đăng ký đề tài</h1>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Xin chào, {currentUser?.name || currentUser?.email}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="py-10">
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">Dashboard Sinh viên</h1>
          </div>
        </header>
        <main>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="px-4 py-8 sm:px-0">
              <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 p-4 bg-white">
                <h2 className="text-xl font-semibold mb-4">Chức năng sinh viên</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-blue-100 p-4 rounded-lg shadow">
                    <h3 className="font-medium text-blue-800">Đăng ký đề tài</h3>
                    <p className="text-sm text-blue-600 mt-1">Xem danh sách và đăng ký đề tài</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded-lg shadow">
                    <h3 className="font-medium text-yellow-800">Đề tài của tôi</h3>
                    <p className="text-sm text-yellow-600 mt-1">Xem đề tài đã đăng ký</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StudentDashboard;