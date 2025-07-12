import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import AdvancedSettingsPage from './pages/AdvancedSettingsPage';
import SelectOpeningPlayersPage from './pages/SelectOpeningPlayersPage';
import ScoringPage from './pages/ScoringPage';
import ScoreboardPage from './pages/ScoreboardPage';
import HistoryPage from './pages/HistoryPage';
import { ROUTES } from './constants/appConstants';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path={ROUTES.TEAMS.slice(1)} element={<TeamsPage />} />
            <Route path={ROUTES.ADVANCED_SETTINGS.slice(1)} element={<AdvancedSettingsPage />} />
            <Route path={ROUTES.SELECT_PLAYERS.slice(1)} element={<SelectOpeningPlayersPage />} />
            <Route path={ROUTES.SCORING.slice(1)} element={<ScoringPage />} />
            <Route path={ROUTES.SCOREBOARD.slice(1)} element={<ScoreboardPage />} />
            <Route path={ROUTES.HISTORY.slice(1)} element={<HistoryPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;