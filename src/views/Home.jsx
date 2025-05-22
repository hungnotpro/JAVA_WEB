import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Hệ thống đăng ký đề tài
        </h1>
        
        {isAuthenticated() ? (
          <div className="space-y-4">
            <p className="text-center text-gray-600">
              Xin chào, {currentUser?.name || currentUser?.email}!
            </p>
            <div className="flex justify-center">
              <Link
                to={currentUser?.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-colors"
              >
                Đi đến Dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-col space-y-4">
            <Link
              to="/admin/login"
              className="w-full px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors text-center"
            >
              Đăng nhập Admin
            </Link>
            
            <Link
              to="/student/login"
              className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow-md hover:bg-green-700 transition-colors text-center"
            >
              Đăng nhập Sinh viên
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;