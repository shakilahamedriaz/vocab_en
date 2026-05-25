import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap, Timer, Star, Award } from 'lucide-react';
import { gamesAPI } from '../../services/api';
import { useArenaStore } from '../../stores/arena';
import toast from 'react-hot-toast';

const DURATION = 60;

interface Round {
  word: string;
  meaning: string;
  options: string[];
  correct: string;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SpeedMatch() {
  const finish = useArenaStore((s) => s.finishGame);
  const [phase, setPhase] = useState<'loading' | 'play' | 'done'>('loading');
  const [pool, setPool] = useState<any[]>([]);
  const [round, setRound] = useState<Round | null>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [flash, setFlash] = useState<'' | 'right' | 'wrong'>('');
  const [selected, setSelected] = useState<string | null>(null);
  const idxRef = useRef(0);

  // Load pool
  useEffect(() => {
    (async () => {
      try {
        const res = await gamesAPI.getRandom({ count: 50 });
        const words = res.data.words.filter((w: any) => w.meaning);
        if (words.length < 5) {
          toast.error('Not enough vocabulary to play');
          return;
        }
        setPool(shuffle(words));
        setPhase('play');
      } catch {
        toast.error('Failed to load words');
      }
    })();
  }, []);

  // Build round
  useEffect(() => {
    if (phase !== 'play' || !pool.length) return;
    nextRound();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pool]);

  // Timer
  useEffect(() => {
    if (phase !== 'play') return;
    if (timeLeft <= 0) {
      end();
      return;
    }
    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, timeLeft]);

  function nextRound() {
    if (!pool.length) return;
    const word = pool[idxRef.current % pool.length];
    const wrongs = shuffle(pool.filter((p) => p.id !== word.id))
      .slice(0, 3)
      .map((w) => w.short_meaning || w.meaning);
    const correct = word.short_meaning || word.meaning;
    const options = shuffle([correct, ...wrongs]);
    setRound({ word: word.word, meaning: correct, options, correct });
    setSelected(null);
    setFlash('');
    idxRef.current += 1;
  }

  function pick(opt: string) {
    if (!round || selected) return;
    setSelected(opt);
    const isRight = opt === round.correct;
    if (isRight) {
      setFlash('right');
      const newCombo = combo + 1;
      setCombo(newCombo);
      setMaxCombo((m) => Math.max(m, newCombo));
      setCorrectCount((c) => c + 1);
      // 10 base + combo bonus capped
      setScore((s) => s + 10 + Math.min(newCombo, 10) * 2);
    } else {
      setFlash('wrong');
      setCombo(0);
    }
    setTimeout(nextRound, isRight ? 300 : 600);
  }

  function end() {
    setPhase('done');
    const { leveledUp, newBest } = finish('speed', score);
    if (leveledUp) toast.success('Level up! 🎉');
    if (newBest) toast.success('New best score!');
  }

  if (phase === 'loading') {
    return <div className="text-center text-surface-500 py-20">Loading words…</div>;
  }

  if (phase === 'done') {
    return (
      <Summary
        score={score}
        correct={correctCount}
        maxCombo={maxCombo}
        onAgain={() => {
          setScore(0); setCombo(0); setMaxCombo(0); setCorrectCount(0);
          setTimeLeft(DURATION);
          idxRef.current = 0;
          setPool((p) => shuffle(p));
          setPhase('play');
        }}
      />
    );
  }

  const pct = (timeLeft / DURATION) * 100;
  const timerColor = timeLeft <= 10 ? 'bg-red-500' : timeLeft <= 20 ? 'bg-amber-500' : 'bg-emerald-500';

  return (
    <div className="space-y-6">
      <Header back="/arena" title="Speed Match" />

      {/* HUD */}
      <div className="grid grid-cols-3 gap-3">
        <HudPill icon={Timer} label="Time" value={`${timeLeft}s`} accent={timeLeft <= 10 ? 'text-red-500' : 'text-surface-900 dark:text-white'} />
        <HudPill icon={Star} label="Score" value={score} accent="text-purple-600" />
        <HudPill icon={Zap}  label="Combo" value={`×${combo}`} accent={combo >= 5 ? 'text-pink-500' : 'text-amber-500'} flash={combo >= 3} />
      </div>

      <div className="h-1.5 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
        <div className={`${timerColor} h-full transition-all duration-1000 ease-linear`} style={{ width: `${pct}%` }} />
      </div>

      {round && (
        <div className={`card text-center py-10 ${flash === 'right' ? 'flash-correct' : flash === 'wrong' ? 'flash-wrong' : ''}`}>
          <p className="text-xs uppercase tracking-wider text-surface-400 mb-3 font-semibold">Pick the meaning</p>
          <h2 className="text-4xl md:text-5xl font-bold text-surface-900 dark:text-white tracking-tight pop-in" key={round.word}>
            {round.word}
          </h2>
          {combo >= 3 && (
            <p key={combo} className="combo-flash mt-3 text-sm font-bold text-pink-500">
              🔥 {combo}× combo!
            </p>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {round?.options.map((opt) => {
          const isSel = selected === opt;
          const isCorrect = selected && opt === round.correct;
          const isWrongPick = isSel && opt !== round.correct;
          return (
            <button
              key={opt}
              onClick={() => pick(opt)}
              disabled={!!selected}
              className={`text-left p-4 rounded-xl border transition-all duration-150 text-sm
                ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-400 dark:border-emerald-600 text-emerald-800 dark:text-emerald-200'
                  : isWrongPick ? 'bg-red-50 dark:bg-red-900/30 border-red-400 dark:border-red-600 text-red-800 dark:text-red-200'
                  : 'bg-white dark:bg-surface-800 border-surface-200 dark:border-surface-700 hover:border-primary-400 hover:shadow-md text-surface-800 dark:text-surface-100'}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function Header({ back, title }: { back: string; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <Link to={back} className="btn-ghost !p-2">
        <ArrowLeft className="w-4 h-4" />
      </Link>
      <h1 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">{title}</h1>
    </div>
  );
}

function HudPill({ icon: Icon, label, value, accent, flash }: { icon: any; label: string; value: any; accent: string; flash?: boolean }) {
  return (
    <div className={`card !p-3 flex items-center gap-2.5 ${flash ? 'ring-2 ring-pink-400 ring-offset-2 dark:ring-offset-surface-900' : ''}`}>
      <Icon className={`w-4 h-4 ${accent}`} />
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-surface-500 dark:text-surface-400 font-medium">{label}</p>
        <p className={`text-base font-bold ${accent}`}>{value}</p>
      </div>
    </div>
  );
}

export function Summary({ score, correct, maxCombo, onAgain }: { score: number; correct: number; maxCombo: number; onAgain: () => void }) {
  return (
    <div className="card text-center py-12 max-w-md mx-auto pop-in">
      <Award className="w-12 h-12 mx-auto text-amber-500 mb-3" />
      <h2 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">Time's up!</h2>
      <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">Nice work — here's your run.</p>
      <div className="grid grid-cols-3 gap-3 mb-6">
        <SummaryStat label="Score" value={score} />
        <SummaryStat label="Correct" value={correct} />
        <SummaryStat label="Max Combo" value={`×${maxCombo}`} />
      </div>
      <div className="flex gap-2 justify-center">
        <button onClick={onAgain} className="btn-primary">Play Again</button>
        <Link to="/arena" className="btn-secondary">Back to Arena</Link>
      </div>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: any }) {
  return (
    <div className="bg-surface-50 dark:bg-surface-700/30 rounded-lg p-3">
      <p className="text-[11px] uppercase tracking-wide text-surface-500 dark:text-surface-400 font-medium">{label}</p>
      <p className="text-xl font-bold text-surface-900 dark:text-white">{value}</p>
    </div>
  );
}
