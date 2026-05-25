import { useEffect, useState } from 'react';
import { learningAPI, srsAPI } from '../services/api';
import toast from 'react-hot-toast';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Shuffle } from 'lucide-react';

interface FlashcardWord {
  id: string;
  word: string;
  part_of_speech: string;
  meaning: string;
  meaning_bengali?: string;
  pronunciation?: string;
  synonyms: string[];
  examples: string[];
  difficulty: string;
}

const RATE_BUTTONS = [
  { quality: 1, label: 'Again', bg: 'bg-red-500 hover:bg-red-600 active:bg-red-700' },
  { quality: 3, label: 'Hard', bg: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700' },
  { quality: 4, label: 'Good', bg: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700' },
  { quality: 5, label: 'Easy', bg: 'bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700' },
];

export default function Flashcards() {
  const [words, setWords] = useState<FlashcardWord[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<'mixed' | 'new' | 'review'>('mixed');

  useEffect(() => { loadDeck(); }, [mode]);

  const loadDeck = async () => {
    setLoading(true);
    try {
      const res = await learningAPI.getFlashcards({ limit: 20, mode });
      setWords(res.data.words);
      setCurrentIndex(0);
      setIsFlipped(false);
    } catch {
      toast.error('Failed to load flashcards');
    } finally {
      setLoading(false);
    }
  };

  const currentWord = words[currentIndex];

  const handleReview = async (quality: number) => {
    if (!currentWord) return;
    try {
      await srsAPI.submitReview({ word_id: currentWord.id, quality, review_mode: 'flashcard' });
      toast.success(quality >= 3 ? '✓ Got it!' : '↻ Will review again', { duration: 1000 });
      if (currentIndex < words.length - 1) {
        setCurrentIndex((i) => i + 1);
        setIsFlipped(false);
      } else {
        toast.success('Deck complete!');
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

  if (words.length === 0) return (
    <div className="text-center py-20">
      <BookOpen className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
      <p className="font-medium text-surface-700 dark:text-surface-300">No cards available</p>
      <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 mb-4">Try switching modes or come back later</p>
      <button onClick={loadDeck} className="btn-secondary">Retry</button>
    </div>
  );

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-white">Flashcards</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">{currentIndex + 1} / {words.length}</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="input-field w-auto text-xs py-1.5"
          >
            <option value="mixed">Mixed</option>
            <option value="new">New</option>
            <option value="review">Review</option>
          </select>
          <button onClick={() => { setWords([...words].sort(() => Math.random() - 0.5)); setCurrentIndex(0); setIsFlipped(false); }} className="btn-ghost p-2">
            <Shuffle className="w-4 h-4" />
          </button>
          <button onClick={loadDeck} className="btn-ghost p-2">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / words.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div className="flashcard-container" onClick={() => setIsFlipped(!isFlipped)}>
        <div className={`flashcard relative`} style={{ minHeight: '280px' }}>
          {/* Front */}
          <div className="flashcard-front absolute inset-0 card flex flex-col items-center justify-center text-center p-8 cursor-pointer select-none">
            <p className="text-xs text-surface-400 dark:text-surface-500 mb-3">{currentWord.part_of_speech}</p>
            <h2 className="text-4xl font-bold text-surface-900 dark:text-white mb-2">{currentWord.word}</h2>
            {currentWord.pronunciation && (
              <p className="text-sm text-surface-500 dark:text-surface-400">{currentWord.pronunciation}</p>
            )}
            <p className="text-xs text-surface-400 dark:text-surface-500 mt-8">Tap to reveal</p>
          </div>

          {/* Back */}
          <div className="flashcard-back absolute inset-0 card flex flex-col justify-center p-7 select-none">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-surface-900 dark:text-white">{currentWord.word}</h3>
              <span className={`badge text-[10px] ${currentWord.difficulty === 'advanced' ? 'badge-red' : currentWord.difficulty === 'beginner' ? 'badge-green' : 'badge-amber'}`}>
                {currentWord.difficulty}
              </span>
            </div>

            <p className="text-base text-surface-700 dark:text-surface-300 mb-3 leading-relaxed">{currentWord.meaning}</p>

            {currentWord.meaning_bengali && (
              <div className="mb-3 p-2.5 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">{currentWord.meaning_bengali}</p>
              </div>
            )}

            {currentWord.synonyms?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-surface-400 dark:text-surface-500 mb-1.5">Synonyms</p>
                <div className="flex flex-wrap gap-1.5">
                  {currentWord.synonyms.slice(0, 4).map((s, i) => (
                    <span key={i} className="text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {currentWord.examples?.length > 0 && (
              <p className="text-xs text-surface-500 dark:text-surface-400 italic border-l-2 border-surface-200 dark:border-surface-700 pl-3">
                "{currentWord.examples[0]}"
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Navigation row */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { if (currentIndex > 0) { setCurrentIndex((i) => i - 1); setIsFlipped(false); } }}
          disabled={currentIndex === 0}
          className="btn-secondary disabled:opacity-30 p-2"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Rating buttons (only when flipped) */}
        <div className={`flex gap-2 transition-opacity duration-200 ${isFlipped ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          {RATE_BUTTONS.map((btn) => (
            <button
              key={btn.quality}
              onClick={(e) => { e.stopPropagation(); handleReview(btn.quality); }}
              className={`${btn.bg} text-white text-xs font-medium px-3.5 py-2 rounded-lg transition-colors`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => { if (currentIndex < words.length - 1) { setCurrentIndex((i) => i + 1); setIsFlipped(false); } }}
          disabled={currentIndex === words.length - 1}
          className="btn-secondary disabled:opacity-30 p-2"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <p className="text-center text-xs text-surface-400 dark:text-surface-600">
        Space: flip · ← →: navigate · 1–4: rate
      </p>
    </div>
  );
}
