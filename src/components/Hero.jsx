import { useState, useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const WORDS = [
  { text: 'Happy',    italic: false },
  { text: 'Birthday,', italic: false },
  { text: 'Ahana',   italic: true  },
];

export default function Hero() {
  const [visible, setVisible] = useState(false);
  const frameRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const rotX = useTransform(sy, [-0.5, 0.5], [10, -10]);
  const rotY = useTransform(sx, [-0.5, 0.5], [-10, 10]);

  useEffect(() => { setVisible(true); }, []);

  const onMove = (e) => {
    const r = frameRef.current?.getBoundingClientRect();
    if (!r) return;
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '0 1rem',
      }}
    >
      {/* Dark overlay on the matrix */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          background:
            'radial-gradient(ellipse at 30% 50%, rgba(255,105,180,0.09) 0%, transparent 55%), ' +
            'radial-gradient(ellipse at 70% 50%, rgba(0,150,255,0.07) 0%, transparent 55%), ' +
            'linear-gradient(180deg, rgba(5,5,10,0.6) 0%, rgba(5,5,10,0.75) 100%)',
        }}
      />

      {/* Content wrapper — centred */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: '72rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '3rem',
          paddingTop: '5rem',
          paddingBottom: '5rem',
        }}
      >
        {/* ── Text block ── */}
        <div style={{ textAlign: 'center', width: '100%' }}>
          <motion.p
            initial={{ opacity: 0, y: -16 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 500,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: 'rgba(255,220,120,0.9)',
              marginBottom: '1rem',
            }}
          >
            ✦ A Birthday Celebration ✦
          </motion.p>

          {/* Big words */}
          <div style={{ marginBottom: '0.5rem' }}>
            {WORDS.map((w, i) => (
              <motion.div
                key={w.text}
                initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
                animate={visible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
                transition={{ delay: 0.15 + i * 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  display: 'block',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: 'clamp(3.5rem, 10vw, 8rem)',
                  fontWeight: 700,
                  fontStyle: w.italic ? 'italic' : 'normal',
                  lineHeight: 1,
                  background:
                    i === 2
                      ? 'linear-gradient(135deg, #ff69b4 0%, #da70d6 60%, #9370db 100%)'
                      : 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.75) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  filter: i === 2 ? 'drop-shadow(0 0 20px rgba(255,105,180,0.5))' : 'none',
                }}
              >
                {w.text}
              </motion.div>
            ))}
          </div>

          {/* Divider line */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={visible ? { opacity: 1, scaleX: 1 } : {}}
            transition={{ delay: 0.7, duration: 0.8 }}
            style={{
              height: '1px',
              width: '280px',
              margin: '1.25rem auto',
              transformOrigin: 'center',
              background: 'linear-gradient(90deg, transparent, rgba(255,105,180,0.7), rgba(147,112,219,0.5), transparent)',
            }}
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.85, duration: 0.7 }}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '1.05rem',
              color: 'rgba(226,232,240,0.8)',
              lineHeight: 1.7,
              maxWidth: '480px',
              margin: '0 auto 0.5rem',
            }}
          >
            You light up every room you walk into, didi. 
            Wishing you the most beautiful birthday ever 🌸
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: 1.1, duration: 0.7 }}
            style={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: '1.6rem',
              color: '#ff69b4',
              marginBottom: '2rem',
            }}
          >
            — with love, Gourav 🥹
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0, duration: 0.7 }}
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <a
              href="#gallery"
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#fff',
                background: 'linear-gradient(135deg, #ff69b4, #9370db)',
                boxShadow: '0 0 24px rgba(255,105,180,0.4), 0 4px 16px rgba(147,112,219,0.3)',
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              View Memories 📸
            </a>
            <a
              href="#game"
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '9999px',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#ff69b4',
                background: 'transparent',
                border: '1px solid rgba(255,105,180,0.4)',
                boxShadow: '0 0 16px rgba(255,105,180,0.15)',
                fontFamily: "'DM Sans', sans-serif",
                textDecoration: 'none',
                display: 'inline-block',
                transition: 'transform 0.2s ease',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              Play the Game 🎮
            </a>
          </motion.div>
        </div>

        {/* ── Tilt photo frame ── */}
        <motion.div
          ref={frameRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={visible ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.4, duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          style={{
            rotateX: rotX,
            rotateY: rotY,
            perspective: 900,
            transformStyle: 'preserve-3d',
            cursor: 'pointer',
            flexShrink: 0,
            textAlign: 'center',
          }}
        >
          {/* Animated gradient border ring */}
          <div
            style={{
              position: 'relative',
              padding: '3px',
              borderRadius: '1.5rem',
              background: 'linear-gradient(135deg, #ff69b4, #9370db, #0096ff, #ff69b4)',
              backgroundSize: '300% 300%',
              animation: 'shimmer-move 4s linear infinite',
              boxShadow:
                '0 0 50px rgba(255,105,180,0.4), 0 0 100px rgba(147,112,219,0.2), 0 25px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div
              style={{
                borderRadius: '1.4rem',
                overflow: 'hidden',
                width: 'clamp(220px, 30vw, 320px)',
                height: 'clamp(280px, 37vw, 400px)',
                background: '#05050a',
              }}
            >
              <img
                src="/photos/ahana_sunglasses.jpg"
                alt="Ahana with pink sunglasses"
                style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(1.06) saturate(1.1)' }}
              />
            </div>

            {/* Floating badges */}
            {[
              { e: '✨', style: { top: '-14px', right: '-10px' } },
              { e: '💖', style: { bottom: '-12px', left: '-10px' } },
              { e: '🌸', style: { top: '45%', right: '-18px' } },
            ].map((b, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  fontSize: '1.5rem',
                  animation: `smooth-pulse 2.5s ease-in-out infinite ${i * 0.6}s`,
                  filter: 'drop-shadow(0 0 6px rgba(255,105,180,0.8))',
                  ...b.style,
                }}
              >
                {b.e}
              </div>
            ))}
          </div>

          {/* Script name below frame */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={visible ? { opacity: 1 } : {}}
            transition={{ delay: 1.3 }}
            style={{ marginTop: '1rem' }}
          >
            <span
              className="shimmer-text"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem', letterSpacing: '0.05em' }}
            >
              Ahana ♡ always
            </span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={visible ? { opacity: 1 } : {}}
        transition={{ delay: 1.6 }}
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.5rem',
        }}
      >
        <span style={{ color: 'rgba(255,255,255,0.28)', fontSize: '0.6rem', letterSpacing: '0.3em' }}>
          SCROLL
        </span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
          style={{
            width: '1.25rem',
            height: '2rem',
            borderRadius: '9999px',
            border: '1px solid rgba(255,105,180,0.35)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '0.375rem',
          }}
        >
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff69b4' }} />
        </motion.div>
      </motion.div>
    </section>
  );
}
