import React from 'react';
import Button from './ui/Button';

interface ScorePadProps {
  onRunClick: (runs: number) => void;
  onExtraClick: (type: 'wide' | 'noBall' | 'bye' | 'legBye') => void;
  onWicketClick: () => void;
  disabled?: boolean;
}

const ScorePad: React.FC<ScorePadProps> = ({
  onRunClick,
  onExtraClick,
  onWicketClick,
  disabled = false,
}) => {
  const runButtons = [0, 1, 2, 3, 4, 5, 6];

  return (
    <div className="space-y-4">
      {/* Run Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {runButtons.map((runs) => (
          <Button
            key={runs}
            variant={runs === 6 ? 'success' : runs === 4 ? 'secondary' : 'outline'}
            className="aspect-square text-lg font-bold"
            onClick={() => onRunClick(runs)}
            disabled={disabled}
          >
            {runs}
          </Button>
        ))}
        <Button
          variant="danger"
          className="aspect-square text-sm font-bold"
          onClick={onWicketClick}
          disabled={disabled}
        >
          W
        </Button>
      </div>

      {/* Extra Buttons */}
      <div className="grid grid-cols-2 gap-2">
        <Button
          variant="outline"
          onClick={() => onExtraClick('wide')}
          disabled={disabled}
          className="text-sm"
        >
          Wide
        </Button>
        <Button
          variant="outline"
          onClick={() => onExtraClick('noBall')}
          disabled={disabled}
          className="text-sm"
        >
          No Ball
        </Button>
        <Button
          variant="outline"
          onClick={() => onExtraClick('bye')}
          disabled={disabled}
          className="text-sm"
        >
          Bye
        </Button>
        <Button
          variant="outline"
          onClick={() => onExtraClick('legBye')}
          disabled={disabled}
          className="text-sm"
        >
          Leg Bye
        </Button>
      </div>
    </div>
  );
};

export default ScorePad;