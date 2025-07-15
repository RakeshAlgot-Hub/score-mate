import axiosInstance from './http';
import { BallData, MatchScoreboard, OpeningPlayers, ApiResponse } from '../types';

export const submitBall = async (matchId: string, ballData: BallData): Promise<ApiResponse<{ scoreboard: MatchScoreboard }>> => {
  const response = await axiosInstance.post<ApiResponse<{ scoreboard: MatchScoreboard }>>(`/matches/${matchId}/ball`, ballData);
  return response.data;
};

export const getScoreboard = async (matchId: string): Promise<ApiResponse<MatchScoreboard>> => {
  const response = await axiosInstance.get<ApiResponse<MatchScoreboard>>(`/matches/${matchId}/scoreboard`);
  return response.data;
};

export const setOpeningPlayers = async (matchId: string, players: OpeningPlayers): Promise<ApiResponse<void>> => {
  const response = await axiosInstance.put<ApiResponse<void>>(`/matches/${matchId}/opening-players`, players);
  return response.data;
};

export const undoLastBall = async (matchId: string): Promise<ApiResponse<{ scoreboard: MatchScoreboard }>> => {
  const response = await axiosInstance.post<ApiResponse<{ scoreboard: MatchScoreboard }>>(`/matches/${matchId}/undo`);
  return response.data;
};