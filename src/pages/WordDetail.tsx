import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { vocabAPI, srsAPI } from '../services/api';
import { Word } from '../types';
import toast from 'react-hot-toast';
import {
  ArrowLeft, RefreshCw, Lightbulb, MessageSquare,
  AlertTriangle, Star, Volume2
} from 'lucide-react';

interface Explanation {
  simple_meaning: string;
  academic_usage: string;
  common_mistakes: string[];
  synonym_differences: Record<string, string>;
  real_life_examples: string[];
  tips: string[];
}

interface Sentence {
  sentence: string;
  context: string;
  band_level: number;
  collocations: string[];
}

const CONTEXT_STYLE: Record<string, string> = {
  formal: 'badge-blue',
  ielts: 'badge-purple',
  casual: 'badge-green',
  band8: 'badge-amber',
  collocation: 'badge-gray',
};

export default function WordDetail() {
  const { id } = useParams<{ id: string }>();
  const [word, setWord] = useState<Word | null>(null);
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [sentences, setSentences] = useState<Sentence[]>([]);
  const [loadingExplanation, setLoadingExplanation] = useState(false);
  const [loadingSentences, setLoadingSentences] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    if (id) {
      vocabAPI.getWord(id)
        .then((r) => setWord(r.data))
        .catch(() => toast.error('Word not found'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const loadExplanation = async () => {
    if (!id) return;
    setLoadingExplanation(true);
    try {
      const res = await vocabAPI.explainWord(id);
      const exp = res.data.explanation;
      // Ensure synonym_differences is always an object
      if (typeof exp.synonym_differences !== 'object' || Array.isArray(exp.synonym_differences)) {
        exp.synonym_differences = {};
      }
      setExplanation(exp);
    } catch {
      toast.error('Failed to generate explanation');
    } finally {
      setLoadingExplanation(false);
    }
  };

  const loadSentences = async () => {
    if (!id) return;
    setLoadingSentences(true);
    try {
      const res = await vocabAPI.generateSentences(id, 5);
      setSentences(res.data.sentences);
    } catch {
      toast.error('Failed to generate sentences');
    } finally {
      setLoadingSentences(false);
    }
  };

  const handleReview = async (quality: number) => {
    if (!id) return;
    try {
      await srsAPI.submitReview({ word_id: id, quality, review_mode: 'word_detail' });
      setReviewed(true);
      toast.success('Review saved');
    } catch {
      toast.error('Failed to save review');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (!word) return (
    <div className="text-center py-16">
      <p className="text-surface-500 dark:text-surface-400">Word not found</p>
      <Link to="/vocabulary" className="text-primary-600 text-sm mt-2 inline-block hover:underline">Back to Library</Link>
    </div>
  );

  return (
    <div className="space-y-5 max-w-3xl animate-slide-up">
      {/* Back */}
      <Link to="/vocabulary" className="inline-flex items-center gap-1.5 text-sm text-surface-500 hover:text-surface-800 dark:hover:text-surface-200 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Library
      </Link>

      {/* Word header */}
      <div className="card space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className={`badge ${word.difficulty === 'advanced' ? 'badge-red' : word.difficulty === 'beginner' ? 'badge-green' : 'badge-amber'}`}>
                {word.difficulty}
              </span>
              <span className="badge-blue">{word.part_of_speech}</span>
              {word.ielts_band && <span className="badge-amber">Band {word.ielts_band}</span>}
            </div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-white">{word.word}</h1>
            {word.pronunciation && (
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                {word.pronunciation}
              </p>
            )}
          </div>

          {/* Progress badge */}
          {word.user_progress && (
            <div className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium ${
              word.user_progress.status === 'mastered' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' :
              word.user_progress.status === 'familiar' ? 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400' :
              word.user_progress.status === 'learning' ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' :
              'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300'
            }`}>
              {word.user_progress.status}
            </div>
          )}
        </div>

        {/* Meaning */}
        <div className="space-y-2">
          <div className="p-4 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
            <p className="text-xs font-medium text-surface-400 dark:text-surface-500 mb-1">English</p>
            <p className="text-surface-900 dark:text-white leading-relaxed">{word.meaning}</p>
          </div>
          {word.meaning_bengali && (
            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-xl">
              <p className="text-xs font-medium text-amber-600 dark:text-amber-500 mb-1">বাংলা</p>
              <p className="text-amber-900 dark:text-amber-300 font-medium">{word.meaning_bengali}</p>
            </div>
          )}
        </div>

        {/* Synonyms */}
        {word.synonyms?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">Synonyms</p>
            <div className="flex flex-wrap gap-1.5">
              {word.synonyms.map((syn, i) => (
                <span key={i} className="px-2.5 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs rounded-lg font-medium">
                  {syn}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Antonyms */}
        {word.antonyms?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">Antonyms</p>
            <div className="flex flex-wrap gap-1.5">
              {word.antonyms.map((ant, i) => (
                <span key={i} className="px-2.5 py-1 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs rounded-lg font-medium">
                  {ant}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        {word.examples?.length > 0 && (
          <div>
            <p className="text-xs font-medium text-surface-500 dark:text-surface-400 mb-2">Examples</p>
            <ul className="space-y-1.5">
              {word.examples.slice(0, 3).map((ex, i) => (
                <li key={i} className="text-sm text-surface-600 dark:text-surface-400 italic pl-3 border-l-2 border-surface-200 dark:border-surface-700">
                  "{ex}"
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Review rating */}
        <div className="pt-2 border-t border-surface-100 dark:border-surface-700">
          <p className="text-xs text-surface-500 dark:text-surface-400 mb-2">
            {reviewed ? 'Review recorded ✓' : 'How well did you know this?'}
          </p>
          <div className="flex gap-2">
            {[
              { quality: 1, label: 'Forgot', className: 'bg-red-500 hover:bg-red-600 text-white' },
              { quality: 3, label: 'Hard', className: 'bg-orange-500 hover:bg-orange-600 text-white' },
              { quality: 4, label: 'Good', className: 'bg-blue-500 hover:bg-blue-600 text-white' },
              { quality: 5, label: 'Easy', className: 'bg-emerald-500 hover:bg-emerald-600 text-white' },
            ].map((btn) => (
              <button
                key={btn.quality}
                onClick={() => handleReview(btn.quality)}
                className={`${btn.className} px-3 py-1.5 rounded-lg text-xs font-medium transition-colors`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <h2 className="font-semibold text-surface-900 dark:text-white text-sm">AI Explanation</h2>
          </div>
          <button onClick={loadExplanation} disabled={loadingExplanation} className="btn-secondary text-xs py-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${loadingExplanation ? 'animate-spin' : ''}`} />
            {explanation ? 'Refresh' : 'Generate'}
          </button>
        </div>

        {loadingExplanation ? (
          <div className="flex items-center justify-center py-10 gap-2 text-surface-400 text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full" />
            Generating…
          </div>
        ) : explanation ? (
          <div className="space-y-3">
            <div className="p-3.5 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">Simple meaning</p>
              <p className="text-sm text-blue-900 dark:text-blue-200">{explanation.simple_meaning}</p>
            </div>
            <div className="p-3.5 bg-primary-50 dark:bg-primary-900/10 rounded-xl">
              <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-1">Academic usage</p>
              <p className="text-sm text-primary-900 dark:text-primary-200">{explanation.academic_usage}</p>
            </div>
            {explanation.common_mistakes?.length > 0 && (
              <div className="p-3.5 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1.5 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" /> Common mistakes
                </p>
                <ul className="space-y-1">
                  {explanation.common_mistakes.map((m, i) => (
                    <li key={i} className="text-sm text-red-800 dark:text-red-300 flex items-start gap-1.5">
                      <span className="text-red-400 mt-0.5">•</span>{m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {explanation.synonym_differences && Object.keys(explanation.synonym_differences).length > 0 && (
              <div className="p-3.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-2">Synonym differences</p>
                <div className="space-y-2">
                  {Object.entries(explanation.synonym_differences).map(([syn, diff]) => (
                    <div key={syn}>
                      <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">{syn}: </span>
                      <span className="text-xs text-emerald-800 dark:text-emerald-200">{diff}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {explanation.tips?.length > 0 && (
              <div className="p-3.5 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                  <Star className="w-3 h-3" /> Tips
                </p>
                <ul className="space-y-1">
                  {explanation.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <span className="text-amber-400 mt-0.5">•</span>{tip}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-10 text-surface-400 dark:text-surface-500 text-sm">
            Click <strong>Generate</strong> for an AI-powered explanation
          </div>
        )}
      </div>

      {/* AI Sentences */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary-500" />
            <h2 className="font-semibold text-surface-900 dark:text-white text-sm">Example Sentences</h2>
          </div>
          <button onClick={loadSentences} disabled={loadingSentences} className="btn-secondary text-xs py-1.5">
            <RefreshCw className={`w-3.5 h-3.5 ${loadingSentences ? 'animate-spin' : ''}`} />
            {sentences.length > 0 ? 'Refresh' : 'Generate'}
          </button>
        </div>

        {loadingSentences ? (
          <div className="flex items-center justify-center py-10 gap-2 text-surface-400 text-sm">
            <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full" />
            Generating…
          </div>
        ) : sentences.length > 0 ? (
          <div className="space-y-2.5">
            {sentences.map((s, i) => (
              <div key={i} className="p-3.5 bg-surface-50 dark:bg-surface-700/50 rounded-xl">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={CONTEXT_STYLE[s.context] || 'badge-gray'}>{s.context}</span>
                  <span className="text-[11px] text-surface-400 dark:text-surface-500">Band {s.band_level}</span>
                </div>
                <p className="text-sm text-surface-800 dark:text-surface-200">{s.sentence}</p>
                {s.collocations?.length > 0 && (
                  <div className="mt-2 flex gap-1.5 flex-wrap">
                    {s.collocations.map((col, j) => (
                      <span key={j} className="text-[11px] bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded">
                        {col}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-surface-400 dark:text-surface-500 text-sm">
            Click <strong>Generate</strong> for AI-powered example sentences
          </div>
        )}
      </div>
    </div>
  );
}
