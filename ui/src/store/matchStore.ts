import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentMatch, MatchScoreboard, MatchSettings, ApiError } from '../types';

interface MatchStore {
  currentMatch: CurrentMatch | null;
  isLoading: boolean;
  error: string | null;

  setCurrentMatch: (match: CurrentMatch) => void;
  updateScoreboard: (scoreboard: MatchScoreboard) => void;
  updateSettings: (settings: MatchSettings) => void;
  clearCurrentMatch: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  getCurrentScore: () => string;
  isMatchActive: () => boolean;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      currentMatch: null,
      isLoading: false,
      error: null,

      setCurrentMatch: (match: CurrentMatch) => {
        set({
          currentMatch: { ...match }, // ✅ create new object
          error: null,
        });
      },

      updateScoreboard: (scoreboard: MatchScoreboard) => {
        const current = get().currentMatch;
        if (!current) return;

        set({
          currentMatch: {
            ...current,
            scoreboard: { ...scoreboard }, // ✅ important: copy to trigger re-render
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
    }),
    {
      name: 'scoremate-match-store',
      partialize: (state) => ({
        currentMatch: state.currentMatch
          ? {
              id: state.currentMatch.id, // only minimal info
            }
          : null,
      }),
    }
  )
);

// 🔧 Central error helper
export const handleApiError = (error: ApiError | any): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred. Please try again.';
};
