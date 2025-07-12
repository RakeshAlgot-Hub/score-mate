export interface Team {
  name: string;
  players: string[];
}

export interface MatchSettings {
  playersPerTeam: number;
  noBall: { reball: boolean; runs: number };
  wideBall: { reball: boolean; runs: number };
}

export interface MatchConfig {
  hostTeam: Team;
  visitorTeam: Team;
  tossWonBy: 'host' | 'visitor';
  optedTo: 'bat' | 'bowl';
  overs: number;
  settings: MatchSettings;
}

export interface OpeningPlayers {
  striker: string;
  nonStriker: string;
  bowler: string;
}

export interface BallData {
  ballType: 'normal' | 'wide' | 'noBall' | 'bye' | 'legBye' | 'wicket';
  runs: number;
  isWicket: boolean;
  commentary?: string;
  wicketType?: 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped' | 'hitwicket';
  newBatsman?: string;
}

export interface PlayerStats {
  name: string;
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissal?: string;
}

export interface BowlerStats {
  name: string;
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economyRate: number;
}

export interface MatchScoreboard {
  id: string;
  hostTeam: string;
  visitorTeam: string;
  currentInnings: number;
  battingTeam: string;
  bowlingTeam: string;
  score: number;
  wickets: number;
  overs: number;
  balls: number;
  target?: number;
  currentBatsmen: PlayerStats[];
  currentBowler: BowlerStats;
  allBatsmen: PlayerStats[];
  allBowlers: BowlerStats[];
  extras: {
    byes: number;
    legByes: number;
    wides: number;
    noBalls: number;
    penalties: number;
    total: number;
  };
  fallOfWickets: Array<{
    wicket: number;
    runs: number;
    over: number;
    batsman: string;
  }>;
  isComplete: boolean;
  result?: string;
}

export interface Match {
  id: string;
  hostTeam: string;
  visitorTeam: string;
  tossWonBy: string;
  optedTo: string;
  overs: number;
  currentScore: string;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  lastUpdated: string;
}

export interface CurrentMatch {
  id: string;
  scoreboard: MatchScoreboard;
  settings: MatchSettings;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}