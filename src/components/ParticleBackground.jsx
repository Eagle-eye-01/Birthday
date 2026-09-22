import { useEffect, useRef } from 'react';

// Full katakana + hiragana + kanji set
const JP_CHARS =
  'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン' +
  'あいうえおかきくけこさしすせそたちつてとなにぬねのはひふへほまみむめもやゆよらりるれろわをん' +
  '愛美花心月星夢恋幸笑絆希望永遠輝祝誕生日';

export default function MatrixBackground() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const cellSize = window.innerWidth < 768 ? 28 : 36;
    const cols = Math.ceil(window.innerWidth  / cellSize) + 2;
    const rows = Math.ceil(window.innerHeight / cellSize) + 2;
    const total = cols * rows;

    const fragment = document.createDocumentFragment();
    for (let i = 0; i < total; i++) {
      const span = document.createElement('span');
      span.textContent = JP_CHARS[Math.floor(Math.random() * JP_CHARS.length)];
      fragment.appendChild(span);
    }
    container.innerHTML = '';
    container.appendChild(fragment);

    // Occasionally shuffle a random character so it feels alive
    const shuffleInterval = setInterval(() => {
      const spans = container.querySelectorAll('span');
      const count = Math.floor(spans.length * 0.02); // replace 2% at a time
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * spans.length);
        spans[idx].textContent = JP_CHARS[Math.floor(Math.random() * JP_CHARS.length)];
      }
    }, 800);

    return () => {
      clearInterval(shuffleInterval);
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden"
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <div ref={containerRef} className="jp-matrix" style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
