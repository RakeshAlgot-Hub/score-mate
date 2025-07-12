import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getScoreboard } from '../services/scoreService';
import { getMatchById } from '../services/matchService';
import { Scoreboard, Match } from '../types';
import PlayerCard from '../components/PlayerCard';

const ScoreboardPage: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const [match, setMatch] = useState<Match | null>(null);
  const [scoreboard, setScoreboard] = useState<Scoreboard | null>(null);

  // Mock data
  const mockBattingData = [
    { name: 'John Campbell', runs: 0, balls: 2, fours: 0, sixes: 0, strikeRate: 0.00, isOut: true, dismissalType: 'c Krunal Pandya b Washington Sundar' },
    { name: 'Evin Lewis', runs: 0, balls: 4, fours: 0, sixes: 0, strikeRate: 0.00, isOut: true, dismissalType: 'b Bhuvneshwar Kumar' },
    { name: 'Nicholas Pooran', runs: 14, balls: 12, fours: 1, sixes: 1, strikeRate: 116.67, isOut: false, notOut: true },
    { name: 'Kieron Pollard', runs: 2, balls: 5, fours: 0, sixes: 0, strikeRate: 40.00, isOut: false, notOut: true }
  ];

  const mockBowlingData = [
    { name: 'Washington Sundar', overs: 2.0, maidens: 0, runs: 18, wickets: 1, economy: 9.00 },
    { name: 'Bhuvneshwar Kumar', overs: 1.5, maidens: 0, runs: 4, wickets: 1, economy: 2.18 }
  ];

  const mockFallOfWickets = [
    { wicket: 1, runs: 1, over: 0.2, batsman: 'John Campbell' }
  ];

  useEffect(() => {
    const loadData = async () => {
      if (matchId) {
        try {
          const [matchData, scoreboardData] = await Promise.all([
            getMatchById(matchId),
            getScoreboard(matchId)
          ]);
          setMatch(matchData);
          setScoreboard(scoreboardData);
        } catch (error) {
          console.error('Error loading data:', error);
        }
      }
    };
    loadData();
  }, [matchId]);

  if (!match) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p>Loading scoreboard...</p>
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
          <h1 className="text-lg font-bold">Scoreboard</h1>
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

      <div className="p-4">
        {/* Match Summary */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="text-sm text-gray-600 mb-2">
            {match.hostTeam} won the toss and opted to Bat first.
          </div>
          
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">{match.hostTeam}</h2>
            <div className="text-right">
              <span className="text-xl font-bold">22-2 (3.5)</span>
              <button className="ml-2 text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Batting Stats */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div className="bg-gray-50 p-3">
            <h3 className="font-semibold text-gray-700">Batsman</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">R</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">B</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">4s</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">6s</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">SR</th>
              </tr>
            </thead>
            <tbody>
              {mockBattingData.map((player, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-3 text-sm">
                    <div>
                      <div className="font-medium">{player.name}</div>
                      {player.dismissalType && (
                        <div className="text-xs text-gray-500">{player.dismissalType}</div>
                      )}
                      {player.notOut && (
                        <div className="text-xs text-gray-500">not out</div>
                      )}
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
          
          {/* Extras */}
          <div className="p-3 bg-gray-50 border-t">
            <div className="flex justify-between text-sm">
              <span>Extras</span>
              <span>6 (0 b, 0 lb, 6 w/d, 0 nb, 0 p)</span>
            </div>
          </div>
          
          {/* Total */}
          <div className="p-3 bg-gray-100 border-t">
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>22-2 (3.5) 5.74</span>
            </div>
          </div>
        </div>

        {/* Bowling Stats */}
        <div className="bg-white rounded-lg shadow-md mb-4 overflow-hidden">
          <div className="bg-gray-50 p-3">
            <h3 className="font-semibold text-gray-700">Bowler</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Name</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">O</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">M</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">R</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">W</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">ER</th>
              </tr>
            </thead>
            <tbody>
              {mockBowlingData.map((player, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-3 text-sm font-medium">{player.name}</td>
                  <td className="py-2 px-3 text-sm text-center">{player.overs}</td>
                  <td className="py-2 px-3 text-sm text-center">{player.maidens}</td>
                  <td className="py-2 px-3 text-sm text-center">{player.runs}</td>
                  <td className="py-2 px-3 text-sm text-center">{player.wickets}</td>
                  <td className="py-2 px-3 text-sm text-center">{player.economy.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Fall of Wickets */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-50 p-3">
            <h3 className="font-semibold text-gray-700">Fall of wickets</h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-2 px-3 text-left text-xs font-medium text-gray-700 uppercase">Batsman</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">Score</th>
                <th className="py-2 px-3 text-center text-xs font-medium text-gray-700 uppercase">Over</th>
              </tr>
            </thead>
            <tbody>
              {mockFallOfWickets.map((wicket, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2 px-3 text-sm">{wicket.batsman}</td>
                  <td className="py-2 px-3 text-sm text-center">{wicket.runs}/{wicket.wicket}</td>
                  <td className="py-2 px-3 text-sm text-center">{wicket.over}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ScoreboardPage;