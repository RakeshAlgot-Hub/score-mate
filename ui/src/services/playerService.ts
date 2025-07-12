import axios from 'axios';
import { Player, FieldingStats } from '../types';
import { USE_DUMMY_DATA, API_CONFIG } from '../config/appConfig';
import { dummyPlayerStats, dummyPlayers } from '../data/dummyPlayers';

const { baseUrl } = API_CONFIG;

export const getPlayerStats = async (playerId: string): Promise<FieldingStats> => {
  if (USE_DUMMY_DATA) {
    return Promise.resolve(dummyPlayerStats);
  }
  
  try {
    const response = await axios.get(`${baseUrl}/players/${playerId}`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return dummyPlayerStats;
  }
};

export const getAllPlayers = async (): Promise<Player[]> => {
  if (USE_DUMMY_DATA) {
    return Promise.resolve(dummyPlayers);
  }
  
  try {
    const response = await axios.get(`${baseUrl}/players`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return dummyPlayers;
  }
};