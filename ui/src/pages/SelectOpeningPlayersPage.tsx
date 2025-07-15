import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useMatchStore, handleApiError } from '../store/matchStore';
import { setOpeningPlayers } from '../services/matchService';
import { getScoreboard } from '../services/scoreService';
import { OpeningPlayers } from '../types';
import { ROUTES } from '../constants/appConstants';

const SelectOpeningPlayersPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch, updateScoreboard, setLoading, setError, isLoading } = useMatchStore();
  
  const [players, setPlayers] = useState<OpeningPlayers>({
    striker: '',
    nonStriker: '',
    bowler: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!players.striker?.trim()) {
      newErrors.striker = 'Striker name is required';
    }
    
    if (!players.nonStriker?.trim()) {
      newErrors.nonStriker = 'Non-striker name is required';
    }
    
    if (!players.bowler?.trim()) {
      newErrors.bowler = 'Bowler name is required';
    }
    
    if (players.striker?.trim() === players.nonStriker?.trim()) {
      newErrors.nonStriker = 'Striker and non-striker must be different players';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    if (!currentMatch) {
      setError('No active match found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await setOpeningPlayers(currentMatch.id, players);
      
      // Refresh scoreboard after setting opening players
      const updatedScoreboard = await getScoreboard(currentMatch.id);
      updateScoreboard(updatedScoreboard);
      
      navigate(ROUTES.SCORING);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Select Opening Players</h2>
        
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-3">Batting Team</h3>
            
            <Input
              label="Striker Name"
              value={players.striker || ''}
              onChange={(e) => setPlayers({ ...players, striker: e.target.value })}
              placeholder="Enter striker name"
              required
              error={errors.striker}
            />

            <Input
              label="Non-Striker Name"
              value={players.nonStriker || ''}
              onChange={(e) => setPlayers({ ...players, nonStriker: e.target.value })}
              placeholder="Enter non-striker name"
              required
              error={errors.nonStriker}
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-primary-600 mb-3">Bowling Team</h3>
            
            <Input
              label="Opening Bowler"
              value={players.bowler || ''}
              onChange={(e) => setPlayers({ ...players, bowler: e.target.value })}
              placeholder="Enter bowler name"
              required
              error={errors.bowler}
            />
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          variant="primary"
          size="lg"
          icon={Play}
          fullWidth
          loading={isLoading}
          className="mt-6"
        >
          Start Scoring
        </Button>
      </Card>
    </div>
  );
};

export default SelectOpeningPlayersPage;