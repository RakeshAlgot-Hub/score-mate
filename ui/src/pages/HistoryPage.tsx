import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BarChart3, Trash2, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useMatchStore } from '../store/matchStore';
import { ROUTES } from '../constants/appConstants';
import { formatDate } from '../utils/formatters';

interface MatchHistory {
  id: string;
  hostTeam: string;
  visitorTeam: string;
  lastUpdated: string;
  status: string;
  currentScore?: string;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setCurrentMatch, 
    getLocalMatchHistory, 
    persistMatchIdToStorage,
    clearStorage 
  } = useMatchStore();
  
  const [matches, setMatches] = useState<MatchHistory[]>([]);

  useEffect(() => {
    loadLocalHistory();
  }, []);

  const loadLocalHistory = () => {
    const history = getLocalMatchHistory();
    setMatches(history);
  };

  const handleResumeMatch = (match: MatchHistory) => {
    persistMatchIdToStorage(match.id);
    navigate(ROUTES.SCORING);
  };

  const handleViewScoreboard = (match: MatchHistory) => {
    persistMatchIdToStorage(match.id);
    navigate(ROUTES.SCOREBOARD);
  };

  const handleDeleteMatch = (matchId: string) => {
    if (!confirm('Are you sure you want to remove this match from history?')) return;

    const updatedMatches = matches.filter(m => m.id !== matchId);
    setMatches(updatedMatches);
    
    // Update localStorage
    localStorage.setItem('matchHistory', JSON.stringify(updatedMatches));
  };

  const handleClearAllHistory = () => {
    if (!confirm('Are you sure you want to clear all match history?')) return;
    
    clearStorage();
    setMatches([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-50';
      case 'completed':
        return 'text-blue-600 bg-blue-50';
      case 'abandoned':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  if (matches.length === 0) {
    return (
      <div className="p-4 max-w-md mx-auto pb-20">
        <Card>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches in history</h3>
            <p className="text-gray-600 mb-6">Start scoring a match to see it here</p>
            <Button
              onClick={() => navigate(ROUTES.TEAMS)}
              variant="primary"
              size="lg"
            >
              Start New Match
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4 pb-20">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-900">Match History</h2>
        <div className="flex space-x-2">
          <Button
            onClick={handleClearAllHistory}
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
          >
            Clear All
          </Button>
          <Button
            onClick={() => navigate(ROUTES.TEAMS)}
            variant="primary"
            size="sm"
          >
            New Match
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <Card key={match.id} className="relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs px-2 py-1 rounded-full font-medium capitalize bg-gray-100">
                    {match.hostTeam.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">vs</span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium capitalize bg-gray-100">
                    {match.visitorTeam.slice(0, 3).toUpperCase()}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {match.hostTeam} vs {match.visitorTeam}
                </h3>

                {match.currentScore && (
                  <p className="text-sm text-gray-600 mb-2">
                    {match.currentScore}
                  </p>
                )}

                <p className="text-xs text-gray-500">
                  {formatDate(match.lastUpdated)}
                </p>
              </div>

              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                  {match.status}
                </span>
              </div>
            </div>

            <div className="flex space-x-2">
              {match.status === 'active' && (
                <Button
                  onClick={() => handleResumeMatch(match)}
                  variant="primary"
                  size="sm"
                  icon={Play}
                  className="flex-1"
                >
                  Resume
                </Button>
              )}

              <Button
                onClick={() => handleViewScoreboard(match)}
                variant="outline"
                size="sm"
                icon={BarChart3}
                className="flex-1"
              >
                Scoreboard
              </Button>

              <Button
                onClick={() => handleDeleteMatch(match.id)}
                variant="outline"
                size="sm"
                icon={Trash2}
                className="text-red-600 hover:text-red-700 hover:border-red-300"
              >
                Remove
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;