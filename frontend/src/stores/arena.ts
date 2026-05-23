import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ArenaMode = 'speed' | 'scramble' | 'hunt' | 'memory';

export interface ArenaState {
  xp: number;
  totalGames: number;
  bestScores: Record<ArenaMode, number>;
  lastPlayed: string | null;
  streak: number;
  addXp: (amount: number) => void;
  finishGame: (mode: ArenaMode, score: number) => { leveledUp: boolean; newBest: boolean };
}

const todayKey = () => new Date().toISOString().slice(0, 10);

function xpForLevel(level: number) {
  return 100 + level * 50;
}

export function levelFromXp(xp: number) {
  let level = 1;
  let remaining = xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, current: remaining, needed: xpForLevel(level) };
}

export const useArenaStore = create<ArenaState>()(
  persist(
    (set, get) => ({
      xp: 0,
      totalGames: 0,
      bestScores: { speed: 0, scramble: 0, hunt: 0, memory: 0 },
      lastPlayed: null,
      streak: 0,
      addXp: (amount) => set({ xp: get().xp + amount }),
      finishGame: (mode, score) => {
        const before = levelFromXp(get().xp);
        const newXp = get().xp + score;
        const after = levelFromXp(newXp);
        const today = todayKey();
        const last = get().lastPlayed;
        let streak = get().streak;
        if (last !== today) {
          if (last) {
            const lastD = new Date(last);
            const diff = Math.round((Date.now() - lastD.getTime()) / 86400000);
            streak = diff === 1 ? streak + 1 : 1;
          } else {
            streak = 1;
          }
        } else if (streak === 0) {
          streak = 1;
        }
        const prevBest = get().bestScores[mode] || 0;
        const newBest = score > prevBest;
        set({
          xp: newXp,
          totalGames: get().totalGames + 1,
          lastPlayed: today,
          streak,
          bestScores: { ...get().bestScores, [mode]: Math.max(prevBest, score) },
        });
        return { leveledUp: after.level > before.level, newBest };
      },
    }),
    { name: 'vocab-arena' }
  )
);
