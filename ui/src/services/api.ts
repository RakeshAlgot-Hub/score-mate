import axios from 'axios';
import { MatchConfig, MatchSettings, OpeningPlayers, BallData } from '../types';

const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    // console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const createMatch = (data: MatchConfig) => 
  api.post('/matches', data);

export const updateMatchSettings = (id: string, data: MatchSettings) => 
  api.put(`/matches/${id}/settings`, data);

export const setOpeningPlayers = (id: string, data: OpeningPlayers) => 
  api.put(`/matches/${id}/opening-players`, data);

export const submitBall = (id: string, data: BallData) => 
  api.post(`/matches/${id}/ball`, data);

export const getScoreboard = (id: string) => 
  api.get(`/matches/${id}/scoreboard`);

export const fetchMatches = () => 
  api.get('/matches');

export const fetchMatch = (id: string) => 
  api.get(`/matches/${id}`);

export default api;