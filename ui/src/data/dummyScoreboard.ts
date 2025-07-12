import { Scoreboard } from '../types';

export const dummyScoreboard: Scoreboard = {
  batting: [
    {
      runs: 0,
      balls: 2,
      fours: 0,
      sixes: 0,
      strikeRate: 0.00,
      isOut: true,
      dismissalType: 'c Krunal Pandya b Washington Sundar'
    },
    {
      runs: 0,
      balls: 4,
      fours: 0,
      sixes: 0,
      strikeRate: 0.00,
      isOut: true,
      dismissalType: 'b Bhuvneshwar Kumar'
    },
    {
      runs: 14,
      balls: 12,
      fours: 1,
      sixes: 1,
      strikeRate: 116.67,
      isOut: false,
      notOut: true
    },
    {
      runs: 2,
      balls: 5,
      fours: 0,
      sixes: 0,
      strikeRate: 40.00,
      isOut: false,
      notOut: true
    }
  ],
  bowling: [
    {
      overs: 2.0,
      maidens: 0,
      runs: 18,
      wickets: 1,
      economy: 9.00
    },
    {
      overs: 1.5,
      maidens: 0,
      runs: 4,
      wickets: 1,
      economy: 2.18
    }
  ],
  totalRuns: 22,
  wickets: 2,
  overs: 3,
  balls: 5,
  extras: {
    wides: 0,
    noBalls: 0,
    byes: 1,
    legByes: 6,
    penalties: 0,
    total: 7
  },
  fallOfWickets: [
    {
      wicket: 1,
      runs: 1,
      over: 0.2,
      batsman: 'John Campbell'
    }
  ]
};