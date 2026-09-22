import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

/* ── Card pool: 4 photos × 4 cards each = 16 cards (8 pairs) ── */
const BASE_CARDS = [
  { id: 'a', src: '/photos/ahana_sunglasses.jpg', title: 'Pink Shades 🕶️' },
  { id: 'b', src: '/photos/ahana_park.jpg',        title: 'Park Glow 🌸'   },
  { id: 'c', src: '/photos/couple_outdoor.jpg',    title: 'Sunny Day ☀️'   },
  { id: 'd', src: '/photos/couple_coffee.jpg',     title: 'Coffee Date ☕' },
];

function buildDeck() {
  const deck = [];
  // 4 cards for each photo (2 pairs of each, 8 pairs total)
  BASE_CARDS.forEach(c => {
    for (let copy = 0; copy < 4; copy++) {
      deck.push({
        uid: `${c.id}-${copy}`,
        photoId: c.id,
        src: c.src,
        title: c.title,
      });
    }
  });

  // Fisher-Yates shuffle
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

/* ── Timer hook ─────────────────────────────────────────── */
function useGameTimer(running) {
  const [secs, setSecs] = useState(0);
  const id = useRef(null);

  useEffect(() => {
    if (running) {
      id.current = setInterval(() => setSecs(s => s + 1), 1000);
    } else {
      clearInterval(id.current);
    }
    return () => clearInterval(id.current);
  }, [running]);

  const reset = () => setSecs(0);
  return { secs, reset };
}

const fmt = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

/* ── Confetti ───────────────────────────────────────────── */
function launchConfetti() {
  const colors = ['#ff69b4', '#da70d6', '#9370db', '#0096ff', '#ffd700', '#fff'];
  const end = Date.now() + 3500;
  const burst = () => {
    confetti({ particleCount: 8, angle: 60,  spread: 60, origin: { x: 0 },   colors });
    confetti({ particleCount: 8, angle: 120, spread: 60, origin: { x: 1 },   colors });
    if (Date.now() < end) requestAnimationFrame(burst);
  };
  burst();
  confetti({ particleCount: 180, spread: 160, origin: { x: 0.5, y: 0.5 }, colors, scalar: 1.3 });
}

/* ── Win Modal ──────────────────────────────────────────── */
function WinModal({ moves, secs, onReplay }) {
  return (
    <motion.div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(5,5,10,0.92)',
        backdropFilter: 'blur(16px)',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        style={{ width: '100%', maxWidth: '30rem' }}
        initial={{ scale: 0.6, y: 60 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.6, y: 60 }}
        transition={{ type: 'spring', stiffness: 240, damping: 22 }}
      >
        <div style={{
          background: 'linear-gradient(135deg, #ff69b4, #9370db, #0096ff)',
          padding: '2px',
          borderRadius: '1.5rem',
          boxShadow: '0 0 60px rgba(255,105,180,0.5), 0 0 120px rgba(147,112,219,0.3)',
        }}>
          <div style={{ borderRadius: '1.4rem', padding: '2rem', background: '#0c0818', textAlign: 'center' }}>

            {/* Floating emojis */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem', fontSize: '2rem' }}>
              {['🎉','🎂','💖','🎊','✨'].map((e, i) => (
                <motion.span
                  key={i}
                  animate={{ y: [0, -14, 0] }}
                  transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.15 }}
                  style={{ display: 'inline-block' }}
                >
                  {e}
                </motion.span>
              ))}
            </div>

            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '2.8rem', fontWeight: 700, fontStyle: 'italic',
              background: 'linear-gradient(135deg, #ff69b4, #da70d6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: '0.25rem',
            }}>
              You Won! 🎉
            </h3>

            <div style={{
              display: 'flex', justifyContent: 'center', gap: '1.5rem',
              color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem',
              fontFamily: "'DM Sans', sans-serif", margin: '0.75rem 0 1.25rem',
            }}>
              <span>🎯 {moves} moves</span>
              <span>⏱️ {fmt(secs)}</span>
            </div>

            {/* Unlocked message from Parth */}
            <div style={{
              borderRadius: '1.1rem', padding: '1.35rem', marginBottom: '1.25rem', textAlign: 'left',
              background: 'linear-gradient(135deg, rgba(255,105,180,0.08), rgba(147,112,219,0.08))',
              border: '1px solid rgba(255,105,180,0.3)',
              boxShadow: 'inset 0 0 20px rgba(255,105,180,0.05)',
            }}>
              <p style={{
                color: '#ffd700', fontSize: '0.68rem', fontFamily: "'DM Sans', sans-serif",
                textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.75rem', fontWeight: 600,
              }}>
                💌 Unlocked — A Love Note from Parth
              </p>
              <p style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: 'rgba(255,255,255,0.92)',
                fontSize: '1.1rem', lineHeight: 1.8, fontStyle: 'italic',
              }}>
                "Happy Birthday, Ahana. 🎂<br /><br />
                Watching you smile, laugh, and light up every room is my absolute favourite
                thing in the world. You are endlessly radiant, deeply kind, and impossibly
                beautiful — inside and out.<br /><br />
                I am so lucky to call you mine. Here's to a lifetime of coffee dates, garden
                walks, and making countless more memories together. 🌸"
              </p>
              <p style={{ textAlign: 'right', marginTop: '0.85rem', fontFamily: "'Great Vibes', cursive", fontSize: '1.6rem', color: '#ff69b4' }}>
                — Parth 💕
              </p>
            </div>

            {/* Note from brother Gourav */}
            <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem', marginBottom: '1.25rem', fontStyle: 'italic' }}>
              (P.S. Your bhai & bestie Gourav built this entire site for you 🥹❤️)
            </p>

            <button
              onClick={onReplay}
              style={{
                width: '100%', padding: '0.85rem', borderRadius: '9999px',
                fontWeight: 600, color: '#fff', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ff69b4, #9370db)',
                boxShadow: '0 0 25px rgba(255,105,180,0.5)',
                fontFamily: "'DM Sans', sans-serif", fontSize: '0.95rem',
                transition: 'transform 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Play Again 🔄
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Single Card Component ───────────────────────────────── */
function Card({ card, isFlipped, isMatched, onClick }) {
  const isUp = isFlipped || isMatched;

  return (
    <div
      style={{
        aspectRatio: '3/4',
        perspective: '1000px',
        WebkitPerspective: '1000px',
        userSelect: 'none',
        cursor: isUp ? 'default' : 'pointer',
      }}
      onClick={!isUp ? onClick : undefined}
    >
      <motion.div
        animate={{ rotateY: isUp ? 180 : 0 }}
        whileHover={!isUp ? { scale: 1.04 } : {}}
        transition={{ duration: 0.52, ease: [0.25, 1, 0.5, 1] }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          WebkitTransformStyle: 'preserve-3d',
        }}
      >
        {/* ── CARD BACK (Facedown - shows 🌸 Ahana design) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #140926 0%, #0b112c 100%)',
            border: '1.5px solid rgba(255, 105, 180, 0.35)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.6), inset 0 0 15px rgba(255,105,180,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '4px',
            overflow: 'hidden',
          }}
        >
          {/* Subtle neon center glow */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'radial-gradient(circle at 50% 45%, rgba(255,105,180,0.18) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: 'rgba(255, 105, 180, 0.12)',
              border: '1px solid rgba(255, 105, 180, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.35rem',
              boxShadow: '0 0 14px rgba(255,105,180,0.35)',
            }}
          >
            🌸
          </div>

          <span
            style={{
              marginTop: '6px',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.14em',
              color: 'rgba(255, 105, 180, 0.8)',
              textTransform: 'uppercase',
            }}
          >
            Ahana
          </span>
        </div>

        {/* ── CARD FRONT (Faceup - shows photo) ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            WebkitTransform: 'rotateY(180deg)',
            borderRadius: '12px',
            overflow: 'hidden',
            border: isMatched ? '2px solid #ff69b4' : '1.5px solid rgba(255, 255, 255, 0.3)',
            boxShadow: isMatched ? '0 0 24px rgba(255, 105, 180, 0.7)' : '0 4px 18px rgba(0,0,0,0.6)',
            background: '#0a0a14',
          }}
        >
          <img
            src={card.src}
            alt={card.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block',
              filter: isMatched ? 'brightness(1.1) saturate(1.15)' : 'brightness(1)',
            }}
          />

          {isMatched && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(255, 105, 180, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: 'rgba(10, 5, 20, 0.8)',
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  border: '1.5px solid #ff69b4',
                  boxShadow: '0 0 14px rgba(255,105,180,0.7)',
                }}
              >
                💖
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Game Component ─────────────────────────────────── */
export default function Game() {
  const [deck, setDeck]               = useState(buildDeck);
  const [openCards, setOpenCards]     = useState([]); // indices of currently open cards
  const [matchedUids, setMatchedUids] = useState(new Set());
  const [moves, setMoves]             = useState(0);
  const [won, setWon]                 = useState(false);
  const [started, setStarted]         = useState(false);
  const lockRef                       = useRef(false); // synchronous click lock
  const { secs, reset: resetTimer }   = useGameTimer(started && !won);

  const handleCard = useCallback((idx) => {
    // If locked, already won, already matched, or already open: ignore
    if (lockRef.current || won) return;
    const clickedCard = deck[idx];
    if (matchedUids.has(clickedCard.uid)) return;
    if (openCards.includes(idx)) return;

    if (!started) setStarted(true);

    if (openCards.length === 0) {
      setOpenCards([idx]);
    } else if (openCards.length === 1) {
      const firstIdx = openCards[0];
      const secondIdx = idx;
      setOpenCards([firstIdx, secondIdx]);
      setMoves(m => m + 1);

      const firstCard = deck[firstIdx];
      const secondCard = deck[secondIdx];

      // Check if photos match
      if (firstCard.photoId === secondCard.photoId) {
        // MATCH!
        lockRef.current = true;
        setTimeout(() => {
          setMatchedUids(prev => {
            const next = new Set(prev);
            next.add(firstCard.uid);
            next.add(secondCard.uid);
            if (next.size === deck.length) {
              setTimeout(() => {
                setWon(true);
                launchConfetti();
              }, 350);
            }
            return next;
          });
          setOpenCards([]);
          lockRef.current = false;
        }, 450);
      } else {
        // NO MATCH - flip back after delay
        lockRef.current = true;
        setTimeout(() => {
          setOpenCards([]);
          lockRef.current = false;
        }, 900);
      }
    }
  }, [openCards, matchedUids, deck, won, started]);

  const reset = () => {
    lockRef.current = false;
    setDeck(buildDeck());
    setOpenCards([]);
    setMatchedUids(new Set());
    setMoves(0);
    setWon(false);
    setStarted(false);
    resetTimer();
  };

  const STATS = [
    { icon: '🎯', label: 'Moves', value: moves },
    { icon: '⏱️', label: 'Time',  value: fmt(secs) },
    { icon: '✅', label: 'Pairs', value: `${matchedUids.size / 2} / ${deck.length / 2}` },
  ];

  return (
    <section id="game" style={{ position: 'relative', padding: '5rem 1rem', overflow: 'hidden' }}>
      {/* Background Gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(5,5,10,0.85) 0%, rgba(8,4,18,0.92) 100%)',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: '480px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          style={{ textAlign: 'center', marginBottom: '1.75rem', width: '100%' }}
        >
          <p style={{
            color: 'rgba(255,105,180,0.85)', fontSize: '0.72rem', letterSpacing: '0.35em',
            textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif", marginBottom: '0.5rem', fontWeight: 600,
          }}>
            🎮 Ahana's Match & Reveal
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 700, fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ff69b4, #9370db)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
          }}>
            Memory Match ✨
          </h2>
          <p style={{ marginTop: '0.5rem', color: 'rgba(148,163,184,0.85)', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
            Match all 8 pairs to unlock a secret birthday note from Parth 💌
          </p>
        </motion.div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '0.85rem', justifyContent: 'center', marginBottom: '1.25rem', width: '100%' }}>
          {STATS.map(s => (
            <div key={s.label} style={{
              flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
              borderRadius: '1rem', padding: '0.65rem 0.5rem',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(147,112,219,0.25)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            }}>
              <span style={{ fontSize: '1.1rem', marginBottom: '2px' }}>{s.icon}</span>
              <span style={{ fontWeight: 700, color: '#fff', fontSize: '1.05rem', fontFamily: "'DM Sans', sans-serif" }}>{s.value}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.65rem', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* New Game Button */}
        <button
          onClick={reset}
          style={{
            marginBottom: '1.5rem', padding: '0.5rem 1.6rem', borderRadius: '9999px',
            fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
            border: '1px solid rgba(255,105,180,0.5)', color: '#ff69b4',
            background: 'rgba(255,105,180,0.06)', fontFamily: "'DM Sans', sans-serif",
            boxShadow: '0 0 15px rgba(255,105,180,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'rgba(255,105,180,0.15)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(255,105,180,0.06)';
          }}
        >
          🔄 Shuffle & Restart
        </button>

        {/* 4×4 Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '0.65rem',
          width: '100%',
        }}>
          {deck.map((card, idx) => (
            <Card
              key={card.uid}
              card={card}
              isFlipped={openCards.includes(idx)}
              isMatched={matchedUids.has(card.uid)}
              onClick={() => handleCard(idx)}
            />
          ))}
        </div>

        <p style={{ marginTop: '1.25rem', color: '#64748b', fontSize: '0.75rem', fontFamily: "'DM Sans', sans-serif", textAlign: 'center' }}>
          ✨ Tap any card to flip it over. Find matching pairs!
        </p>
      </div>

      {/* Win Modal */}
      <AnimatePresence>
        {won && <WinModal moves={moves} secs={secs} onReplay={reset} />}
      </AnimatePresence>
    </section>
  );
}
