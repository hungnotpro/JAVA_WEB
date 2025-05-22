import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

// Authentication services
export const authService = {
  // Admin login with email and password
  loginAdmin: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Student login with Google token
  loginWithGoogle: async (token) => {
    try {
      const response = await axios.post(`${API_URL}/auth/google-login`, {
        token
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : new Error('Network error');
    }
  },

  // Log out and clear storage
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  // Get current user from localStorage
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export default authService;