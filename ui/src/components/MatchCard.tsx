import React from 'react';
import { MatchSummary } from '../types';

interface MatchCardProps {
  match: MatchSummary;
  onResume: (matchId: string) => void;
  onViewScoreboard: (matchId: string) => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onResume, onViewScoreboard }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {match.hostTeam.charAt(0)}
            </span>
          </div>
          <span className="font-medium">{match.hostTeam}</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">
            {match.totalRuns}/{match.wickets}
          </div>
          <div className="text-sm text-gray-500">({match.overs})</div>
        </div>
      </div>
      
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">
              {match.visitorTeam.charAt(0)}
            </span>
          </div>
          <span className="font-medium">{match.visitorTeam}</span>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">0/0</div>
          <div className="text-sm text-gray-500">(0.0)</div>
        </div>
      </div>

      <div className="text-sm text-gray-600 mb-3">
        {match.hostTeam} won the toss and opted to Bat first.
      </div>

      <div className="text-xs text-gray-500 mb-3">
        {match.createdAt}
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => onResume(match.id)}
          className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-blue-50"
        >
          Resume
        </button>
        <button
          onClick={() => onViewScoreboard(match.id)}
          className="flex-1 py-2 px-4 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-blue-50"
        >
          Scoreboard
        </button>
        <button className="p-2 text-gray-500 hover:text-gray-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
        <button className="p-2 text-red-500 hover:text-red-700">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MatchCard;