import { useState } from 'react';
import { motion } from 'framer-motion';

const PHOTOS = [
  { src: '/photos/ahana_sunglasses.jpg', caption: 'Those pink sunnies 😍', sub: 'Icon. Always.',              rotate: -4   },
  { src: '/photos/couple_outdoor.jpg',   caption: 'In the garden 🌿',       sub: 'Cutest couple ever 🥹',    rotate: 2.5  },
  { src: '/photos/ahana_park.jpg',       caption: 'Simply radiant 🌸',       sub: 'Effortlessly beautiful',  rotate: -2   },
  { src: '/photos/couple_coffee.jpg',    caption: 'Coffee & chaos ☕',        sub: 'Your little world',       rotate: 3    },
];

/* ─── Polaroid Card ─────────────────────────────────────── */
function PolaroidCard({ photo, index }) {
  const [hov, setHov] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.13, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ rotate: 0, scale: 1.07, y: -10, zIndex: 20, transition: { duration: 0.25 } }}
      onHoverStart={() => setHov(true)}
      onHoverEnd={() => setHov(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        rotate: `${photo.rotate}deg`,
        transformOrigin: 'top center',
        cursor: 'pointer',
      }}
    >
      {/* Thread */}
      <div style={{
        width: '1.5px',
        height: '38px',
        background: 'linear-gradient(to bottom, rgba(255,220,120,0.9), rgba(255,220,120,0.25))',
        boxShadow: '0 0 4px rgba(255,220,120,0.5)',
        flexShrink: 0,
      }} />

      {/* Polaroid */}
      <div style={{
        background: '#f5f0e8',
        padding: '9px 9px 48px',
        borderRadius: '3px',
        boxShadow: hov
          ? '0 24px 70px rgba(0,0,0,0.75), 0 0 28px rgba(255,105,180,0.3)'
          : '0 12px 45px rgba(0,0,0,0.65), 4px 4px 14px rgba(0,0,0,0.35)',
        transition: 'box-shadow 0.3s ease',
        width: '100%',
      }}>
        <div style={{ width: '100%', aspectRatio: '3/4', overflow: 'hidden', background: '#ccc' }}>
          <img
            src={photo.src}
            alt={photo.caption}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hov ? 'scale(1.08)' : 'scale(1)',
              display: 'block',
            }}
            loading="lazy"
          />
        </div>
        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
          <p style={{ fontFamily: "'Great Vibes', cursive", color: '#2a1020', fontSize: 'clamp(1rem, 2.8vw, 1.2rem)', lineHeight: 1.15 }}>
            {photo.caption}
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", color: '#7a5070', fontSize: '0.58rem', marginTop: '3px', letterSpacing: '0.04em' }}>
            {photo.sub}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── SVG String with clips ─────────────────────────────── */
function StringSVG({ clipPercents }) {
  const H = 80;
  const xs = clipPercents.map(p => (p / 100) * 1000);

  let d = `M -10 20 L ${xs[0]} 20`;
  for (let i = 0; i < xs.length - 1; i++) {
    const mx = (xs[i] + xs[i + 1]) / 2;
    d += ` C ${mx} ${20 + 42}, ${mx} ${20 + 42}, ${xs[i + 1]} 20`;
  }
  d += ` L 1010 20`;

  return (
    <svg
      aria-hidden="true"
      viewBox={`0 0 1000 ${H}`}
      preserveAspectRatio="none"
      style={{
        position: 'absolute', top: 0, left: 0,
        width: '100%', height: `${H}px`,
        overflow: 'visible',
        filter: 'drop-shadow(0 0 5px rgba(255,220,80,0.6))',
      }}
    >
      <path d={d} stroke="rgba(255,220,100,0.25)" strokeWidth="7"   fill="none" strokeLinecap="round" />
      <path d={d} stroke="rgba(255,220,120,0.9)"  strokeWidth="1.8" fill="none" strokeLinecap="round" />
      {xs.map((x, i) => (
        <g key={i} transform={`translate(${x - 8}, 4)`}>
          <rect x="0" y="8"  width="16" height="17" rx="2.5" fill="#ffe8c0" />
          <rect x="3.5" y="3" width="9"  height="9"  rx="1.5" fill="#ffd090" />
          <line x1="8" y1="5" x2="8" y2="25" stroke="rgba(160,100,40,0.5)" strokeWidth="1" />
          <circle cx="8" cy="2.5" r="4" fill="rgba(255,245,160,1)"
            style={{ filter: 'drop-shadow(0 0 7px rgba(255,230,60,1))' }} />
        </g>
      ))}
    </svg>
  );
}

/* ─── Main Gallery ──────────────────────────────────────── */
export default function Gallery() {
  const desktopXs = [13, 37, 63, 87];
  const CARD_W_DESKTOP = '22%';
  const ROW_H = 520;
  const STRING_TOP = 4;
  const CARD_TOP  = 74;

  return (
    <section id="gallery" style={{ position: 'relative', padding: '5rem 1rem', overflow: 'hidden' }}>
      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(5,5,10,0.82) 0%, rgba(8,3,18,0.87) 50%, rgba(5,5,10,0.82) 100%)',
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '72rem', margin: '0 auto' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.75 }}
          style={{ textAlign: 'center', marginBottom: '5rem' }}
        >
          <p style={{ color: 'rgba(255,220,120,0.85)', fontSize: '0.7rem', fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
            ✦ Memory Board ✦
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(2rem, 6vw, 4rem)',
            fontWeight: 700, fontStyle: 'italic',
            background: 'linear-gradient(135deg, #fff 0%, #da70d6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1.1,
          }}>
            Our Beautiful Memories
          </h2>
          <p style={{ marginTop: '0.75rem', color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', fontFamily: "'DM Sans', sans-serif" }}>
            Every picture is a chapter of the best story — yours 💖
          </p>
        </motion.div>

        {/* ── Desktop: 4-photo string (≥ 600px) ── */}
        <div style={{ display: 'none' }} className="string-desktop">
          <div style={{ position: 'relative', width: '100%', height: `${ROW_H}px` }}>
            <div style={{ position: 'absolute', top: `${STRING_TOP}px`, left: 0, right: 0, height: `${80}px` }}>
              <StringSVG clipPercents={desktopXs} />
            </div>
            {PHOTOS.map((photo, i) => (
              <div
                key={i}
                style={{
                  position: 'absolute',
                  left: `${desktopXs[i]}%`,
                  top: `${CARD_TOP}px`,
                  transform: 'translateX(-50%)',
                  width: CARD_W_DESKTOP,
                  minWidth: '150px',
                  maxWidth: '210px',
                }}
              >
                <PolaroidCard photo={photo} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Mobile: flex-wrap grid ── */}
        <div className="string-mobile">
          {/* Row 1 */}
          <div style={{ position: 'relative', width: '100%', height: '400px', marginBottom: '1rem' }}>
            <StringSVG clipPercents={[22, 78]} />
            {[PHOTOS[0], PHOTOS[1]].map((photo, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${[22,78][i]}%`,
                top: '70px',
                transform: 'translateX(-50%)',
                width: 'clamp(130px, 38vw, 180px)',
              }}>
                <PolaroidCard photo={photo} index={i} />
              </div>
            ))}
          </div>
          {/* Row 2 */}
          <div style={{ position: 'relative', width: '100%', height: '400px' }}>
            <StringSVG clipPercents={[22, 78]} />
            {[PHOTOS[2], PHOTOS[3]].map((photo, i) => (
              <div key={i} style={{
                position: 'absolute',
                left: `${[22,78][i]}%`,
                top: '70px',
                transform: 'translateX(-50%)',
                width: 'clamp(130px, 38vw, 180px)',
              }}>
                <PolaroidCard photo={photo} index={i + 2} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,105,180,0.4), rgba(147,112,219,0.4), transparent)',
      }} />

      {/* Inline responsive CSS */}
      <style>{`
        @media (min-width: 600px) {
          .string-desktop { display: block !important; }
          .string-mobile  { display: none   !important; }
        }
        @media (max-width: 599px) {
          .string-desktop { display: none   !important; }
          .string-mobile  { display: block  !important; }
        }
      `}</style>
    </section>
  );
}
