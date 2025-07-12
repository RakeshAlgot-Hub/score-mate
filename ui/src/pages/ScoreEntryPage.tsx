import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMatchById } from '../services/matchService';
import { updateScore } from '../services/scoreService';
import { Match, CurrentOver, BallUpdate } from '../types';
import ScorePad from '../components/ScorePad';
import OverDisplay from '../components/OverDisplay';

const ScoreEntryPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [currentScore, setCurrentScore] = useState({
    runs: 22,
    wickets: 2,
    overs: 3,
    balls: 5
  });
  const [currentOver, setCurrentOver] = useState<CurrentOver>({
    balls: [0, 2, 0, 0, 0],
    overNumber: 4
  });

  // Mock batting data
  const [battingStats] = useState([
    {
      name: 'Kieron Pollard',
      runs: 2,
      balls: 5,
      fours: 0,
      sixes: 0,
      strikeRate: 40.00,
      isStriker: true
    },
    {
      name: 'Nicholas Pooran',
      runs: 14,
      balls: 12,
      fours: 1,
      sixes: 1,
      strikeRate: 116.67,
      isStriker: false
    },
    {
      name: 'Bhuvneshwar Kumar',
      runs: 1.5,
      balls: 0,
      fours: 4,
      sixes: 1,
      strikeRate: 2.18,
      isStriker: false
    }
  ]);

  useEffect(() => {
    const loadMatch = async () => {
      if (matchId) {
        try {
          const matchData = await getMatchById(matchId);
          setMatch(matchData);
        } catch (error) {
          console.error('Error loading match:', error);
        }
      }
    };
    loadMatch();
  }, [matchId]);

  const handleScore = async (run: number) => {
    if (!matchId) return;

    const ballUpdate: BallUpdate = { run };
    
    try {
      await updateScore(matchId, ballUpdate);
      
      // Update local state
      setCurrentScore(prev => ({
        ...prev,
        runs: prev.runs + run,
        balls: prev.balls + 1 > 5 ? 0 : prev.balls + 1,
        overs: prev.balls + 1 > 5 ? prev.overs + 1 : prev.overs
      }));

      // Update current over
      setCurrentOver(prev => ({
        ...prev,
        balls: [...prev.balls, run].slice(-6)
      }));
    } catch (error) {
      console.error('Error updating score:', error);
    }
  };

  const handleWicket = async () => {
    if (!matchId) return;

    const ballUpdate: BallUpdate = { run: 0, isWicket: true };
    
    try {
      await updateScore(matchId, ballUpdate);
      
      setCurrentScore(prev => ({
        ...prev,
        wickets: prev.wickets + 1,
        balls: prev.balls + 1 > 5 ? 0 : prev.balls + 1,
        overs: prev.balls + 1 > 5 ? prev.overs + 1 : prev.overs
      }));

      setCurrentOver(prev => ({
        ...prev,
        balls: [...prev.balls, 'W'].slice(-6)
      }));
    } catch (error) {
      console.error('Error updating wicket:', error);
    }
  };

  const handleExtra = async (type: 'wide' | 'noBall' | 'bye' | 'legBye') => {
    if (!matchId) return;

    const ballUpdate: BallUpdate = { run: 1, extraType: type };
    
    try {
      await updateScore(matchId, ballUpdate);
      
      setCurrentScore(prev => ({
        ...prev,
        runs: prev.runs + 1
      }));
    } catch (error) {
      console.error('Error updating extra:', error);
    }
  };

  const handleUndo = () => {
    // Implement undo logic
    console.log('Undo last ball');
  };

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading match...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/history')}
            className="p-2 hover:bg-blue-700 rounded"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold">{match.hostTeam} v/s {match.visitorTeam}</h1>
          <div className="flex space-x-2">
            <button className="p-2 hover:bg-blue-700 rounded">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </button>
            <button className="p-2 hover:bg-blue-700 rounded">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Match Info */}
      <div className="bg-white p-4 border-b">
        <div className="text-sm text-gray-600 mb-2">
          {match.hostTeam}, 1st Inning
        </div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">{currentScore.runs} - {currentScore.wickets}</span>
            <span className="text-lg ml-2">({currentScore.overs}.{currentScore.balls})</span>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">CRR</div>
            <div className="text-lg font-semibold">5.74</div>
          </div>
        </div>
      </div>

      {/* Batting Stats */}
      <div className="bg-white mx-4 mt-4 rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Batsman</th>
              <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">R</th>
              <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">B</th>
              <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">4s</th>
              <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">6s</th>
              <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">SR</th>
            </tr>
          </thead>
          <tbody>
            {battingStats.map((player, index) => (
              <tr key={index} className={`border-b border-gray-200 ${player.isStriker ? 'bg-blue-50' : ''}`}>
                <td className="py-2 px-3 text-sm">
                  <div className="flex items-center">
                    {player.isStriker && <span className="mr-1">*</span>}
                    {player.name}
                  </div>
                </td>
                <td className="py-2 px-3 text-sm text-center">{player.runs}</td>
                <td className="py-2 px-3 text-sm text-center">{player.balls}</td>
                <td className="py-2 px-3 text-sm text-center">{player.fours}</td>
                <td className="py-2 px-3 text-sm text-center">{player.sixes}</td>
                <td className="py-2 px-3 text-sm text-center">{player.strikeRate.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Current Over */}
      <div className="mx-4 mt-4">
        <OverDisplay currentOver={currentOver} />
      </div>

      {/* Score Pad */}
      <div className="mx-4 mt-4 mb-4">
        <ScorePad
          onScore={handleScore}
          onWicket={handleWicket}
          onExtra={handleExtra}
          onUndo={handleUndo}
        />
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-40">
        <div className="grid grid-cols-4 gap-2 p-4">
          <button className="py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
            Score
          </button>
          <button className="py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Undo
          </button>
          <button className="py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium">
            Retire
          </button>
          <button 
            onClick={() => navigate(`/scoreboard/${matchId}`)}
            className="py-3 px-4 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
          >
            Board
          </button>
        </div>
      </div>

    </div>
  );
};

export default ScoreEntryPage;