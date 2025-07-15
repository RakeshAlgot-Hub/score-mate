import axiosInstance from './http';
import { MatchConfig, MatchSettings, Match } from '../types';

export const createMatch = async (data: MatchConfig): Promise<Match> => {
  const response = await axiosInstance.post('/matches', data); 
  return response.data;
};

export const getMatchById = async (id: string): Promise<Match> => {
  const response = await axiosInstance.get(`/matches/${id}`);
  return response.data;
};

export const getAllMatches = async (): Promise<Match[]> => {
  const response = await axiosInstance.get('/matches');
  return response.data;
};

export const updateMatch = async (id: string, match: Partial<Match>): Promise<Match> => {
  const response = await axiosInstance.put(`/matches/${id}`, match);
  return response.data;
};

export const deleteMatch = async (id: string): Promise<void> => {
  await axiosInstance.delete(`/matches/${id}`);
};

export const updateMatchSettings = async (id: string, settings: MatchSettings): Promise<void> => {
  await axiosInstance.put(`/matches/${id}/settings`, settings);
};

export const setOpeningPlayers = async (id: string, players: { striker?: string; nonStriker?: string; bowler?: string }): Promise<void> => {
  await axiosInstance.put(`/matches/${id}/opening-players`, players);
};