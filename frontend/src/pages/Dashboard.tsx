import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, useAppStore } from '../stores';
import { vocabAPI } from '../services/api';
import {
  BookOpen, Brain, Flame, Target, RotateCcw,
  ArrowRight, Library, Zap, TrendingUp
} from 'lucide-react';

interface VocabStats {
  total_words: number;
  new: number;
  learning: number;
  familiar: number;
  mastered: number;
}

export default function Dashboard() {
  const { user } = useAuthStore();
  const { srsStats, fetchSRSStats } = useAppStore();
  const [vocabStats, setVocabStats] = useState<VocabStats | null>(null);

  useEffect(() => {
    fetchSRSStats();
    vocabAPI.getStats().then((r) => setVocabStats(r.data)).catch(() => {});
  }, []);

  const progressPct = vocabStats && vocabStats.total_words > 0
    ? Math.round(((vocabStats.mastered + vocabStats.familiar) / vocabStats.total_words) * 100)
    : 0;

  const firstName = user?.name?.split(' ')[0] || 'Learner';

  return (
    <div className="space-y-6 animate-slide-up">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-white">
            Good day, {firstName} 👋
          </h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            Here's your learning overview
          </p>
        </div>
        {(user?.streak ?? 0) > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg">
            <Flame className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">{user?.streak} day streak</span>
          </div>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Words',
            value: vocabStats?.total_words ?? '—',
            icon: BookOpen,
            iconBg: 'bg-blue-50 dark:bg-blue-900/20',
            iconColor: 'text-blue-500',
            href: '/vocabulary',
          },
          {
            label: 'Mastered',
            value: vocabStats?.mastered ?? '—',
            icon: Zap,
            iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
            iconColor: 'text-emerald-500',
            href: '/vocabulary',
          },
          {
            label: 'Due Today',
            value: srsStats?.due_today ?? '—',
            icon: RotateCcw,
            iconBg: 'bg-primary-50 dark:bg-primary-900/20',
            iconColor: 'text-primary-500',
            href: '/review',
          },
          {
            label: 'Accuracy',
            value: srsStats ? `${Math.round(srsStats.accuracy_today)}%` : '—',
            icon: Target,
            iconBg: 'bg-pink-50 dark:bg-pink-900/20',
            iconColor: 'text-pink-500',
            href: '/',
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} to={s.href} className="card group hover:shadow-card-hover transition-all duration-150">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-8 h-8 ${s.iconBg} rounded-lg flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${s.iconColor}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-surface-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{s.label}</p>
            </Link>
          );
        })}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              href: '/review',
              icon: RotateCcw,
              label: 'Practice',
              description: srsStats?.due_today
                ? `${srsStats.due_today} cards due`
                : 'All caught up',
              accent: 'from-primary-500 to-violet-600',
              badge: srsStats?.due_today,
            },
            {
              href: '/flashcards',
              icon: BookOpen,
              label: 'Flashcards',
              description: 'Learn new words',
              accent: 'from-blue-500 to-cyan-500',
            },
            {
              href: '/quiz',
              icon: Brain,
              label: 'Take a Quiz',
              description: 'Test your memory',
              accent: 'from-emerald-500 to-teal-500',
            },
          ].map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.href}
                to={a.href}
                className="group relative overflow-hidden card hover:shadow-card-hover transition-all duration-150 flex items-center gap-4 p-5"
              >
                <div className={`w-10 h-10 bg-gradient-to-br ${a.accent} rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-surface-900 dark:text-white">{a.label}</p>
                    {a.badge ? (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{a.badge}</span>
                    ) : null}
                  </div>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{a.description}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-surface-300 dark:text-surface-600 group-hover:text-surface-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* Progress */}
      <div>
        <h2 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Progress</h2>
        <div className="card space-y-5">
          {/* Overall bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-primary-500" />
                <span className="text-sm font-medium text-surface-800 dark:text-surface-200">Overall mastery</span>
              </div>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-400">{progressPct}%</span>
            </div>
            <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-violet-500 h-2 rounded-full transition-all duration-700"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Status breakdown */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {[
              { label: 'New', value: vocabStats?.new ?? 0, color: 'text-surface-400 dark:text-surface-500', bg: 'bg-surface-100 dark:bg-surface-700' },
              { label: 'Learning', value: vocabStats?.learning ?? 0, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
              { label: 'Familiar', value: vocabStats?.familiar ?? 0, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-900/20' },
              { label: 'Mastered', value: vocabStats?.mastered ?? 0, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-lg p-3 text-center`}>
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-surface-500 dark:text-surface-400 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Library shortcut */}
      <Link to="/vocabulary" className="card group flex items-center gap-4 hover:shadow-card-hover transition-all duration-150">
        <div className="w-10 h-10 bg-surface-100 dark:bg-surface-700 rounded-xl flex items-center justify-center flex-shrink-0">
          <Library className="w-5 h-5 text-surface-600 dark:text-surface-300" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-surface-900 dark:text-white">Vocabulary Library</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Browse {vocabStats?.total_words ?? 0} IELTS words</p>
        </div>
        <ArrowRight className="w-4 h-4 text-surface-300 dark:text-surface-600 group-hover:translate-x-0.5 group-hover:text-surface-500 transition-all" />
      </Link>
    </div>
  );
}
