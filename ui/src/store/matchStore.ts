import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentMatch, MatchScoreboard, MatchSettings, ApiError, Match } from '../types';

interface MatchHistory {
  id: string;
  hostTeam: string;
  visitorTeam: string;
  lastUpdated: string;
  status: string;
  currentScore?: string;
}

interface MatchStore {
  currentMatch: CurrentMatch | null;
  isLoading: boolean;
  error: string | null;

  // Core actions
  setCurrentMatch: (match: CurrentMatch) => void;
  updateScoreboard: (scoreboard: MatchScoreboard) => void;
  updateSettings: (settings: MatchSettings) => void;
  clearCurrentMatch: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Utility functions
  getCurrentScore: () => string;
  isMatchActive: () => boolean;

  // Local storage management
  persistMatchIdToStorage: (matchId: string) => void;
  loadMatchFromStorage: () => string | null;
  addMatchToLocalHistory: (match: Match) => void;
  getLocalMatchHistory: () => MatchHistory[];
  clearStorage: () => void;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      currentMatch: null,
      isLoading: false,
      error: null,

      setCurrentMatch: (match: CurrentMatch) => {
        set({
          currentMatch: { ...match },
          error: null,
        });
      },

      updateScoreboard: (scoreboard: MatchScoreboard) => {
        const current = get().currentMatch;
        if (!current) return;

        set({
          currentMatch: {
            ...current,
            scoreboard: { ...scoreboard },
          },
        });
      },

      updateSettings: (settings: MatchSettings) => {
        const current = get().currentMatch;
        if (current) {
          set({
            currentMatch: {
              ...current,
              settings: { ...settings },
            },
          });
        }
      },

      clearCurrentMatch: () => {
        set({
          currentMatch: null,
          error: null,
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      getCurrentScore: () => {
        const match = get().currentMatch;
        if (!match?.scoreboard) return '0/0 (0.0)';

        const { score, wickets, balls } = match.scoreboard;
        const overs = Math.floor(balls / 6);
        const remaining = balls % 6;
        return `${score}/${wickets} (${overs}.${remaining})`;
      },

      isMatchActive: () => {
        const match = get().currentMatch;
        return !!(match?.scoreboard && !match.scoreboard.isComplete);
      },

      // Local storage management
      persistMatchIdToStorage: (matchId: string) => {
        localStorage.setItem('currentMatchId', matchId);
      },

      loadMatchFromStorage: () => {
        return localStorage.getItem('currentMatchId');
      },

      addMatchToLocalHistory: (match: Match) => {
        const history = get().getLocalMatchHistory();
        const matchHistory: MatchHistory = {
          id: match.id,
          hostTeam: match.hostTeam.name,
          visitorTeam: match.visitorTeam.name,
          lastUpdated: match.lastUpdated,
          status: match.status,
          currentScore: match.scoreboard ? 
            `${match.scoreboard.score}/${match.scoreboard.wickets} (${Math.floor(match.scoreboard.balls / 6)}.${match.scoreboard.balls % 6})` 
            : undefined,
        };

        // Remove existing entry if it exists
        const filteredHistory = history.filter(h => h.id !== match.id);
        const updatedHistory = [matchHistory, ...filteredHistory].slice(0, 20); // Keep last 20 matches

        localStorage.setItem('matchHistory', JSON.stringify(updatedHistory));
      },

      getLocalMatchHistory: () => {
        try {
          const history = localStorage.getItem('matchHistory');
          return history ? JSON.parse(history) : [];
        } catch {
          return [];
        }
      },

      clearStorage: () => {
        localStorage.removeItem('currentMatchId');
        localStorage.removeItem('matchHistory');
      },
    }),
    {
      name: 'scoremate-match-store',
      partialize: (state) => ({
        currentMatch: state.currentMatch
          ? {
              id: state.currentMatch.id,
            }
          : null,
      }),
    }
  )
);

// Central error helper
export const handleApiError = (error: ApiError | any): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
};