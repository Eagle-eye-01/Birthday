import './index.css';
import MatrixBackground  from './components/ParticleBackground';
import Hero     from './components/Hero';
import Gallery  from './components/Gallery';
import Game     from './components/Game';
import Balloons from './components/Balloons';
import Footer   from './components/Footer';

export default function App() {
  return (
    <div
      className="relative min-h-screen"
      style={{ background: '#05050a', isolation: 'isolate' }}
    >
      {/* Layer 0: JP matrix (fixed background) */}
      <MatrixBackground />

      {/* Layer 1: floating balloons (fixed) */}
      <Balloons />

      {/* Layer 2: page content — each section has its own dark overlay on top of matrix */}
      <main className="relative" style={{ zIndex: 1 }}>
        <Hero />
        <Gallery />
        <Game />
        <Footer />
      </main>
    </div>
  );
}
