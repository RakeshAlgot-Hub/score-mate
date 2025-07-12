export const USE_DUMMY_DATA = true; // Set to false to use real backend

export const API_CONFIG = {
  baseUrl: 'http://localhost:8000',
  timeout: 5000,
  retries: 3
};

export const APP_CONFIG = {
  useDummyData: USE_DUMMY_DATA,
  enableDevMode: process.env.NODE_ENV === 'development'
};