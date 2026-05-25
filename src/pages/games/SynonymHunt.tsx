import { useEffect, useState } from 'react';
import { Heart, Crosshair } from 'lucide-react';
import { gamesAPI } from '../../services/api';
import { useArenaStore } from '../../stores/arena';
import { Header, Summary } from './SpeedMatch';
import toast from 'react-hot-toast';

const ROUNDS = 6;
const START_LIVES = 3;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function SynonymHunt() {
  const finish = useArenaStore((s) => s.finishGame);
  const [phase, setPhase] = useState<'loading' | 'play' | 'done'>('loading');
  const [pool, setPool] = useState<any[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [cloud, setCloud] = useState<string[]>([]);
  const [picked, setPicked] = useState<Set<string>>(new Set());
  const [wrongPicks, setWrongPicks] = useState<Set<string>>(new Set());
  const [lives, setLives] = useState(START_LIVES);
  const [score, setScore] = useState(0);
  const [correctRounds, setCorrectRounds] = useState(0);
  const [flash, setFlash] = useState<'' | 'right' | 'wrong'>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await gamesAPI.getRandom({ count: 20, need_synonyms: true });
        const filtered = res.data.words.filter((w: any) => (w.synonyms || []).length >= 2);
        if (filtered.length < ROUNDS) {
          toast.error('Not enough words with synonyms');
          return;
        }
        setPool(filtered.slice(0, ROUNDS));
        setPhase('play');
      } catch {
        toast.error('Failed to load words');
      }
    })();
  }, []);

  useEffect(() => {
    if (phase !== 'play' || !pool[roundIdx]) return;
    buildCloud();
    setPicked(new Set());
    setWrongPicks(new Set());
    setFlash('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, pool, roundIdx]);

  const current = pool[roundIdx];

  function buildCloud() {
    const w = pool[roundIdx];
    const real = (w.synonyms as string[]).slice(0, 4);
    const decoyCandidates = pool
      .flatMap((p: any) => p.synonyms || [])
      .filter((s: string) => !real.includes(s) && s.toLowerCase() !== w.word.toLowerCase());
    const decoys = shuffle(decoyCandidates).slice(0, 6);
    setCloud(shuffle([...real, ...decoys]));
  }

  function pick(word: string) {
    if (picked.has(word) || wrongPicks.has(word)) return;
    const realSyns = (current.synonyms as string[]).slice(0, 4).map((s) => s.toLowerCase());
    const isReal = realSyns.includes(word.toLowerCase());
    if (isReal) {
      const newPicked = new Set(picked); newPicked.add(word); setPicked(newPicked);
      setScore((s) => s + 15);
      setFlash('right'); setTimeout(() => setFlash(''), 300);
      if (newPicked.size >= realSyns.length) {
        setCorrectRounds((c) => c + 1);
        setScore((s) => s + 20); // round bonus
        setTimeout(advance, 600);
      }
    } else {
      const newWrong = new Set(wrongPicks); newWrong.add(word); setWrongPicks(newWrong);
      setScore((s) => Math.max(0, s - 5));
      setLives((l) => {
        const next = l - 1;
        if (next <= 0) setTimeout(end, 500);
        return next;
      });
      setFlash('wrong'); setTimeout(() => setFlash(''), 400);
    }
  }

  function advance() {
    if (roundIdx + 1 >= ROUNDS) end();
    else setRoundIdx((i) => i + 1);
  }

  function end() {
    setPhase('done');
    // life bonus
    const finalScore = score + lives * 25;
    setScore(finalScore);
    const { leveledUp, newBest } = finish('hunt', finalScore);
    if (leveledUp) toast.success('Level up! 🎉');
    if (newBest) toast.success('New best score!');
  }

  if (phase === 'loading') return <div className="text-center text-surface-500 py-20">Loading…</div>;

  if (phase === 'done') {
    return (
      <Summary
        score={score}
        correct={correctRounds}
        maxCombo={lives}
        onAgain={() => { setScore(0); setCorrectRounds(0); setRoundIdx(0); setLives(START_LIVES); setPhase('loading'); setTimeout(() => window.location.reload(), 50); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Header back="/arena" title="Synonym Hunt" />

      <div className="flex items-center justify-between text-xs">
        <span className="text-surface-500 dark:text-surface-400">Round {roundIdx + 1} / {ROUNDS}</span>
        <div className="flex items-center gap-1">
          {Array.from({ length: START_LIVES }).map((_, i) => (
            <Heart key={i} className={`w-4 h-4 ${i < lives ? 'text-red-500 fill-red-500' : 'text-surface-300 dark:text-surface-600'}`} />
          ))}
        </div>
        <span className="text-surface-500 dark:text-surface-400">Score: <b className="text-surface-900 dark:text-white">{score}</b></span>
      </div>

      <div className={`card text-center py-8 ${flash === 'right' ? 'flash-correct' : flash === 'wrong' ? 'flash-wrong' : ''}`}>
        <Crosshair className="w-6 h-6 mx-auto text-cyan-500 mb-2" />
        <p className="text-[11px] uppercase tracking-wider text-surface-400 font-semibold">Find synonyms of</p>
        <h2 className="text-4xl font-bold text-surface-900 dark:text-white tracking-tight mt-2">{current?.word}</h2>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-2">{current?.short_meaning || current?.meaning}</p>
        <p className="text-xs text-surface-400 mt-3">
          Picked {picked.size} / {Math.min((current?.synonyms || []).length, 4)}
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-2">
        {cloud.map((w) => {
          const isPicked = picked.has(w);
          const isWrong = wrongPicks.has(w);
          return (
            <button
              key={w}
              onClick={() => pick(w)}
              disabled={isPicked || isWrong}
              className={`px-4 py-2 rounded-full font-medium text-sm transition-all
                ${isPicked ? 'bg-emerald-500 text-white scale-105'
                  : isWrong ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 line-through opacity-60'
                  : 'bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-200 border border-surface-200 dark:border-surface-700 hover:border-cyan-400 hover:-translate-y-0.5 hover:shadow-md'}`}
            >
              {w}
            </button>
          );
        })}
      </div>
    </div>
  );
}
