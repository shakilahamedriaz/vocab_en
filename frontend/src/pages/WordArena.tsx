import { Link } from 'react-router-dom';
import { Zap, Shuffle, Crosshair, Layers, Trophy, Flame, Star, TrendingUp } from 'lucide-react';
import { useArenaStore, levelFromXp } from '../stores/arena';

const modes = [
  {
    id: 'speed',
    to: '/arena/speed',
    name: 'Speed Match',
    tag: 'Reflex',
    icon: Zap,
    grad: 'arena-grad-speed',
    desc: '60 seconds. Pick the right meaning. Chain combos for huge bonuses.',
  },
  {
    id: 'scramble',
    to: '/arena/scramble',
    name: 'Word Scramble',
    tag: 'Brain',
    icon: Shuffle,
    grad: 'arena-grad-scramble',
    desc: 'Letters scrambled. Unjumble them as fast as you can. Hints cost XP.',
  },
  {
    id: 'hunt',
    to: '/arena/hunt',
    name: 'Synonym Hunt',
    tag: 'Strategy',
    icon: Crosshair,
    grad: 'arena-grad-hunt',
    desc: 'Find every synonym in the word cloud. Wrong picks cost lives.',
  },
  {
    id: 'memory',
    to: '/arena/memory',
    name: 'Memory Match',
    tag: 'Memory',
    icon: Layers,
    grad: 'arena-grad-memory',
    desc: 'Flip cards. Match word to meaning. Fewer moves wins gold.',
  },
] as const;

export default function WordArena() {
  const { xp, totalGames, streak, bestScores } = useArenaStore();
  const { level, current, needed } = levelFromXp(xp);
  const pct = (current / needed) * 100;
  const totalBest = Object.values(bestScores).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-8">
      {/* Header / logo */}
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center arena-glow">
            <Trophy className="w-7 h-7 text-white" />
            <span className="absolute -bottom-1 -right-1 text-[10px] font-bold bg-white text-purple-600 rounded-full w-5 h-5 flex items-center justify-center shadow-md">
              {level}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">
              Word Arena
            </h1>
            <p className="text-xs text-surface-500 dark:text-surface-400">
              Play, level up, dominate your vocabulary.
            </p>
          </div>
        </div>

        {/* Level progress */}
        <div className="w-full max-w-xs">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="font-semibold text-surface-700 dark:text-surface-200">Level {level}</span>
            <span className="text-surface-500 dark:text-surface-400">{current} / {needed} XP</span>
          </div>
          <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </header>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill icon={Star}      label="Total XP"   value={xp} color="text-purple-600" />
        <StatPill icon={Flame}     label="Streak"     value={`${streak} day${streak === 1 ? '' : 's'}`} color="text-amber-500" />
        <StatPill icon={Trophy}    label="Games"      value={totalGames} color="text-emerald-600" />
        <StatPill icon={TrendingUp} label="Best score" value={totalBest} color="text-pink-600" />
      </div>

      {/* Mode cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((m) => {
          const Icon = m.icon;
          return (
            <Link key={m.id} to={m.to} className={`arena-card ${m.grad} arena-glow group`}>
              {/* Decorative blobs */}
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-8 w-28 h-28 bg-white/5 rounded-full blur-xl" />

              <div className="relative flex items-start justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/15 px-2 py-1 rounded-full backdrop-blur-sm">
                  {m.tag}
                </span>
              </div>

              <h3 className="relative text-xl font-bold text-white tracking-tight mb-1">{m.name}</h3>
              <p className="relative text-sm text-white/85 leading-relaxed mb-4">{m.desc}</p>

              <div className="relative flex items-center justify-between text-xs text-white/90">
                <span>Best: <b className="text-white">{bestScores[m.id]}</b></span>
                <span className="font-semibold opacity-90 group-hover:translate-x-1 transition-transform">
                  Play →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function StatPill({ icon: Icon, label, value, color }: { icon: any; label: string; value: any; color: string }) {
  return (
    <div className="card flex items-center gap-3 !p-4">
      <div className={`w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-700/50 flex items-center justify-center ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-surface-500 dark:text-surface-400 font-medium">{label}</p>
        <p className="text-base font-bold text-surface-900 dark:text-white truncate">{value}</p>
      </div>
    </div>
  );
}
