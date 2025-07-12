import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPlayerStats } from '../services/playerService';
import { FieldingStats } from '../types';

const PlayerProfilePage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const navigate = useNavigate();
  const [playerStats, setPlayerStats] = useState<FieldingStats | null>(null);
  const [activeTab, setActiveTab] = useState<'batting' | 'bowling' | 'fielding'>('batting');

  // Mock player data
  const playerName = 'Shikhar Dhawan';

  useEffect(() => {
    const loadPlayerStats = async () => {
      if (playerId) {
        try {
          const stats = await getPlayerStats(playerId);
          setPlayerStats(stats);
        } catch (error) {
          console.error('Error loading player stats:', error);
          // Set mock data
          setPlayerStats({
            matches: 3,
            innings: 3,
            runs: 36,
            notOuts: 1,
            bestScore: 26,
            strikeRate: 112.50,
            average: 18.00,
            fours: 2,
            sixes: 1,
            thirties: 0,
            fifties: 0,
            hundreds: 0
          });
        }
      }
    };
    loadPlayerStats();
  }, [playerId]);

  if (!playerStats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white">Loading player stats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header with player image */}
      <div className="relative h-80 bg-gradient-to-b from-gray-800 to-gray-900">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 p-2 hover:bg-gray-800 rounded z-10"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        {/* Player Image Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="absolute bottom-4 left-4">
          <h1 className="text-3xl font-bold">{playerName}</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-800">
        {(['batting', 'bowling', 'fielding'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 px-4 text-center font-medium uppercase tracking-wide ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="p-4">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{playerStats.matches}</div>
            <div className="text-sm text-gray-400">Matches</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{playerStats.innings}</div>
            <div className="text-sm text-gray-400">Innings</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-400">{playerStats.runs}</div>
            <div className="text-sm text-gray-400">Runs</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.notOuts}</div>
            <div className="text-sm text-gray-400">Not Outs</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.bestScore}</div>
            <div className="text-sm text-gray-400">Best Score</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.strikeRate}</div>
            <div className="text-sm text-gray-400">Strike Rate</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.average.toFixed(2)}</div>
            <div className="text-sm text-gray-400">Average</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.fours}</div>
            <div className="text-sm text-gray-400">Fours</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.sixes}</div>
            <div className="text-sm text-gray-400">Sixes</div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.thirties}</div>
            <div className="text-sm text-gray-400">Thirties</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.fifties}</div>
            <div className="text-sm text-gray-400">Fifties</div>
          </div>
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold">{playerStats.hundreds}</div>
            <div className="text-sm text-gray-400">Hundreds</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage;