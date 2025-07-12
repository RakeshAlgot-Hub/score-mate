import React from 'react';
import Card from './ui/Card';

interface Ball {
  runs: number;
  isWicket: boolean;
  isExtra: boolean;
  type: string;
}

interface OverDisplayProps {
  balls: Ball[];
  currentOver: number;
  className?: string;
}

const OverDisplay: React.FC<OverDisplayProps> = ({
  balls,
  currentOver,
  className = '',
}) => {
  const formatBall = (ball: Ball): string => {
    if (ball.isWicket) return 'W';
    if (ball.isExtra) {
      switch (ball.type) {
        case 'wide': return 'Wd';
        case 'noBall': return 'Nb';
        case 'bye': return 'B';
        case 'legBye': return 'Lb';
        default: return ball.runs.toString();
      }
    }
    return ball.runs.toString();
  };

  const getBallColor = (ball: Ball): string => {
    if (ball.isWicket) return 'bg-red-500 text-white';
    if (ball.runs === 6) return 'bg-green-500 text-white';
    if (ball.runs === 4) return 'bg-blue-500 text-white';
    if (ball.isExtra) return 'bg-yellow-500 text-black';
    return 'bg-gray-200 text-gray-800';
  };

  return (
    <Card className={className}>
      <h3 className="font-semibold text-gray-900 mb-3">
        Over {currentOver + 1}
      </h3>
      <div className="flex space-x-2">
        {[...Array(6)].map((_, index) => {
          const ball = balls[index];
          return (
            <div
              key={index}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                ball ? getBallColor(ball) : 'border-2 border-gray-300 text-gray-400'
              }`}
            >
              {ball ? formatBall(ball) : '•'}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default OverDisplay;