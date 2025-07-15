export const API_BASE_URL = '/api';

export const ROUTES = {
  HOME: '/',
  TEAMS: '/teams',
  ADVANCED_SETTINGS: '/advanced-settings',
  SELECT_PLAYERS: '/select-players',
  SCORING: '/scoring',
  SCOREBOARD: '/scoreboard',
  HISTORY: '/history',
} as const;

export const BALL_TYPES = {
  NORMAL: 'normal',
  WIDE: 'wide',
  NO_BALL: 'noBall',
  BYE: 'bye',
  LEG_BYE: 'legBye',
  WICKET: 'wicket',
} as const;

export const WICKET_TYPES = {
  BOWLED: 'bowled',
  CAUGHT: 'caught',
  LBW: 'lbw',
  RUN_OUT: 'runout',
  STUMPED: 'stumped',
  HIT_WICKET: 'hitwicket',
} as const;