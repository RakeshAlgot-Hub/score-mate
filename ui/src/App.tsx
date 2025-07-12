import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import FooterNav from './components/FooterNav';
import NewMatchPage from './pages/NewMatchPage';
import ScoreEntryPage from './pages/ScoreEntryPage';
import ScoreboardPage from './pages/ScoreboardPage';
import HistoryPage from './pages/HistoryPage';
import PlayerProfilePage from './pages/PlayerProfilePage';
import TeamsPage from './pages/TeamsPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 pb-16">
        <Routes>
          <Route path="/" element={<Navigate to="/history" replace />} />
          <Route path="/new-match" element={<NewMatchPage />} />
          <Route path="/score-entry/:matchId" element={<ScoreEntryPage />} />
          <Route path="/scoreboard/:matchId" element={<ScoreboardPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/player/:playerId" element={<PlayerProfilePage />} />
          <Route path="/teams" element={<TeamsPage />} />
        </Routes>
        <FooterNav />
      </div>
    </Router>
  );
}

export default App;