import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ParticleBackground from './components/ParticleBackground';
import Home from './pages/Home';
import About from './pages/About';
import HallOfFame from './pages/HallOfFame';
import Gallery from './pages/Gallery';
import Recruitment from './pages/Recruitment';
import LiveUpdates from './pages/LiveUpdates';
import Admin from './pages/Admin';
import Fest from './pages/Fest';
import JUYF from './pages/JUYF';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Feedback from './pages/Feedback';
import Results from './pages/Results';

function App() {
  return (
    <Router>
      <div className="app-shell" style={{ position: 'relative' }}>
        <ParticleBackground />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/halloffame" element={<HallOfFame />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/recruitment" element={<Recruitment />} />
              <Route path="/live" element={<LiveUpdates />} />
              <Route path="/fest" element={<Fest />} />
              <Route path="/juyf" element={<JUYF />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/results" element={<Results />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </div>
    </Router>
  );
}

export default App;
