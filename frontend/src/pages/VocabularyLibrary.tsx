import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { vocabAPI } from '../services/api';
import { Search, BookOpen, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Word } from '../types';

const DIFFICULTY_BADGE: Record<string, string> = {
  beginner: 'badge-green',
  intermediate: 'badge-amber',
  advanced: 'badge-red',
};

const POS_BADGE: Record<string, string> = {
  Noun: 'badge-blue',
  Verb: 'badge-purple',
  Adjective: 'badge-purple',
  Adverb: 'badge-gray',
};

export default function VocabularyLibrary() {
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [pos, setPos] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadWords();
  }, [page, difficulty, pos]);

  const loadWords = async () => {
    setLoading(true);
    try {
      const res = await vocabAPI.getWords({
        page,
        limit: 24,
        search: search || undefined,
        difficulty: difficulty || undefined,
        pos: pos || undefined,
      });
      setWords(res.data.words);
      setTotalPages(res.data.total_pages);
      setTotal(res.data.total);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadWords();
  };

  return (
    <div className="space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-white">Library</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{total.toLocaleString()} words</p>
        </div>
      </div>

      {/* Search + Filters */}
      <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search words or meanings…"
            className="input-field pl-9"
          />
        </div>
        <select
          value={difficulty}
          onChange={(e) => { setDifficulty(e.target.value); setPage(1); }}
          className="input-field w-auto"
        >
          <option value="">All levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        <select
          value={pos}
          onChange={(e) => { setPos(e.target.value); setPage(1); }}
          className="input-field w-auto"
        >
          <option value="">All parts of speech</option>
          <option value="Noun">Noun</option>
          <option value="Verb">Verb</option>
          <option value="Adjective">Adjective</option>
          <option value="Adverb">Adverb</option>
        </select>
        <button type="submit" className="btn-primary">
          <SlidersHorizontal className="w-4 h-4" />
          Search
        </button>
      </form>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-surface-100 dark:bg-surface-700 rounded w-24 mb-3" />
              <div className="h-3 bg-surface-100 dark:bg-surface-700 rounded w-full mb-2" />
              <div className="h-3 bg-surface-100 dark:bg-surface-700 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : words.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen className="w-10 h-10 text-surface-300 dark:text-surface-600 mx-auto mb-3" />
          <p className="text-surface-500 dark:text-surface-400 font-medium">No words found</p>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {words.map((word) => (
            <Link
              key={word.id}
              to={`/vocabulary/${word.id}`}
              className="card group hover:shadow-card-hover hover:-translate-y-px transition-all duration-150"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-surface-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate">
                    {word.word}
                  </h3>
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <span className={DIFFICULTY_BADGE[word.difficulty] || 'badge-gray'}>
                    {word.difficulty}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 mb-2">
                <span className={POS_BADGE[word.part_of_speech] || 'badge-gray'}>
                  {word.part_of_speech}
                </span>
                {word.ielts_band && (
                  <span className="badge-amber">Band {word.ielts_band}</span>
                )}
              </div>

              <p className="text-sm text-surface-600 dark:text-surface-400 line-clamp-2 leading-relaxed">
                {word.meaning}
              </p>

              {word.meaning_bengali && (
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1.5 font-medium truncate">
                  {word.meaning_bengali}
                </p>
              )}

              {word.synonyms?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {word.synonyms.slice(0, 3).map((syn, i) => (
                    <span key={i} className="text-[11px] bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 px-2 py-0.5 rounded">
                      {syn}
                    </span>
                  ))}
                  {word.synonyms.length > 3 && (
                    <span className="text-[11px] text-surface-400 dark:text-surface-500 px-1">+{word.synonyms.length - 3}</span>
                  )}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn-secondary disabled:opacity-40 p-2"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-sm text-surface-600 dark:text-surface-400 px-2">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary disabled:opacity-40 p-2"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
