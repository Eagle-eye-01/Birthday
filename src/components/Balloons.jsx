import { useState, useEffect, useCallback, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const COLORS = [
  { fill: '#ff69b4', string: '#ff4da6' },
  { fill: '#9370db', string: '#7b5bc4' },
  { fill: '#0096ff', string: '#007acc' },
  { fill: '#ffd700', string: '#ccac00' },
  { fill: '#ff6b35', string: '#d94e18' },
  { fill: '#40e0d0', string: '#29b3a4' },
];

let UID = 0;

function mkBalloon() {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)];
  return {
    id: ++UID,
    x: 3 + Math.random() * 94,      // % from left
    size: 44 + Math.random() * 32,  // px
    rise: 13 + Math.random() * 9,   // seconds to rise
    sway: 2 + Math.random() * 2,    // sway period
    swayAmp: 8 + Math.random() * 14,
    color,
  };
}

/* Balloon SVG */
function BalloonSVG({ size, color }) {
  return (
    <svg
      width={size}
      height={Math.round(size * 1.45)}
      viewBox="0 0 80 116"
      fill="none"
      style={{ overflow: 'visible', filter: `drop-shadow(0 0 6px ${color.fill}88)` }}
    >
      {/* Body */}
      <ellipse cx="40" cy="44" rx="36" ry="42" fill={color.fill} />
      {/* Highlight */}
      <ellipse cx="28" cy="26" rx="11" ry="14" fill="rgba(255,255,255,0.28)" />
      {/* Knot */}
      <path d="M40 86 L37 93 L43 93 Z" fill={color.fill} />
      {/* String */}
      <path
        d="M40 93 Q46 104 38 116"
        stroke={color.string}
        strokeWidth="1.2"
        fill="none"
        opacity="0.7"
      />
    </svg>
  );
}

function Balloon({ b, onPop }) {
  const [popping, setPopping] = useState(false);

  const pop = () => {
    if (popping) return;
    setPopping(true);
    // Remove after pop animation
    setTimeout(() => onPop(b.id), 280);
  };

  return (
    <motion.div
      className="fixed gpu cursor-pointer select-none"
      style={{ bottom: 0, left: `${b.x}vw`, zIndex: 31 }}
      initial={{ y: 0, opacity: 0 }}
      animate={
        popping
          ? { scale: [1, 1.5, 0], opacity: [1, 0.6, 0] }
          : {
              y: `-${100 + b.size / window.innerHeight * 100 + 15}vh`,
              opacity: [0, 1, 1, 1, 0],
              x: [
                0,
                b.swayAmp, -b.swayAmp,
                b.swayAmp * 0.7, -b.swayAmp * 0.7,
                0,
              ],
            }
      }
      transition={
        popping
          ? { duration: 0.28, ease: 'easeOut' }
          : {
              duration: b.rise,
              ease: 'linear',
              y: { duration: b.rise, ease: 'linear' },
              opacity: { duration: b.rise, times: [0, 0.06, 0.3, 0.85, 1] },
              x: {
                repeat: Infinity,
                duration: b.sway,
                ease: 'easeInOut',
                repeatType: 'mirror',
              },
            }
      }
      onClick={pop}
      whileHover={{ scale: 1.12 }}
    >
      <BalloonSVG size={b.size} color={b.color} />
    </motion.div>
  );
}

export default function Balloons() {
  const [balloons, setBalloons] = useState([]);
  const popQ = useRef(new Set()); // ids already being removed

  useEffect(() => {
    // Spawn initial batch staggered
    const initial = Array.from({ length: 5 }, (_, i) => {
      const b = mkBalloon();
      return b;
    });
    setBalloons(initial);

    const interval = setInterval(() => {
      setBalloons((prev) => {
        if (prev.length >= 14) return prev;
        return [...prev, mkBalloon()];
      });
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const onPop = useCallback((id) => {
    if (popQ.current.has(id)) return;
    popQ.current.add(id);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
    popQ.current.delete(id);
  }, []);

  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 30, overflow: 'hidden' }}
    >
      <AnimatePresence mode="popLayout">
        {balloons.map((b) => (
          <div key={b.id} style={{ pointerEvents: 'auto' }}>
            <Balloon b={b} onPop={onPop} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}
