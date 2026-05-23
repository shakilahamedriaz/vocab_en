import { useEffect, useRef, useState } from 'react';
import { Layers } from 'lucide-react';
import { gamesAPI } from '../../services/api';
import { useArenaStore } from '../../stores/arena';
import { Header, Summary } from './SpeedMatch';
import toast from 'react-hot-toast';

const PAIRS = 8;

interface Card { id: number; pairId: string; kind: 'word' | 'meaning'; text: string; flipped: boolean; matched: boolean }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MemoryMatch() {
  const finish = useArenaStore((s) => s.finishGame);
  const [phase, setPhase] = useState<'loading' | 'play' | 'done'>('loading');
  const [cards, setCards] = useState<Card[]>([]);
  const [openIds, setOpenIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matched, setMatched] = useState(0);
  const [score, setScore] = useState(0);
  const startTime = useRef(0);
  const movesRef = useRef(0);
  const lockRef = useRef(false); // prevent double-flip during animation

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Fetch a big pool — backend short_meaning filters blanks already
        const res = await gamesAPI.getRandom({ count: 40 });
        if (cancelled) return;
        const words: any[] = res.data.words.filter((w: any) => w.short_meaning);
        if (words.length < PAIRS) {
          toast.error('Not enough words to play');
          return;
        }
        const picked = shuffle(words).slice(0, PAIRS);
        const built: Card[] = [];
        picked.forEach((w: any, i: number) => {
          built.push({ id: i * 2,     pairId: w.id, kind: 'word',    text: w.word,          flipped: false, matched: false });
          built.push({ id: i * 2 + 1, pairId: w.id, kind: 'meaning', text: w.short_meaning,  flipped: false, matched: false });
        });
        setCards(shuffle(built));
        startTime.current = Date.now();
        setPhase('play');
      } catch {
        if (!cancelled) toast.error('Failed to load words');
      }
    })();
    return () => { cancelled = true; };
  }, []);

  function flip(c: Card) {
    if (lockRef.current || c.flipped || c.matched) return;

    setCards((cs) => cs.map((x) => (x.id === c.id ? { ...x, flipped: true } : x)));

    setOpenIds((prev) => {
      const opened = [...prev, c.id];

      if (opened.length === 2) {
        lockRef.current = true;
        movesRef.current += 1;
        setMoves(movesRef.current);

        // Read card data from current state snapshot
        setCards((cs) => {
          const [a, b] = opened.map((id) => cs.find((x) => x.id === id)!);
          const isMatch = a && b && a.pairId === b.pairId && a.kind !== b.kind;

          if (isMatch) {
            setTimeout(() => {
              setCards((cs2) => cs2.map((x) => opened.includes(x.id) ? { ...x, matched: true, flipped: true } : x));
              setOpenIds([]);
              setScore((s) => s + 30);
              setMatched((m) => {
                const nm = m + 1;
                if (nm >= PAIRS) endGame();
                return nm;
              });
              lockRef.current = false;
            }, 350);
          } else {
            setTimeout(() => {
              setCards((cs2) => cs2.map((x) => opened.includes(x.id) ? { ...x, flipped: false } : x));
              setOpenIds([]);
              lockRef.current = false;
            }, 800);
          }
          return cs; // no change here — handled in timeouts above
        });

        return opened; // keep both open during animation
      }

      return opened;
    });
  }

  function endGame() {
    const seconds = Math.round((Date.now() - startTime.current) / 1000);
    const timeBonus = Math.max(0, 200 - seconds * 2);
    const efficiencyBonus = Math.max(0, (PAIRS * 2 - movesRef.current) * 5);
    const total = PAIRS * 30 + timeBonus + efficiencyBonus;
    setScore(total);
    setPhase('done');
    const { leveledUp, newBest } = finish('memory', total);
    if (leveledUp) toast.success('Level up! 🎉');
    if (newBest) toast.success('New best score!');
  }

  if (phase === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3">
        <div className="w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-surface-500 dark:text-surface-400">Shuffling cards…</p>
      </div>
    );
  }

  if (phase === 'done') {
    return (
      <Summary
        score={score}
        correct={matched}
        maxCombo={movesRef.current}
        onAgain={() => {
          setCards([]); setOpenIds([]); setMoves(0); setMatched(0);
          setScore(0); movesRef.current = 0; lockRef.current = false;
          setPhase('loading');
          // Re-mount by re-triggering the effect with a tiny delay
          setTimeout(() => window.location.reload(), 30);
        }}
      />
    );
  }

  return (
    <div className="space-y-5">
      <Header back="/arena" title="Memory Match" />

      {/* HUD */}
      <div className="flex items-center justify-between px-1 text-sm">
        <span className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
          <Layers className="w-4 h-4" />
          <span>Matched <b className="text-surface-900 dark:text-white">{matched}</b>/{PAIRS}</span>
        </span>
        <span className="text-surface-500 dark:text-surface-400">
          Moves <b className="text-surface-900 dark:text-white">{moves}</b>
        </span>
        <span className="text-surface-500 dark:text-surface-400">
          Score <b className="text-purple-600">{score}</b>
        </span>
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-4 gap-2">
        {cards.map((c) => {
          const shown = c.flipped || c.matched;
          return (
            <button
              key={c.id}
              onClick={() => flip(c)}
              disabled={c.matched}
              className={[
                'relative flex items-center justify-center rounded-xl p-2 text-center transition-all duration-300 select-none',
                'min-h-[5rem] text-sm font-medium',
                c.matched
                  ? 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 cursor-default'
                  : shown
                  ? 'bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-100 border border-primary-300 dark:border-primary-700 shadow-md'
                  : 'bg-gradient-to-br from-primary-500 to-purple-600 text-white hover:from-primary-400 hover:to-purple-500 cursor-pointer hover:-translate-y-0.5 hover:shadow-lg',
              ].join(' ')}
            >
              {shown ? (
                <span className={c.kind === 'word' ? 'font-bold text-base' : 'text-xs leading-snug'}>
                  {c.text}
                </span>
              ) : (
                <span className="text-2xl opacity-60">?</span>
              )}
            </button>
          );
        })}
      </div>

      <p className="text-center text-xs text-surface-400 dark:text-surface-500">
        Match each word to its meaning — fewer moves = higher score
      </p>
    </div>
  );
}
