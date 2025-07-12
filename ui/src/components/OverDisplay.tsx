import React from 'react';
import { CurrentOver } from '../types';

interface OverDisplayProps {
  currentOver: CurrentOver;
}

const OverDisplay: React.FC<OverDisplayProps> = ({ currentOver }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
      <h3 className="text-sm font-medium text-gray-700 mb-2">This over:</h3>
      <div className="flex space-x-2">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center text-sm font-medium"
          >
            {currentOver.balls[index] ?? ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OverDisplay;