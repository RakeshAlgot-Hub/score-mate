import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, RotateCcw, UserPlus, RefreshCw } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useMatchStore } from '../store/matchStore';
import { submitBall, getScoreboard } from '../services/scoreService';
import { BallData } from '../types';
import { formatOvers, calculateStrikeRate } from '../utils/cricketCalculations';

const ScoreEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch, updateScoreboard, setLoading, setError } = useMatchStore();
  
  const [showWicketModal, setShowWicketModal] = useState(false);
  const [showBowlerModal, setShowBowlerModal] = useState(false);
  const [newBatsman, setNewBatsman] = useState('');
  const [newBowler, setNewBowler] = useState('');
  const [wicketType, setWicketType] = useState('bowled');
  const [lastBallData, setLastBallData] = useState<BallData | null>(null);

  useEffect(() => {
    if (currentMatch) {
      loadScoreboard();
    }
  }, [currentMatch]);

  const loadScoreboard = async () => {
    if (!currentMatch) return;
    
    try {
      const response = await getScoreboard(currentMatch.id);
      updateScoreboard(response.result);
    } catch (error) {
      console.error('Error loading scoreboard:', error);
    }
  };

  const handleBallSubmit = async (ballData: BallData) => {
    if (!currentMatch) {
      setError('No active match found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitBall(currentMatch.id, ballData);
      setLastBallData(ballData);
      await loadScoreboard();
      
      // Check if wicket or over completed
      if (ballData.isWicket) {
        setShowWicketModal(true);
      } else if (currentMatch.scoreboard.balls % 6 === 0) {
        setShowBowlerModal(true);
      }
    } catch (error) {
      setError('Failed to submit ball. Please try again.');
      console.error('Error submitting ball:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRunsClick = (runs: number) => {
    handleBallSubmit({
      ballType: 'normal',
      runs,
      isWicket: false,
    });
  };

  const handleExtraClick = (type: 'wide' | 'noBall' | 'bye' | 'legBye') => {
    const runs = currentMatch?.settings[type === 'wide' ? 'wideBall' : 'noBall']?.runs || 1;
    handleBallSubmit({
      ballType: type,
      runs: type === 'bye' || type === 'legBye' ? 1 : runs,
      isWicket: false,
    });
  };

  const handleWicket = () => {
    setShowWicketModal(true);
  };

  const confirmWicket = () => {
    if (!newBatsman.trim()) return;
    
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
    if (!newBowler.trim()) return;
    // Handle new bowler logic here
    setShowBowlerModal(false);
    setNewBowler('');
  };

  const handleUndo = () => {
    // Implement undo logic
    console.log('Undo last ball');
  };

  const scoreboard = currentMatch?.scoreboard;

  if (!scoreboard) {
    return (
      <div className="p-4 max-w-md mx-auto">
        <Card>
          <p className="text-center text-gray-600">Loading match data...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      {/* Match Header */}
      <Card>
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold text-gray-900">
            {scoreboard.hostTeam} vs {scoreboard.visitorTeam}
          </h2>
          <p className="text-sm text-gray-600">
            {scoreboard.battingTeam} won the toss and opted to bat first
          </p>
        </div>
      </Card>

      {/* Score Display */}
      <Card>
        <div className="text-center">
          <div className="text-4xl font-bold text-primary-600 mb-2">
            {scoreboard.score}/{scoreboard.wickets}
          </div>
          <div className="text-lg text-gray-600">
            Overs: {formatOvers(scoreboard.balls)}
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
          {scoreboard.currentBatsmen.map((batsman, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className={`font-medium ${index === 0 ? 'text-primary-600' : 'text-gray-700'}`}>
                {batsman.name} {index === 0 && '*'}
              </span>
              <span className="text-sm text-gray-600">
                {batsman.runs}({batsman.balls}) SR: {calculateStrikeRate(batsman.runs, batsman.balls).toFixed(1)}
              </span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="font-medium text-gray-700">
              {scoreboard.currentBowler.name}
            </span>
            <span className="text-sm text-gray-600">
              {formatOvers(scoreboard.currentBowler.overs * 6)}-{scoreboard.currentBowler.maidens}-{scoreboard.currentBowler.runs}-{scoreboard.currentBowler.wickets}
            </span>
          </div>
        </div>
      </Card>

      {/* This Over */}
      <Card>
        <h3 className="font-semibold text-gray-900 mb-3">This Over</h3>
        <div className="flex space-x-2">
          {/* Display current over balls */}
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-sm"
            >
              {index < (scoreboard.balls % 6) ? '1' : ''}
            </div>
          ))}
        </div>
      </Card>

      {/* Ball Input Options */}
      <Card>
        <div className="space-y-4">
          {/* Extra Options */}
          <div className="grid grid-cols-2 gap-2">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-primary-600" />
              <span className="text-sm">Wide</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-primary-600" />
              <span className="text-sm">No Ball</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-primary-600" />
              <span className="text-sm">Byes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-primary-600" />
              <span className="text-sm">Leg Byes</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="rounded text-primary-600" />
              <span className="text-sm">Wicket</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Button variant="secondary" className="w-full">
              Retire
            </Button>
            <Button variant="primary" className="w-full">
              Swap Batsman
            </Button>
          </div>
        </div>
      </Card>

      {/* Run Buttons */}
      <Card>
        <div className="space-y-4">
          <Button
            variant="secondary"
            icon={RotateCcw}
            className="w-full"
            onClick={handleUndo}
          >
            Undo
          </Button>
          
          <div className="grid grid-cols-4 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
              <Button
                key={runs}
                variant={runs === 6 ? 'primary' : runs === 4 ? 'secondary' : 'outline'}
                className="aspect-square"
                onClick={() => handleRunsClick(runs)}
              >
                {runs}
              </Button>
            ))}
            <Button
              variant="outline"
              className="aspect-square text-xs"
              onClick={() => console.log('More options')}
            >
              ...
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" className="w-full">
              Partnerships
            </Button>
            <Button variant="outline" className="w-full">
              Extras
            </Button>
            <Button
              variant="outline"
              icon={BarChart3}
              className="w-full"
              onClick={() => navigate('/scoreboard')}
            >
              Stats
            </Button>
          </div>
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
        title="New Over"
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

export default ScoreEntryPage;