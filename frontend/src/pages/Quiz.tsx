import { useEffect, useState } from 'react';
import { learningAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Brain, CheckCircle, XCircle, RotateCcw } from 'lucide-react';

interface Question {
  id: string;
  word_id: string;
  type: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

interface QuizResult {
  word_id: string;
  is_correct: boolean;
}

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quizType, setQuizType] = useState('meaning');
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => { loadQuiz(); }, [quizType]);

  const loadQuiz = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await learningAPI.generateQuiz({ count: 10, quiz_type: quizType });
      setQuestions(res.data.questions);
      setCurrentIndex(0);
      setScore(0);
      setCompleted(false);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } catch {
      toast.error('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const currentQuestion = questions[currentIndex];

  const handleAnswer = (answer: string) => {
    if (isAnswered) return;
    const isCorrect = answer === currentQuestion.correct_answer;
    setSelectedAnswer(answer);
    setIsAnswered(true);
    if (isCorrect) setScore((s) => s + 1);
    setResults((prev) => [...prev, { word_id: currentQuestion.word_id, is_correct: isCorrect }]);
  };

  const nextQuestion = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setCompleted(true);
      try {
        await learningAPI.submitQuizResults({ results });
      } catch {
        // non-critical
      }
    }
  };

  const getOptionStyle = (option: string) => {
    const base = 'w-full text-left px-4 py-3.5 rounded-xl border-2 text-sm transition-all duration-150 flex items-center gap-3';
    if (!isAnswered) return `${base} border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 cursor-pointer`;
    if (option === currentQuestion.correct_answer) return `${base} border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-600`;
    if (option === selectedAnswer) return `${base} border-red-400 bg-red-50 dark:bg-red-900/20 dark:border-red-600`;
    return `${base} border-surface-100 dark:border-surface-800 bg-surface-50 dark:bg-surface-800/50 opacity-50`;
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full" />
    </div>
  );

  if (completed) {
    const pct = Math.round((score / questions.length) * 100);
    return (
      <div className="max-w-md mx-auto text-center py-12 animate-slide-up">
        <div className="card space-y-5">
          <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${pct >= 80 ? 'bg-emerald-50 dark:bg-emerald-900/20' : pct >= 60 ? 'bg-amber-50 dark:bg-amber-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <Brain className={`w-9 h-9 ${pct >= 80 ? 'text-emerald-500' : pct >= 60 ? 'text-amber-500' : 'text-red-500'}`} />
          </div>
          <div>
            <p className="text-4xl font-bold text-surface-900 dark:text-white">{pct}%</p>
            <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
              {score} of {questions.length} correct
            </p>
          </div>
          <p className="text-sm text-surface-600 dark:text-surface-400">
            {pct >= 80 ? '🎉 Excellent work!' : pct >= 60 ? '👍 Good job!' : '📚 Keep practicing!'}
          </p>
          <button onClick={loadQuiz} className="btn-primary w-full py-2.5">
            <RotateCcw className="w-4 h-4" /> Try again
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) return null;
  const wrongCount = results.filter((r) => !r.is_correct).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-white">Quiz</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            Question {currentIndex + 1} of {questions.length}
          </p>
        </div>
        <select
          value={quizType}
          onChange={(e) => setQuizType(e.target.value)}
          className="input-field w-auto text-xs py-1.5"
        >
          <option value="meaning">Meaning</option>
          <option value="synonym">Synonym</option>
        </select>
      </div>

      {/* Progress + score */}
      <div className="space-y-1.5">
        <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-primary-500 h-1.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
        <div className="flex gap-4 text-xs">
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">✓ {score} correct</span>
          <span className="text-red-500 dark:text-red-400 font-medium">✗ {wrongCount} wrong</span>
        </div>
      </div>

      {/* Question card */}
      <div className="card space-y-4">
        <h2 className="text-base font-semibold text-surface-900 dark:text-white">
          {currentQuestion.question}
        </h2>

        <div className="space-y-2.5">
          {currentQuestion.options.map((option, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(option)}
              disabled={isAnswered}
              className={getOptionStyle(option)}
            >
              <span className="w-7 h-7 flex-shrink-0 flex items-center justify-center rounded-lg bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400 text-xs font-semibold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1 text-surface-800 dark:text-surface-200">{option}</span>
              {isAnswered && option === currentQuestion.correct_answer && (
                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              )}
              {isAnswered && option === selectedAnswer && option !== currentQuestion.correct_answer && (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </button>
          ))}
        </div>

        {isAnswered && (
          <div className="p-3.5 bg-blue-50 dark:bg-blue-900/10 rounded-xl animate-fade-in">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">Explanation</p>
            <p className="text-sm text-blue-800 dark:text-blue-300">{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {isAnswered && (
        <div className="flex justify-end animate-fade-in">
          <button onClick={nextQuestion} className="btn-primary px-6 py-2.5">
            {currentIndex < questions.length - 1 ? 'Next question →' : 'See results'}
          </button>
        </div>
      )}
    </div>
  );
}
