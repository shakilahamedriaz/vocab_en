import { useEffect, useState } from 'react';
import { Lightbulb, RotateCcw, SkipForward, Check } from 'lucide-react';
import { gamesAPI } from '../../services/api';
import { useArenaStore } from '../../stores/arena';
import { Header, Summary } from './SpeedMatch';
import toast from 'react-hot-toast';

const ROUNDS = 8;

interface Letter { id: number; char: string; placed: boolean }

function scramble(word: string): Letter[] {
  const letters: Letter[] = word.split('').map((c, i) => ({ id: i, char: c, placed: false }));
  // ensure scrambled isn't identical
  for (let tries = 0; tries < 10; tries++) {
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    if (letters.map((l) => l.char).join('') !== word) break;
  }
  return letters;
}

export default function WordScramble() {
  const finish = useArenaStore((s) => s.finishGame);
  const [phase, setPhase] = useState<'loading' | 'play' | 'done'>('loading');
  const [pool, setPool] = useState<any[]>([]);
  const [roundIdx, setRoundIdx] = useState(0);
  const [tiles, setTiles] = useState<Letter[]>([]);
  const [placed, setPlaced] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [usedHint, setUsedHint] = useState(false);
  const [flash, setFlash] = useState<'' | 'right' | 'wrong'>('');

  useEffect(() => {
    (async () => {
      try {
        const res = await gamesAPI.getRandom({ count: ROUNDS * 2, min_length: 4, max_length: 10 });
        const words = res.data.words.filter((w: any) => /^[A-Za-z]+$/.test(w.word));
        if (words.length < ROUNDS) {
          toast.error('Not enough words');
          return;
        }
        setPool(words.slice(0, ROUNDS));
        setPhase('play');
      } catch {
        toast.error('Failed to load words');
      }
    })();
  }, []);

  useEffect(() => {
    if (phase !== 'play' || !pool[roundIdx]) return;
    const w = pool[roundIdx].word.toLowerCase();
    setTiles(scramble(w));
    setPlaced([]);
    setShowHint(false);
    setUsedHint(false);
    setFlash('');
  }, [phase, pool, roundIdx]);

  const current = pool[roundIdx];

  function placeTile(t: Letter) {
    if (t.placed) return;
    setTiles((ts) => ts.map((x) => (x.id === t.id ? { ...x, placed: true } : x)));
    setPlaced((p) => [...p, t]);
  }

  function unplaceTile(t: Letter) {
    setTiles((ts) => ts.map((x) => (x.id === t.id ? { ...x, placed: false } : x)));
    setPlaced((p) => p.filter((x) => x.id !== t.id));
  }

  function clear() {
    setTiles((ts) => ts.map((x) => ({ ...x, placed: false })));
    setPlaced([]);
  }

  function submit() {
    if (!current) return;
    const guess = placed.map((p) => p.char).join('');
    const target = current.word.toLowerCase();
    if (guess === target) {
      setFlash('right');
      setCorrect((c) => c + 1);
      const base = 20 + target.length * 5;
      setScore((s) => s + (usedHint ? Math.floor(base / 2) : base));
      setTimeout(advance, 600);
    } else {
      setFlash('wrong');
      setScore((s) => Math.max(0, s - 3));
      setTimeout(() => setFlash(''), 400);
    }
  }

  function skip() {
    setScore((s) => Math.max(0, s - 5));
    advance();
  }

  function advance() {
    if (roundIdx + 1 >= ROUNDS) {
      setPhase('done');
      const { leveledUp, newBest } = finish('scramble', score);
      if (leveledUp) toast.success('Level up! 🎉');
      if (newBest) toast.success('New best score!');
    } else {
      setRoundIdx((i) => i + 1);
    }
  }

  function useHint() {
    setShowHint(true);
    setUsedHint(true);
  }

  if (phase === 'loading') return <div className="text-center text-surface-500 py-20">Loading…</div>;

  if (phase === 'done') {
    return (
      <Summary
        score={score}
        correct={correct}
        maxCombo={ROUNDS}
        onAgain={() => { setScore(0); setCorrect(0); setRoundIdx(0); setPhase('loading'); setTimeout(() => window.location.reload(), 50); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <Header back="/arena" title="Word Scramble" />

      <div className="flex items-center justify-between text-xs text-surface-500 dark:text-surface-400">
        <span>Round {roundIdx + 1} / {ROUNDS}</span>
        <span>Score: <b className="text-surface-900 dark:text-white">{score}</b></span>
      </div>

      <div className={`card text-center py-8 ${flash === 'right' ? 'flash-correct' : flash === 'wrong' ? 'flash-wrong' : ''}`}>
        <p className="text-[11px] uppercase tracking-wider text-surface-400 mb-2 font-semibold">Meaning</p>
        <p className="text-base text-surface-700 dark:text-surface-200 mb-4 px-4">{current?.short_meaning || current?.meaning}</p>
        {showHint && (
          <div className="inline-block badge-amber text-xs">
            Starts with <b className="ml-1 text-base">{current?.word[0].toUpperCase()}</b>
          </div>
        )}
      </div>

      {/* Slots */}
      <div className="flex flex-wrap justify-center gap-2 min-h-[3.5rem]">
        {Array.from({ length: current?.word.length || 0 }).map((_, i) => {
          const t = placed[i];
          return (
            <button
              key={i}
              onClick={() => t && unplaceTile(t)}
              className={`tile-letter ${t ? 'placed' : 'opacity-40'}`}
            >
              {t?.char.toUpperCase() || ''}
            </button>
          );
        })}
      </div>

      {/* Tiles */}
      <div className="flex flex-wrap justify-center gap-2">
        {tiles.map((t) => (
          <button
            key={t.id}
            onClick={() => placeTile(t)}
            className={`tile-letter ${t.placed ? 'disabled' : ''}`}
          >
            {t.char.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 pt-2">
        <button onClick={submit} disabled={placed.length !== current?.word.length} className="btn-primary">
          <Check className="w-4 h-4" /> Submit
        </button>
        <button onClick={clear} className="btn-secondary">
          <RotateCcw className="w-4 h-4" /> Clear
        </button>
        <button onClick={useHint} disabled={usedHint} className="btn-secondary">
          <Lightbulb className="w-4 h-4" /> Hint (½ pts)
        </button>
        <button onClick={skip} className="btn-ghost">
          <SkipForward className="w-4 h-4" /> Skip
        </button>
      </div>
    </div>
  );
}
