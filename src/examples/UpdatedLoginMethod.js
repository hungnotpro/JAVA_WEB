// Phương thức đăng nhập đã sửa
// Vấn đề: Hàm login trong useAuth truyền token thay vì email vào yêu cầu đăng nhập

/*
  Cách sửa:
  
  1. Thay đổi StudentLoginPage.jsx:
  - Thay vì truyền token vào hàm login, gọi trực tiếp authService.loginAdmin
  
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!password) {
      setError('Vui lòng nhập mật khẩu');
      setLoading(false);
      return;
    }

    try {
      console.log('Đang đăng nhập với:', { email, password });
      
      // Gọi trực tiếp authService
      const data = await authService.loginAdmin(email, password);
      
      if (data && data.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', data.token);
        // Nếu có user info, lưu luôn
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }
        
        // Cập nhật trạng thái đăng nhập thành công và chuyển hướng
        navigate('/student/dashboard');
      } else {
        setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin đăng nhập.');
      }
    } catch (err) {
      console.error('Login error:', err);

      if (err.status === 401) {
        setError('Email hoặc mật khẩu không đúng.');
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };
*/