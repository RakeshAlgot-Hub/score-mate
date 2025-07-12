import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { API_BASE_URL } from '../constants/appConstants';
import { ApiError } from '../types';

// Create axios instance with base configuration
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging and auth
axiosInstance.interceptors.request.use(
  (config) => {
    // console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    if (config.data) {
      console.log('📤 Request Data:', config.data);
    }
    return config;
  },
  (error: AxiosError) => {
    // console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const data = error.response?.data as { message?: string } | undefined;

    const apiError: ApiError = {
      message: data?.message ?? error.message ?? 'An unexpected error occurred',
      status: error.response?.status ?? 500,
      details: data,
    };

    console.error('❌ API Error:', apiError);
    return Promise.reject(apiError);
  }
);
export default axiosInstance;