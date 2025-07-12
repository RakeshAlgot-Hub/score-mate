import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentMatch, MatchScoreboard, MatchSettings, ApiError } from '../types';

interface MatchStore {
  // State
  currentMatch: CurrentMatch | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setCurrentMatch: (match: CurrentMatch) => void;
  updateScoreboard: (scoreboard: MatchScoreboard) => void;
  updateSettings: (settings: MatchSettings) => void;
  clearCurrentMatch: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Computed
  getCurrentScore: () => string;
  isMatchActive: () => boolean;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      // Initial state
      currentMatch: null,
      isLoading: false,
      error: null,

      // Actions
      setCurrentMatch: (match: CurrentMatch) => {
        set({
          currentMatch: match,
          error: null
        });
      },

      updateScoreboard: (newScoreboard) => {
        set(state => {
          if (!state.currentMatch) return state;
          return {
            ...state,
            currentMatch: {
              ...state.currentMatch,
              scoreboard: newScoreboard,
            }
          };
        });
      },

      updateSettings: (settings: MatchSettings) => {
        const current = get().currentMatch;
        if (current) {
          set({
            currentMatch: {
              ...current,
              settings,
            },
          });
        }
      },

      clearCurrentMatch: () => {
        set({
          currentMatch: null,
          error: null
        });
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      // Computed getters
      getCurrentScore: () => {
        const match = get().currentMatch;
        if (!match?.scoreboard) return '0/0 (0.0)';
        
        const { score, wickets, balls } = match.scoreboard;
        const overs = Math.floor(balls / 6);
        const remainingBalls = balls % 6;
        const oversDisplay = remainingBalls === 0 ? `${overs}` : `${overs}.${remainingBalls}`;
        
        return `${score}/${wickets} (${oversDisplay})`;
      },

      isMatchActive: () => {
        const match = get().currentMatch;
        return !!(match?.scoreboard && !match.scoreboard.isComplete);
      },
    }),
    {
      name: 'scoremate-match-store',
      partialize: (state) => ({
        currentMatch: state.currentMatch ? {
          id: state.currentMatch.id,
          // Only persist essential data, reload full data from API
        } : null,
      }),
    }
  )
);

// Error handling helper
export const handleApiError = (error: ApiError | any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred. Please try again.';
};