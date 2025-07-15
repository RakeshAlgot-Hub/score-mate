import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, RotateCcw, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import ScorePad from '../components/ScorePad';
import OverDisplay from '../components/OverDisplay';
import { useMatchStore, handleApiError } from '../store/matchStore';
import { submitBall, getScoreboard, undoLastBall } from '../services/scoreService';
import { getMatchById } from '../services/matchService';
import { BallData } from '../types';
import { ROUTES } from '../constants/appConstants';
import { formatOvers, calculateStrikeRate } from '../utils/formatters';

const ScoringPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentMatch,
    updateScoreboard,
    setCurrentMatch,
    setLoading,
    setError,
    isLoading,
    getCurrentScore,
    loadMatchFromStorage,
    persistMatchIdToStorage,
    addMatchToLocalHistory,
  } = useMatchStore();

  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [newBatsman, setNewBatsman] = useState('');
  const [newBowler, setNewBowler] = useState('');
  const [wicketType, setWicketType] = useState('bowled');
  const [commentary, setCommentary] = useState('');
  const [currentOverBalls, setCurrentOverBalls] = useState<any[]>([]);

  useEffect(() => {
    initializeMatch();
  }, []);

  const initializeMatch = async () => {
    if (currentMatch?.id) {
      await loadScoreboard();
      return;
    }

    // Try to load from storage
    const storedMatchId = loadMatchFromStorage();
    if (storedMatchId) {
      await loadMatchById(storedMatchId);
    } else {
      navigate(ROUTES.TEAMS);
    }
  };

  const loadMatchById = async (matchId: string) => {
    setLoading(true);
    try {
      const [matchResponse, scoreboardResponse] = await Promise.all([
        getMatchById(matchId),
        getScoreboard(matchId)
      ]);

      const match = matchResponse.result;
      const scoreboard = scoreboardResponse.result;

      setCurrentMatch({
        id: match.id,
        scoreboard,
        settings: match.settings,
      });

      // Add to local history
      addMatchToLocalHistory(match);
      persistMatchIdToStorage(matchId);

    } catch (error) {
      setError(handleApiError(error));
      navigate(ROUTES.TEAMS);
    } finally {
      setLoading(false);
    }
  };

  const loadScoreboard = async () => {
    if (!currentMatch?.id) return;
    
    setLoading(true);
    try {
      const response = await getScoreboard(currentMatch.id);
      updateScoreboard(response.result);
      updateCurrentOverBalls(response.result);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentOverBalls = (scoreboard: any) => {
    // Extract balls from current over for display
    const currentOverNumber = Math.floor(scoreboard.balls / 6);
    const ballsInCurrentOver = scoreboard.balls % 6;
    
    // This would ideally come from the backend
    // For now, we'll simulate based on recent ball history
    const recentBalls = scoreboard.ballHistory?.slice(-ballsInCurrentOver) || [];
    setCurrentOverBalls(recentBalls);
  };

  const handleBallSubmit = async (ballData: BallData) => {
    if (!currentMatch) {
      setError('No active match found');
      return;
    }

    setLoading(true);
    setError(null);

    const batsman = currentMatch?.scoreboard?.currentBatsmen?.[0]?.name ?? '';
    const bowler = currentMatch?.scoreboard?.currentBowler?.name ?? '';

    try {
      await submitBall(currentMatch.id, {
        ...ballData,
        batsman,
        bowler,
        commentary: commentary.trim() || undefined,
      });

      // Reload scoreboard after submission
      const updatedScoreboardResponse = await getScoreboard(currentMatch.id);
      updateScoreboard(updatedScoreboardResponse.result);
      updateCurrentOverBalls(updatedScoreboardResponse.result);

      setCommentary('');

      // Check if over is complete (6 legal balls)
      const newScoreboard = updatedScoreboardResponse.result;
      const ballsInOver = newScoreboard.balls % 6;
      if (ballsInOver === 0 && newScoreboard.balls > 0 && !ballData.isWicket) {
        setShowBowlerModal(true);
      }

    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleRunClick = (runs: number) => {
    handleBallSubmit({ ballType: 'normal', runs, isWicket: false });
  };

  const handleExtraClick = (type: 'wide' | 'noBall' | 'bye' | 'legBye') => {
    const runs = currentMatch?.settings?.[type === 'wide' ? 'wideBall' : 'noBall']?.runs || 1;
    handleBallSubmit({
      ballType: type,
      runs: type === 'bye' || type === 'legBye' ? 1 : runs,
      isWicket: false,
    });
  };

  const handleWicketClick = () => setShowWicketModal(true);

  const confirmWicket = () => {
    if (!newBatsman.trim()) {
      setError('Please enter new batsman name');
      return;
    }
    
    handleBallSubmit({
      ballType: 'wicket',
      runs: 0,
      isWicket: true,
      wicketType: wicketType as any,
      newBatsman: newBatsman.trim(),
    });
    
    setShowWicketModal(false);
    setNewBatsman('');
  };

  const confirmNewBowler = () => {
    if (!newBowler.trim()) {
      setError('Please enter new bowler name');
      return;
    }
    
    // In a real implementation, you'd send this to the backend
    // For now, just close the modal
    setShowBowlerModal(false);
    setNewBowler('');
  };

  const handleUndo = async () => {
    if (!currentMatch) return;
    
    setLoading(true);
    try {
      const response = await undoLastBall(currentMatch.id);
      updateScoreboard(response.result.scoreboard);
      updateCurrentOverBalls(response.result.scoreboard);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  if (!currentMatch?.scoreboard || isLoading) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <Card>
          <p className="text-center text-gray-600">
            {isLoading ? 'Loading match data...' : 'No match data available'}
          </p>
        </Card>
      </div>
    );
  }

  const scoreboard = currentMatch.scoreboard;

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Match Header */}
      <Card>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {scoreboard.hostTeam} vs {scoreboard.visitorTeam}
          </h2>
          <p className="text-sm text-gray-600">{scoreboard.battingTeam} batting</p>
        </div>
      </Card>

      {/* Current Score */}
      <Card>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {getCurrentScore()}
          </div>
          {scoreboard.target && (
            <div className="text-sm text-gray-500 mt-2">
              Target: {scoreboard.target} | Need {scoreboard.target - scoreboard.score} runs
            </div>
          )}
        </div>
      </Card>

      {/* Current Players */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">Current Batsmen</h3>
        <div className="space-y-2">
          {scoreboard.currentBatsmen?.map((batsman, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className={`font-medium ${index === 0 ? 'text-primary-600' : 'text-gray-700'}`}>
                {batsman.name} {index === 0 && '*'}
              </span>
              <span className="text-sm text-gray-600">
                {batsman.runs}({batsman.balls}) SR:{' '}
                {calculateStrikeRate(batsman.runs, batsman.balls).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          {scoreboard.currentBowler ? (
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-700">{scoreboard.currentBowler.name}</span>
              <span className="text-sm text-gray-600">
                {formatOvers(scoreboard.currentBowler.overs * 6)}-{scoreboard.currentBowler.maidens}-
                {scoreboard.currentBowler.runs}-{scoreboard.currentBowler.wickets}
              </span>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">No bowler selected</div>
          )}
        </div>
      </Card>

      {/* Current Over */}
      <OverDisplay 
        balls={currentOverBalls} 
        currentOver={Math.floor(scoreboard.balls / 6)} 
      />

      {/* Commentary Input */}
      <Card>
        <Input
          label="Commentary (optional)"
          value={commentary}
          onChange={(e) => setCommentary(e.target.value)}
          placeholder="Add commentary for this ball..."
        />
      </Card>

      {/* Score Pad */}
      <Card>
        <ScorePad
          onRunClick={handleRunClick}
          onExtraClick={handleExtraClick}
          onWicketClick={handleWicketClick}
          disabled={isLoading}
        />
      </Card>

      {/* Action Buttons */}
      <Card>
        <div className="grid grid-cols-3 gap-2">
          <Button 
            variant="secondary" 
            icon={RotateCcw} 
            onClick={handleUndo} 
            disabled={isLoading}
          >
            Undo
          </Button>
          <Button 
            variant="outline" 
            icon={RefreshCw} 
            onClick={loadScoreboard} 
            disabled={isLoading}
          >
            Refresh
          </Button>
          <Button 
            variant="outline" 
            icon={BarChart3} 
            onClick={() => navigate(ROUTES.SCOREBOARD)}
          >
            Stats
          </Button>
        </div>
      </Card>

      {/* Wicket Modal */}
      <Modal 
        isOpen={showWicketModal} 
        onClose={() => setShowWicketModal(false)} 
        title="Wicket Fallen"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Wicket Type
            </label>
            <select
              value={wicketType}
              onChange={(e) => setWicketType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="bowled">Bowled</option>
              <option value="caught">Caught</option>
              <option value="lbw">LBW</option>
              <option value="runout">Run Out</option>
              <option value="stumped">Stumped</option>
              <option value="hitwicket">Hit Wicket</option>
            </select>
          </div>
          
          <Input
            label="New Batsman"
            value={newBatsman}
            onChange={(e) => setNewBatsman(e.target.value)}
            placeholder="Enter new batsman name"
            required
          />
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setShowWicketModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={confirmWicket}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      {/* New Bowler Modal */}
      <Modal 
        isOpen={showBowlerModal} 
        onClose={() => setShowBowlerModal(false)} 
        title="Over Complete"
      >
        <div className="space-y-4">
          <p className="text-gray-600">Over completed. Please select new bowler.</p>
          
          <Input
            label="New Bowler"
            value={newBowler}
            onChange={(e) => setNewBowler(e.target.value)}
            placeholder="Enter new bowler name"
            required
          />
          
          <div className="flex space-x-3">
            <Button 
              variant="outline" 
              className="flex-1" 
              onClick={() => setShowBowlerModal(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              className="flex-1" 
              onClick={confirmNewBowler}
            >
              Continue
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ScoringPage;