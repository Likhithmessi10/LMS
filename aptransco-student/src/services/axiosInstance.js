import axios from 'axios';
import { OPENEDX_CONFIG } from '../config/openedx';

const axiosInstance = axios.create({
  baseURL: OPENEDX_CONFIG.BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('openedx_access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;