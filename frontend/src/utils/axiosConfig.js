import axios from 'axios';
import { BASE_URL } from '../config';

const instance = axios.create({
  baseURL: BASE_URL
});

instance.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
