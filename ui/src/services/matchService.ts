import axiosInstance from './http';
import { MatchConfig, MatchSettings, Match, ApiResponse } from '../types';

export const createMatch = async (data: MatchConfig): Promise<ApiResponse<{ id: string; scoreboard: any }>> => {
  const response = await axiosInstance.post('/matches', data); 
  return response.data.result;
};

export const getMatchById = async (id: string): Promise<ApiResponse<Match>> => {
  const response = await axiosInstance.get(`/matches/${id}`);
  return response.data.result;
};

export const updateMatchSettings = async (id: string, settings: MatchSettings): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.put(`/matches/${id}/settings`, settings);
  return response.data.result;
};

export const getAllMatches = async (): Promise<ApiResponse<Match[]>> => {
  const response = await axiosInstance.get('/matches');
  return response.data.result;
};

export const deleteMatch = async (id: string): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.delete(`/matches/${id}`);
  return response.data.result;
};
