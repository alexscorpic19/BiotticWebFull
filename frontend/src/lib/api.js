import axios from '@/utils/axiosConfig';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// You can add interceptors for handling tokens or errors globally
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).token : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export { api };
