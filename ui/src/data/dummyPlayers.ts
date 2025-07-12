import { Player, FieldingStats } from '../types';

export const dummyPlayerStats: FieldingStats = {
  matches: 3,
  innings: 3,
  runs: 36,
  notOuts: 1,
  bestScore: 26,
  strikeRate: 112.50,
  average: 18.00,
  fours: 2,
  sixes: 1,
  thirties: 0,
  fifties: 0,
  hundreds: 0
};

export const dummyPlayers: Player[] = [
  {
    id: '1',
    name: 'Nicholas Pooran',
    team: 'West Indies',
    battingStats: {
      runs: 14,
      balls: 12,
      fours: 1,
      sixes: 1,
      strikeRate: 116.67,
      isOut: false,
      notOut: true
    }
  },
  {
    id: '2',
    name: 'Kieron Pollard',
    team: 'West Indies',
    battingStats: {
      runs: 2,
      balls: 5,
      fours: 0,
      sixes: 0,
      strikeRate: 40.00,
      isOut: false,
      notOut: true
    }
  },
  {
    id: '3',
    name: 'Shikhar Dhawan',
    team: 'India',
    fieldingStats: dummyPlayerStats
  },
  {
    id: '4',
    name: 'Virat Kohli',
    team: 'India',
    fieldingStats: {
      matches: 15,
      innings: 14,
      runs: 523,
      notOuts: 3,
      bestScore: 89,
      strikeRate: 145.20,
      average: 47.54,
      fours: 45,
      sixes: 12,
      thirties: 4,
      fifties: 3,
      hundreds: 0
    }
  },
  {
    id: '5',
    name: 'Rohit Sharma',
    team: 'India',
    fieldingStats: {
      matches: 12,
      innings: 11,
      runs: 398,
      notOuts: 2,
      bestScore: 67,
      strikeRate: 138.50,
      average: 44.22,
      fours: 38,
      sixes: 15,
      thirties: 3,
      fifties: 2,
      hundreds: 0
    }
  },
  {
    id: '6',
    name: 'Chris Gayle',
    team: 'West Indies',
    fieldingStats: {
      matches: 8,
      innings: 8,
      runs: 245,
      notOuts: 1,
      bestScore: 75,
      strikeRate: 165.50,
      average: 35.00,
      fours: 18,
      sixes: 22,
      thirties: 2,
      fifties: 1,
      hundreds: 0
    }
  }
];