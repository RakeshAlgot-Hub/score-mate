import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, BarChart3, Trash2, Calendar } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useMatchStore, handleApiError } from '../store/matchStore';
import { getAllMatches, deleteMatch } from '../services/matchService';
import { Match } from '../types';
import { ROUTES } from '../constants/appConstants';

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentMatch, setLoading, setError, isLoading } = useMatchStore();
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await getAllMatches();
      setMatches(response.result);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResumeMatch = (match: Match) => {
    setCurrentMatch({
      id: match.id,
      scoreboard: {} as any, // Will be loaded in scoring page
      settings: {} as any, // Will be loaded in scoring page
    });
    navigate(ROUTES.SCORING);
  };

  const handleViewScoreboard = (match: Match) => {
    setCurrentMatch({
      id: match.id,
      scoreboard: {} as any, // Will be loaded in scoreboard page
      settings: {} as any,
    });
    navigate(ROUTES.SCOREBOARD);
  };

  const handleDeleteMatch = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;

    try {
      await deleteMatch(matchId);
      setMatches(matches.filter(m => m.id !== matchId));
    } catch (error) {
      setError(handleApiError(error));
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="p-4 max-w-md mx-auto pb-20">
        <Card>
          <p className="text-center text-gray-600">Loading matches...</p>
        </Card>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="p-4 max-w-md mx-auto pb-20">
        <Card>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No matches yet</h3>
            <p className="text-gray-600 mb-6">Start your first match to see it here</p>
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
        <Button
          onClick={() => navigate(ROUTES.TEAMS)}
          variant="primary"
          size="sm"
        >
          New Match
        </Button>
      </div>

      <div className="space-y-3">
        {matches.map((match) => (
          <Card key={match.id} className="relative">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs px-2 py-1 rounded-full font-medium capitalize bg-gray-100">
                    {match.hostTeam.name.slice(0, 3).toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-500">vs</span>
                  <span className="text-xs px-2 py-1 rounded-full font-medium capitalize bg-gray-100">
                    {match.visitorTeam.name.slice(0, 3).toUpperCase()}
                  </span>
                </div>

                <h3 className="font-semibold text-gray-900 mb-1">
                  {match.hostTeam.name} vs {match.visitorTeam.name}
                </h3>

                <p className="text-sm text-gray-600 mb-2">
                  {match.scoreboard
                    ? `${match.scoreboard.score}/${match.scoreboard.wickets} in ${match.scoreboard.overs}.${match.scoreboard.balls} overs`
                    : 'No score yet'}
                </p>

                <p className="text-xs text-gray-500">
                  {match.tossWonBy} won toss, opted to {match.optedTo}
                </p>
              </div>

              <div className="text-right">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(match.status)}`}>
                  {match.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">
                  {formatDate(match.createdAt)}
                </p>
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
                Delete
              </Button>


            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HistoryPage;