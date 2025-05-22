// URL đến endpoint xác thực OAuth2 của Spring Boot với context path đúng
// Dựa trên ứng dụng Spring Security với context-path /api
const googleAuthUrl = 'http://localhost:8080/api/oauth2/authorization/google';

/**
 * Chuyển hướng người dùng đến trang đăng nhập Google OAuth2 của Spring Security
 */
export function redirectToGoogleLogin() {
  console.log('Redirecting to Google OAuth2 login page:', googleAuthUrl);
  
  try {
    // Chuyển hướng trực tiếp không cần kiểm tra trước
    window.location.href = googleAuthUrl;
  } catch (error) {
    console.error('Lỗi chuyển hướng:', error);
    alert('Không thể chuyển hướng đến trang đăng nhập. Vui lòng thử lại sau.');
  }
}

// Không cần cấu hình Google Sign-In vì chúng ta đang sử dụng OAuth2 của Spring Boot
export const initGoogleSignIn = (callback) => {
  // Không cần khởi tạo Google Sign-In API nữa
  // Vì chúng ta đang sử dụng OAuth2 redirect flow
  console.log('Using OAuth2 redirect flow instead of Google Sign-In API');
};

// Render nút đăng nhập Google
export const renderGoogleButton = (elementId, options = {}) => {
  if (window.google && window.google.accounts) {
    window.google.accounts.id.renderButton(
      document.getElementById(elementId),
      { 
        theme: 'outline', 
        size: 'large', 
        width: 300, 
        text: 'signin_with',
        ...options 
      }
    );
  }
};