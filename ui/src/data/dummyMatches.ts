import { Match, MatchSummary } from '../types';

export const dummyMatches: MatchSummary[] = [
  {
    id: '1',
    hostTeam: 'West Indies',
    visitorTeam: 'India',
    status: 'in_progress',
    totalRuns: 22,
    wickets: 2,
    overs: 3.5,
    createdAt: '17/08/2019 - 02:49 PM'
  },
  {
    id: '2',
    hostTeam: 'Australia',
    visitorTeam: 'England',
    status: 'completed',
    totalRuns: 156,
    wickets: 8,
    overs: 20.0,
    createdAt: '15/08/2019 - 01:30 PM'
  },
  {
    id: '3',
    hostTeam: 'Pakistan',
    visitorTeam: 'South Africa',
    status: 'in_progress',
    totalRuns: 89,
    wickets: 3,
    overs: 12.4,
    createdAt: '14/08/2019 - 11:15 AM'
  },
  {
    id: '4',
    hostTeam: 'New Zealand',
    visitorTeam: 'Sri Lanka',
    status: 'completed',
    totalRuns: 178,
    wickets: 6,
    overs: 20.0,
    createdAt: '13/08/2019 - 09:30 AM'
  }
];

export const dummyMatch: Match = {
  id: '1',
  hostTeam: 'West Indies',
  visitorTeam: 'India',
  overs: 20,
  tossWinner: 'West Indies',
  decision: 'bat',
  status: 'in_progress',
  currentScore: { runs: 22, wickets: 2, overs: 3, balls: 5 },
  battingTeam: 'West Indies',
  bowlingTeam: 'India',
  createdAt: '17/08/2019 - 02:49 PM'
};