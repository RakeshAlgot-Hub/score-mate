import axiosInstance from './http';
import { BallData, MatchScoreboard } from '../types';

export const submitBall = async (matchId: string, ballData: BallData): Promise<void> => {
  await axiosInstance.post(`/matches/${matchId}/ball`, ballData);
};

export const getBalls = async (matchId: string): Promise<BallData[]> => {
  const response = await axiosInstance.get(`/matches/${matchId}/ball`);
  return response.data;
};

export const getScoreboard = async (matchId: string): Promise<MatchScoreboard> => {
  const response = await axiosInstance.get(`/matches/${matchId}/scoreboard`);
  return response.data;
};

export const updateScoreboard = async (matchId: string, scoreboard: MatchScoreboard): Promise<MatchScoreboard> => {
  const response = await axiosInstance.put(`/scoreboard/${matchId}`, scoreboard);
  return response.data;
};

export const createScoreboard = async (scoreboard: MatchScoreboard): Promise<MatchScoreboard> => {
  const response = await axiosInstance.post('/scoreboards', scoreboard);
  return response.data;
};

// Note: Undo functionality not available in current backend
// You'll need to add this endpoint: POST /matches/{matchId}/undo
export const undoLastBall = async (matchId: string): Promise<MatchScoreboard> => {
  throw new Error('Undo functionality not implemented in backend yet');
  // const response = await axiosInstance.post(`/matches/${matchId}/undo`);
  // return response.data;
};