import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import TeamsPage from './pages/TeamsPage';
import NewMatchPage from './pages/NewMatchPage';
import AdvancedSettingsPage from './pages/AdvancedSettingsPage';
import SelectOpeningPlayersPage from './pages/SelectOpeningPlayersPage';
import ScoreEntryPage from './pages/ScoreEntryPage';
import ScoreboardPage from './pages/ScoreboardPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="teams" element={<TeamsPage />} />
            <Route path="new-match" element={<NewMatchPage />} />
            <Route path="advanced-settings" element={<AdvancedSettingsPage />} />
            <Route path="select-players" element={<SelectOpeningPlayersPage />} />
            <Route path="scoring" element={<ScoreEntryPage />} />
            <Route path="scoreboard" element={<ScoreboardPage />} />
            <Route path="history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;