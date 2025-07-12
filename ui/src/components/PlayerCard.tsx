import React from 'react';
import { BattingStats, BowlingStats } from '../types';

interface PlayerCardProps {
  name: string;
  stats: BattingStats | BowlingStats;
  type: 'batting' | 'bowling';
}

const PlayerCard: React.FC<PlayerCardProps> = ({ name, stats, type }) => {
  if (type === 'batting') {
    const battingStats = stats as BattingStats;
    return (
      <tr className="border-b border-gray-200">
        <td className="py-2 px-3 text-sm">
          <div>
            <div className="font-medium">{name}</div>
            {battingStats.notOut && (
              <div className="text-xs text-gray-500">not out</div>
            )}
          </div>
        </td>
        <td className="py-2 px-3 text-sm text-center">{battingStats.runs}</td>
        <td className="py-2 px-3 text-sm text-center">{battingStats.balls}</td>
        <td className="py-2 px-3 text-sm text-center">{battingStats.fours}</td>
        <td className="py-2 px-3 text-sm text-center">{battingStats.sixes}</td>
        <td className="py-2 px-3 text-sm text-center">{battingStats.strikeRate.toFixed(2)}</td>
      </tr>
    );
  }

  const bowlingStats = stats as BowlingStats;
  return (
    <tr className="border-b border-gray-200">
      <td className="py-2 px-3 text-sm font-medium">{name}</td>
      <td className="py-2 px-3 text-sm text-center">{bowlingStats.overs}</td>
      <td className="py-2 px-3 text-sm text-center">{bowlingStats.maidens}</td>
      <td className="py-2 px-3 text-sm text-center">{bowlingStats.runs}</td>
      <td className="py-2 px-3 text-sm text-center">{bowlingStats.wickets}</td>
      <td className="py-2 px-3 text-sm text-center">{bowlingStats.economy.toFixed(2)}</td>
    </tr>
  );
};

export default PlayerCard;