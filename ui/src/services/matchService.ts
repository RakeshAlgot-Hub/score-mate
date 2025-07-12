import axios from 'axios';
import { Match, MatchSummary } from '../types';
import { USE_DUMMY_DATA, API_CONFIG } from '../config/appConfig';
import { dummyMatches, dummyMatch } from '../data/dummyMatches';

const { baseUrl } = API_CONFIG;

export const createMatch = async (data: Match): Promise<Match> => {
  if (USE_DUMMY_DATA) {
    // Create new match with dummy data
    const newMatch = {
      ...data,
      id: Date.now().toString(),
      status: 'in_progress' as const,
      currentScore: { runs: 0, wickets: 0, overs: 0, balls: 0 },
      battingTeam: data.decision === 'bat' ? data.tossWinner : (data.tossWinner === data.hostTeam ? data.visitorTeam : data.hostTeam),
      bowlingTeam: data.decision === 'bowl' ? data.tossWinner : (data.tossWinner === data.hostTeam ? data.visitorTeam : data.hostTeam),
      createdAt: new Date().toLocaleString()
    };
    localStorage.setItem('currentMatch', JSON.stringify(newMatch));
    return Promise.resolve(newMatch);
  }
  
  try {
    const response = await axios.post(`${baseUrl}/matches`, data);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    // Fallback to dummy data on error
    const newMatch = {
      ...data,
      id: Date.now().toString(),
      status: 'in_progress' as const,
      currentScore: { runs: 0, wickets: 0, overs: 0, balls: 0 },
      battingTeam: data.decision === 'bat' ? data.tossWinner : (data.tossWinner === data.hostTeam ? data.visitorTeam : data.hostTeam),
      bowlingTeam: data.decision === 'bowl' ? data.tossWinner : (data.tossWinner === data.hostTeam ? data.visitorTeam : data.hostTeam),
      createdAt: new Date().toLocaleString()
    };
    localStorage.setItem('currentMatch', JSON.stringify(newMatch));
    return newMatch;
  }
};

export const getAllMatches = async (): Promise<MatchSummary[]> => {
  if (USE_DUMMY_DATA) {
    const storedMatches = localStorage.getItem('matchHistory');
    return Promise.resolve(storedMatches ? JSON.parse(storedMatches) : dummyMatches);
  }
  
  try {
    const response = await axios.get(`${baseUrl}/matches`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    const storedMatches = localStorage.getItem('matchHistory');
    return storedMatches ? JSON.parse(storedMatches) : dummyMatches;
  }
};

export const getMatchById = async (id: string): Promise<Match> => {
  if (USE_DUMMY_DATA) {
    const currentMatch = localStorage.getItem('currentMatch');
    if (currentMatch) {
      return Promise.resolve(JSON.parse(currentMatch));
    }
    return Promise.resolve({ ...dummyMatch, id });
  }
  
  try {
    const response = await axios.get(`${baseUrl}/matches/${id}`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    const currentMatch = localStorage.getItem('currentMatch');
    if (currentMatch) {
      return JSON.parse(currentMatch);
    }
    return { ...dummyMatch, id };
  }
};

export const resumeMatch = async (id: string): Promise<Match> => {
  if (USE_DUMMY_DATA) {
    return getMatchById(id);
  }
  
  try {
    const response = await axios.put(`${baseUrl}/matches/${id}/resume`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return getMatchById(id);
  }
};