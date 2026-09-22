import { motion } from 'framer-motion';

const EMOJIS = ['🎉', '💖', '🎂', '🌸', '✨', '🎊'];

export default function Footer() {
  return (
    <footer style={{
      position: 'relative',
      padding: '3.5rem 1.5rem',
      textAlign: 'center',
      overflow: 'hidden',
      borderTop: '1px solid rgba(255,105,180,0.15)',
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(5,5,10,0.9) 0%, rgba(5,5,10,0.96) 100%)',
      }} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div style={{ fontSize: '3.5rem', lineHeight: 1, marginBottom: '0.75rem' }}>🎂</div>

          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(1.8rem, 5vw, 3rem)',
            fontWeight: 700, fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ff69b4 0%, #da70d6 60%, #9370db 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            lineHeight: 1.2, marginBottom: '0.5rem',
          }}>
            Happy Birthday, Ahana!
          </h3>

          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(148,163,184,0.8)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
            May your day be as beautiful as you are 🌸
          </p>

          <p style={{ fontFamily: "'Great Vibes', cursive", fontSize: '1.8rem', color: '#ff69b4', marginBottom: '0.25rem' }}>
            — your brother & bestie, Gourav 🥹❤️
          </p>

          <p style={{ fontFamily: "'DM Sans', sans-serif", color: 'rgba(100,116,139,0.7)', fontSize: '0.75rem', fontStyle: 'italic' }}>
            (feat. Parth's love letter hidden in the game 💌)
          </p>

          {/* Bouncing emojis */}
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '0.75rem', fontSize: '1.5rem' }}>
            {EMOJIS.map((e, i) => (
              <motion.span
                key={i}
                style={{ display: 'inline-block' }}
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.8, delay: i * 0.25, ease: 'easeInOut' }}
              >
                {e}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
