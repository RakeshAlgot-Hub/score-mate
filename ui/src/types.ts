export interface Player {
  id: string;
  name: string;
  team: string;
  battingStats?: BattingStats;
  bowlingStats?: BowlingStats;
  fieldingStats?: FieldingStats;
}

export interface BattingStats {
  runs: number;
  balls: number;
  fours: number;
  sixes: number;
  strikeRate: number;
  isOut: boolean;
  dismissalType?: string;
  notOut?: boolean;
}

export interface BowlingStats {
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

export interface FieldingStats {
  matches: number;
  innings: number;
  runs: number;
  notOuts: number;
  bestScore: number;
  strikeRate: number;
  average: number;
  fours: number;
  sixes: number;
  thirties: number;
  fifties: number;
  hundreds: number;
}

export interface Match {
  id?: string;
  hostTeam: string;
  visitorTeam: string;
  overs: number;
  tossWinner: string;
  decision: 'bat' | 'bowl';
  status?: 'in_progress' | 'completed';
  currentScore?: {
    runs: number;
    wickets: number;
    overs: number;
    balls: number;
  };
  battingTeam?: string;
  bowlingTeam?: string;
  createdAt?: string;
}

export interface MatchSummary {
  id: string;
  hostTeam: string;
  visitorTeam: string;
  status: string;
  totalRuns: number;
  wickets: number;
  overs: number;
  createdAt: string;
}

export interface BallUpdate {
  run: number;
  isWicket?: boolean;
  extraType?: 'wide' | 'noBall' | 'bye' | 'legBye';
  batsmanId?: string;
  bowlerId?: string;
}

export interface Scoreboard {
  batting: BattingStats[];
  bowling: BowlingStats[];
  totalRuns: number;
  wickets: number;
  overs: number;
  balls: number;
  extras: {
    wides: number;
    noBalls: number;
    byes: number;
    legByes: number;
    penalties: number;
    total: number;
  };
  fallOfWickets: Array<{
    wicket: number;
    runs: number;
    over: number;
    batsman: string;
  }>;
}

export interface CurrentOver {
  balls: Array<string | number>;
  overNumber: number;
}

export interface CurrentBatsmen {
  striker: Player;
  nonStriker: Player;
}

export interface CurrentBowler {
  bowler: Player;
}