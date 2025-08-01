// types/index.ts

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

export type BallType = 'normal' | 'wide' | 'noBall' | 'bye' | 'legBye' | 'wicket';

export type WicketType = 'bowled' | 'caught' | 'lbw' | 'runout' | 'stumped' | 'hitwicket';

export interface BallData {
  ballType: BallType;
  runs: number;
  isWicket: boolean;
  commentary?: string;
  wicketType?: WicketType;
  newBatsman?: string;
  batsman?: string;
  bowler?: string;
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

export interface Extras {
  byes: number;
  legByes: number;
  wides: number;
  noBalls: number;
  penalties: number;
  total: number;
}

export interface FallOfWicket {
  wicket: number;
  runs: number;
  over: number;
  batsman: string;
}

export interface MatchScoreboard {
  id: string;
  matchId: string;
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
  extras: Extras;
  fallOfWickets: FallOfWicket[];
  isComplete: boolean;
  result?: string;
  lastUpdated?: string;
  ballHistory?: BallData[]; // recently added
}

export interface Match {
  id: string;
  hostTeam: Team;
  visitorTeam: Team;
  tossWonBy: 'host' | 'visitor';
  optedTo: 'bat' | 'bowl';
  overs: number;
  settings: MatchSettings;
  openingPlayers: OpeningPlayers;
  currentInnings: number;
  battingTeam: string | null;
  bowlingTeam: string | null;
  status: 'active' | 'completed' | 'abandoned';
  createdAt: string;
  lastUpdated: string;
  scoreboard?: MatchScoreboard;
}

export interface CurrentMatch {
  id: string;
  scoreboard: MatchScoreboard;
  settings: MatchSettings;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface ApiError {
  message: string;
  status: number;
  details?: any;
}
