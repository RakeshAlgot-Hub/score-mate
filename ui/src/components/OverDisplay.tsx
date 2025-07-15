import React from 'react';
import Card from './ui/Card';
import { getBallDisplayText, getBallColor } from '../utils/formatters';

interface Ball {
  runs: number;
  isWicket: boolean;
  ballType: string;
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
              {ball ? getBallDisplayText(ball) : '•'}
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default OverDisplay;