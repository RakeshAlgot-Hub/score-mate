import axios from 'axios';
import { BallUpdate, Scoreboard } from '../types';
import { USE_DUMMY_DATA, API_CONFIG } from '../config/appConfig';
import { dummyScoreboard } from '../data/dummyScoreboard';

const { baseUrl } = API_CONFIG;

export const updateScore = async (
  matchId: string,
  scoreData: BallUpdate
): Promise<void> => {
  if (USE_DUMMY_DATA) {
    // Fallback to localStorage for demo
    const currentMatch = localStorage.getItem('currentMatch');
    if (currentMatch) {
      const match = JSON.parse(currentMatch);
      if (match.currentScore) {
        match.currentScore.runs += scoreData.run;
        if (scoreData.isWicket) {
          match.currentScore.wickets += 1;
        }
        match.currentScore.balls += 1;
        if (match.currentScore.balls === 6) {
          match.currentScore.overs += 1;
          match.currentScore.balls = 0;
        }
      }
      localStorage.setItem('currentMatch', JSON.stringify(match));
    }
    return Promise.resolve();
  }
  
  try {
    await axios.post(`${baseUrl}/matches/${matchId}/ball`, scoreData);
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    // Fallback to localStorage for demo
    const currentMatch = localStorage.getItem('currentMatch');
    if (currentMatch) {
      const match = JSON.parse(currentMatch);
      if (match.currentScore) {
        match.currentScore.runs += scoreData.run;
        if (scoreData.isWicket) {
          match.currentScore.wickets += 1;
        }
        match.currentScore.balls += 1;
        if (match.currentScore.balls === 6) {
          match.currentScore.overs += 1;
          match.currentScore.balls = 0;
        }
      }
      localStorage.setItem('currentMatch', JSON.stringify(match));
    }
  }
};

export const getScoreboard = async (matchId: string): Promise<Scoreboard> => {
  if (USE_DUMMY_DATA) {
    return Promise.resolve(dummyScoreboard);
  }
  
  try {
    const response = await axios.get(`${baseUrl}/matches/${matchId}/scoreboard`);
    return response.data;
  } catch (error) {
    console.warn('API call failed, using fallback data:', error);
    return dummyScoreboard;
  }
};