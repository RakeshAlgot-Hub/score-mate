import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CurrentMatch, MatchScoreboard, MatchSettings } from '../types';

interface MatchStore {
  currentMatch: CurrentMatch | null;
  setCurrentMatch: (match: CurrentMatch) => void;
  updateScoreboard: (scoreboard: MatchScoreboard) => void;
  updateSettings: (settings: MatchSettings) => void;
  clearCurrentMatch: () => void;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

export const useMatchStore = create<MatchStore>()(
  persist(
    (set, get) => ({
      currentMatch: null,
      isLoading: false,
      error: null,

      setCurrentMatch: (match) => {
        set({ currentMatch: match, error: null });
      },

      updateScoreboard: (scoreboard) => {
        const current = get().currentMatch;
        if (current) {
          set({
            currentMatch: {
              ...current,
              scoreboard,
            },
          });
        }
      },

      updateSettings: (settings) => {
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
        set({ currentMatch: null, error: null });
      },

      setLoading: (loading) => {
        set({ isLoading: loading });
      },

      setError: (error) => {
        set({ error });
      },
    }),
    {
      name: 'score-mate-match',
      partialize: (state) => ({
        currentMatch: state.currentMatch ? {
          id: state.currentMatch.id,
        } : null,
      }),
    }
  )
);