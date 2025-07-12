import React from 'react';

interface ScorePadProps {
  onScore: (run: number) => void;
  onWicket: () => void;
  onExtra: (type: 'wide' | 'noBall' | 'bye' | 'legBye') => void;
  onUndo: () => void;
}

const ScorePad: React.FC<ScorePadProps> = ({ onScore, onWicket, onExtra, onUndo }) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {/* Extras Row */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <button
          onClick={() => onExtra('wide')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 text-sm font-medium"
        >
          Wide
        </button>
        <button
          onClick={() => onExtra('noBall')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 text-sm font-medium"
        >
          No Ball
        </button>
        <button
          onClick={() => onExtra('bye')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 text-sm font-medium"
        >
          Byes
        </button>
        <button
          onClick={() => onExtra('legBye')}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 text-sm font-medium"
        >
          Leg Byes
        </button>
      </div>

      {/* Wicket Row */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={onWicket}
          className="p-3 border border-gray-300 rounded-lg hover:bg-blue-50 text-sm font-medium"
        >
          Wicket
        </button>
        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          Retire
        </button>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          Swap Batsman
        </button>
        <button
          onClick={onUndo}
          className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          Undo
        </button>
      </div>

      {/* Number Pad */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {numbers.map((num) => (
          <button
            key={num}
            onClick={() => onScore(num)}
            className="p-4 border-2 border-gray-300 rounded-full hover:bg-blue-50 active:bg-blue-100 text-lg font-semibold transition-colors"
          >
            {num}
          </button>
        ))}
        <button className="p-4 border-2 border-gray-300 rounded-full hover:bg-blue-50 text-lg font-semibold">
          ...
        </button>
      </div>

      {/* Additional Action Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          Partnerships
        </button>
        <button className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          Extras
        </button>
      </div>
    </div>
  );
};

export default ScorePad;