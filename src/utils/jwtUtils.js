/**
 * Tiện ích xử lý JWT token
 */

/**
 * Giải mã JWT token để lấy payload
 * @param {string} token - JWT token cần giải mã
 * @returns {Object|null} Payload của token hoặc null nếu không hợp lệ
 */
export const parseJwtToken = (token) => {
  try {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return null;
  }
};

/**
 * Lấy thông tin người dùng từ token
 * @param {string} token - JWT token
 * @param {string} defaultEmail - Email mặc định nếu không tìm thấy trong token
 * @returns {Object} Thông tin người dùng
 */
export const getUserFromToken = (token, defaultEmail = '') => {
  const payload = parseJwtToken(token);
  
  if (!payload) {
    return {
      email: defaultEmail,
      role: 'SINH_VIEN',
      name: defaultEmail.split('@')[0]
    };
  }
  
  return {
    email: payload.email || payload.sub || defaultEmail,
    role: payload.scope || 'SINH_VIEN',
    name: payload.name || payload.email?.split('@')[0] || defaultEmail.split('@')[0]
  };
};

/**
 * Kiểm tra token có hết hạn hay không
 * @param {string} token - JWT token cần kiểm tra
 * @returns {boolean} true nếu token hết hạn, false nếu còn hiệu lực
 */
export const isTokenExpired = (token) => {
  try {
    const payload = parseJwtToken(token);
    if (!payload || !payload.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

export default {
  parseJwtToken,
  getUserFromToken,
  isTokenExpired
};