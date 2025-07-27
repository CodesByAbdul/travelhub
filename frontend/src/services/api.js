import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.token) {
          config.headers.Authorization = `Bearer ${userData.token}`;
        }
      } catch (error) {
        console.error('Error parsing user token:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

// Destination API
export const destinationApi = {
  getAll: (type = null) => {
    const params = type ? `?type=${type}` : '';
    return apiClient.get(`/destinations${params}`);
  },
  
  search: (query, destinationType = null) => {
    return apiClient.post('/destinations/search', {
      query,
      destination_type: destinationType
    });
  },
  
  getById: (id) => {
    return apiClient.get(`/destinations/${id}`);
  },
  
  getRecommendations: (preferences) => {
    return apiClient.post('/recommendations', { preferences });
  }
};

// User API
export const userApi = {
  login: (credentials) => {
    return apiClient.post('/auth/login', credentials);
  },
  
  register: (userData) => {
    return apiClient.post('/auth/register', userData);
  },
  
  getProfile: () => {
    return apiClient.get('/user/profile');
  },
  
  updateProfile: (userData) => {
    return apiClient.put('/user/profile', userData);
  }
};

// Booking API
export const bookingApi = {
  create: (bookingData) => {
    return apiClient.post('/bookings', bookingData);
  },
  
  getUserBookings: () => {
    return apiClient.get('/bookings/user');
  },
  
  getById: (id) => {
    return apiClient.get(`/bookings/${id}`);
  },
  
  cancel: (id) => {
    return apiClient.delete(`/bookings/${id}`);
  }
};

export default apiClient;