import { useEffect, useState } from 'react';
import { srsAPI } from '../services/api';
import { DueWord, SRSStats } from '../types';
import toast from 'react-hot-toast';
import { CheckCircle, Flame, Target, Clock, RotateCcw } from 'lucide-react';

const RATE_BUTTONS = [
  { quality: 1, label: 'Again', hint: '1 day', bg: 'bg-red-500 hover:bg-red-600', text: 'text-white' },
  { quality: 3, label: 'Hard', hint: '3 days', bg: 'bg-orange-500 hover:bg-orange-600', text: 'text-white' },
  { quality: 4, label: 'Good', hint: '7 days', bg: 'bg-blue-500 hover:bg-blue-600', text: 'text-white' },
  { quality: 5, label: 'Easy', hint: '14 days', bg: 'bg-emerald-500 hover:bg-emerald-600', text: 'text-white' },
];

const STATUS_STYLE: Record<string, string> = {
  new: 'badge-gray',
  learning: 'badge-blue',
  familiar: 'badge-amber',
  mastered: 'badge-green',
};

export default function SRSReview() {
  const [dueWords, setDueWords] = useState<DueWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [stats, setStats] = useState<SRSStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionStats, setSessionStats] = useState({ reviewed: 0, correct: 0 });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [dueRes, statsRes] = await Promise.all([
        srsAPI.getDueWords({ limit: 20 }),
        srsAPI.getStats(),
      ]);
      setDueWords(dueRes.data.due_words);
      setStats(statsRes.data);
    } catch {
      toast.error('Failed to load review session');
    } finally {
      setLoading(false);
    }
  };

  const currentWord = dueWords[currentIndex];

  const handleReview = async (quality: number) => {
    if (!currentWord) return;
    try {
      await srsAPI.submitReview({ word_id: currentWord.word_id, quality, review_mode: 'srs' });
      setSessionStats((s) => ({
        reviewed: s.reviewed + 1,
        correct: s.correct + (quality >= 3 ? 1 : 0),
      }));
      if (currentIndex < dueWords.length - 1) {
        setCurrentIndex((i) => i + 1);
        setShowAnswer(false);
      } else {
        const res = await srsAPI.getDueWords({ limit: 20 });
        if (res.data.due_words.length > 0) {
          setDueWords(res.data.due_words);
          setCurrentIndex(0);
          setShowAnswer(false);
        } else {
          toast.success('All caught up! 🎉');
          setDueWords([]);
        }
      }
    } catch {
      toast.error('Failed to save review');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (dueWords.length === 0) return (
    <div className="max-w-md mx-auto text-center py-16 animate-slide-up">
      <div className="card space-y-4">
        <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-7 h-7 text-emerald-500" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">All caught up!</h2>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">No cards due for review right now.</p>
        </div>
        <button onClick={loadData} className="btn-secondary w-full">
          <RotateCcw className="w-4 h-4" /> Check again
        </button>
      </div>
    </div>
  );

  const accuracyPct = sessionStats.reviewed > 0
    ? Math.round((sessionStats.correct / sessionStats.reviewed) * 100)
    : 0;

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-white">Practice</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {currentIndex + 1} of {dueWords.length}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {stats && (stats.streak ?? 0) > 0 && (
            <div className="flex items-center gap-1.5 text-amber-500">
              <Flame className="w-4 h-4" />
              <span className="text-sm font-semibold">{stats.streak}</span>
            </div>
          )}
          {stats && (
            <div className="flex items-center gap-1 text-surface-500 dark:text-surface-400 text-xs">
              <Clock className="w-3.5 h-3.5" />
              {stats.due_today} due
            </div>
          )}
        </div>
      </div>

      {/* Session mini-stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { label: 'Reviewed', value: sessionStats.reviewed, color: 'text-surface-900 dark:text-white' },
          { label: 'Correct', value: sessionStats.correct, color: 'text-emerald-600 dark:text-emerald-400' },
          { label: 'Accuracy', value: `${accuracyPct}%`, color: 'text-primary-600 dark:text-primary-400' },
        ].map((s) => (
          <div key={s.label} className="card text-center py-3 px-2">
            <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Progress */}
      <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / dueWords.length) * 100}%` }}
        />
      </div>

      {/* Review card */}
      <div className="card min-h-[260px] space-y-4">
        <div className="flex items-center gap-2">
          <span className={STATUS_STYLE[currentWord.mastery_status] || 'badge-gray'}>
            {currentWord.mastery_status}
          </span>
          <span className="badge-blue">{currentWord.part_of_speech}</span>
          {currentWord.overdue_days > 0 && (
            <span className="badge-red">{currentWord.overdue_days}d overdue</span>
          )}
        </div>

        <h2 className="text-4xl font-bold text-surface-900 dark:text-white">{currentWord.word}</h2>

        {!showAnswer ? (
          <div className="flex items-center justify-center py-8">
            <button
              onClick={() => setShowAnswer(true)}
              className="btn-primary px-8 py-2.5"
            >
              Show answer
            </button>
          </div>
        ) : (
          <div className="space-y-3 animate-fade-in">
            <div className="p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
              <p className="text-surface-800 dark:text-surface-200 leading-relaxed">{currentWord.meaning}</p>
            </div>

            {currentWord.meaning_bengali && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl">
                <p className="text-xs font-medium text-amber-600 dark:text-amber-500 mb-0.5">বাংলা</p>
                <p className="text-amber-900 dark:text-amber-300 font-medium">{currentWord.meaning_bengali}</p>
              </div>
            )}

            {currentWord.synonyms?.length > 0 && (
              <div>
                <p className="text-xs text-surface-400 dark:text-surface-500 mb-1.5">Synonyms</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentWord.synonyms.map((syn, i) => (
                    <span key={i} className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2.5 py-0.5 rounded-md">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Rating buttons */}
      {showAnswer && (
        <div className="space-y-2 animate-fade-in">
          <p className="text-xs text-center text-surface-400 dark:text-surface-500">How well did you remember?</p>
          <div className="grid grid-cols-4 gap-2">
            {RATE_BUTTONS.map((btn) => (
              <button
                key={btn.quality}
                onClick={() => handleReview(btn.quality)}
                className={`${btn.bg} ${btn.text} rounded-xl py-3 text-center transition-colors`}
              >
                <p className="text-sm font-semibold">{btn.label}</p>
                <p className="text-[10px] opacity-75 mt-0.5">{btn.hint}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-center text-xs text-surface-400 dark:text-surface-600">
        Space: show · 1: Again · 2: Hard · 3: Good · 4: Easy
      </p>
    </div>
  );
}
