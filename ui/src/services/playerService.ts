import axiosInstance from './http';
import { PlayerStats, BowlerStats, ApiResponse } from '../types';

export const getPlayerStats = async (matchId: string, playerName: string): Promise<ApiResponse<PlayerStats>> => {
  const response = await axiosInstance.get<ApiResponse<PlayerStats>>(`/matches/${matchId}/players/${playerName}/stats`);
  return response.data;
};

export const getBowlerStats = async (matchId: string, bowlerName: string): Promise<ApiResponse<BowlerStats>> => {
  const response = await axiosInstance.get<ApiResponse<BowlerStats>>(`/matches/${matchId}/bowlers/${bowlerName}/stats`);
  return response.data;
};

export const getTeamStats = async (matchId: string, teamName: string): Promise<ApiResponse<{ batsmen: PlayerStats[]; bowlers: BowlerStats[] }>> => {
  const response = await axiosInstance.get<ApiResponse<{ batsmen: PlayerStats[]; bowlers: BowlerStats[] }>>(`/matches/${matchId}/teams/${teamName}/stats`);
  return response.data;
};