import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import CreatePokeHero from './pages/CreatePokeHero';
import ReadPokeHero from './pages/ReadPokeHero';
import EditPokeHero from './pages/EditPokeHero';

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>🎮 Crewmates Pokemon 🎮</h1>
          <nav className="main-nav">
            <Link to="/" className="nav-link">Discover Pokemon</Link>
            <Link to="/gallery" className="nav-link">My Crew Gallery</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={<CreatePokeHero />} />
          <Route path="/gallery" element={<ReadPokeHero />} />
          <Route path="/crew/:id" element={<EditPokeHero />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
