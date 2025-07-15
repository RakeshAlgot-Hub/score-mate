import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useMatchStore } from '../store/matchStore';
import { submitBall } from '../services/scoreService';

const ScoreEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch, setLoading, setError } = useMatchStore();

  const [showWicketModal, setShowWicketModal] = useState(false);
  const [wicketType, setWicketType] = useState<string | null>(null);
  const [newBatsman, setNewBatsman] = useState('');
  const [commentary, setCommentary] = useState('');

  const handleBallSubmit = async (ballData: any) => {
    if (!currentMatch) return;

    setLoading(true);
    try {
      const response = await submitBall(currentMatch.id, {
        ...ballData,
        batsman: null,
        bowler: null,
        commentary: commentary.trim() || null,
      });

      setCommentary('');
      console.log("✅ Ball recorded:", response.result);
    } catch (error) {
      setError('Error submitting ball event.');
      console.error("❌ Error submitting ball:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmWicket = () => {
    if (!newBatsman.trim() || !wicketType) {
      alert('Please enter new batsman and select wicket type.');
      return;
    }

    handleBallSubmit({
      ballType: 'wicket',
      runs: 0,
      isWicket: true,
      wicketType,
      newBatsman: newBatsman.trim(),
    });

    setShowWicketModal(false);
    setWicketType(null);
    setNewBatsman('');
  };

  const runButtons = [0, 1, 2, 3, 4, 6];

  return (
    <div className="p-4 max-w-2xl mx-auto space-y-4">
      <Card>
        <h2 className="text-xl font-bold mb-4">Enter Ball</h2>

        <input
          type="text"
          placeholder="Commentary (optional)"
          className="w-full mb-4 border rounded p-2"
          value={commentary}
          onChange={(e) => setCommentary(e.target.value)}
        />

        <div className="grid grid-cols-3 gap-3 mb-4">
          {runButtons.map((run) => (
            <Button
              key={run}
              onClick={() => handleBallSubmit({ ballType: 'normal', runs: run, isWicket: false })}
            >
              {run}
            </Button>
          ))}
          <Button onClick={() => handleBallSubmit({ ballType: 'wide', runs: 1, isWicket: false })}>Wide</Button>
          <Button onClick={() => handleBallSubmit({ ballType: 'noBall', runs: 1, isWicket: false })}>No Ball</Button>
          <Button onClick={() => setShowWicketModal(true)} variant="danger">
            Wicket
          </Button>
        </div>

        <Button onClick={() => navigate(-1)} variant="outline">
          Back
        </Button>
      </Card>

      {/* Wicket Modal */}
      {showWicketModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] max-w-md shadow-xl space-y-4">
            <h3 className="text-lg font-semibold">Wicket Details</h3>

            <select
              className="w-full border rounded p-2"
              value={wicketType ?? ''}
              onChange={(e) => setWicketType(e.target.value)}
            >
              <option value="">Select Wicket Type</option>
              <option value="bowled">Bowled</option>
              <option value="caught">Caught</option>
              <option value="lbw">LBW</option>
              <option value="runout">Run Out</option>
              <option value="stumped">Stumped</option>
              <option value="hitwicket">Hit Wicket</option>
            </select>

            <input
              type="text"
              placeholder="New Batsman Name"
              className="w-full border rounded p-2"
              value={newBatsman}
              onChange={(e) => setNewBatsman(e.target.value)}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowWicketModal(false)}>
                Cancel
              </Button>
              <Button onClick={confirmWicket}>Confirm</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScoreEntryPage;
