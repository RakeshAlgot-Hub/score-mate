import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Play } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useMatchStore, handleApiError } from '../store/matchStore';
import { createMatch } from '../services/matchService';
import { getScoreboard } from '../services/scoreService';
import { MatchConfig } from '../types';
import { ROUTES } from '../constants/appConstants';

interface FormData {
  hostTeam: string;
  visitorTeam: string;
  tossWonBy: 'host' | 'visitor';
  optedTo: 'bat' | 'bowl';
  overs: number;
}

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentMatch, setLoading, setError, isLoading, persistMatchIdToStorage, addMatchToLocalHistory } = useMatchStore();
  
  const [formData, setFormData] = useState<FormData>({
    hostTeam: '',
    visitorTeam: '',
    tossWonBy: 'host',
    optedTo: 'bat',
    overs: 20,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.hostTeam.trim()) {
      newErrors.hostTeam = 'Host team name is required';
    }
    
    if (!formData.visitorTeam.trim()) {
      newErrors.visitorTeam = 'Visitor team name is required';
    }
    
    if (formData.hostTeam.trim() === formData.visitorTeam.trim()) {
      newErrors.visitorTeam = 'Team names must be different';
    }
    
    if (formData.overs < 1 || formData.overs > 50) {
      newErrors.overs = 'Overs must be between 1 and 50';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createMatchConfig = (): MatchConfig => ({
    hostTeam: { name: formData.hostTeam.trim(), players: [] },
    visitorTeam: { name: formData.visitorTeam.trim(), players: [] },
    tossWonBy: formData.tossWonBy,
    optedTo: formData.optedTo,
    overs: formData.overs,
    settings: {
      playersPerTeam: 11,
      noBall: { reball: true, runs: 1 },
      wideBall: { reball: true, runs: 1 },
    },
  });

  const handleAdvancedSettings = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const matchConfig = createMatchConfig();
      const match = await createMatch(matchConfig);
      
      // Get initial scoreboard
      const scoreboard = await getScoreboard(match.id);
      
      setCurrentMatch({
        id: match.id,
        scoreboard,
        settings: matchConfig.settings,
      });

      // Save to local history and storage
      addMatchToLocalHistory(match);
      persistMatchIdToStorage(match.id);
      
      navigate(ROUTES.ADVANCED_SETTINGS);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleStartMatch = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const matchConfig = createMatchConfig();
      const match = await createMatch(matchConfig);

      // Get initial scoreboard
      const scoreboard = await getScoreboard(match.id);

      setCurrentMatch({
        id: match.id,
        scoreboard,
        settings: matchConfig.settings,
      });

      // Save to local history and storage
      addMatchToLocalHistory(match);
      persistMatchIdToStorage(match.id);

      navigate(ROUTES.SELECT_PLAYERS);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-20">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Teams</h2>
        
        <Input
          label="Host Team"
          value={formData.hostTeam}
          onChange={(e) => setFormData({ ...formData, hostTeam: e.target.value })}
          placeholder="Enter host team name"
          required
          error={errors.hostTeam}
        />

        <Input
          label="Visitor Team"
          value={formData.visitorTeam}
          onChange={(e) => setFormData({ ...formData, visitorTeam: e.target.value })}
          placeholder="Enter visitor team name"
          required
          error={errors.visitorTeam}
        />

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Toss won by? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="tossWonBy"
                value="host"
                checked={formData.tossWonBy === 'host'}
                onChange={(e) => setFormData({ ...formData, tossWonBy: e.target.value as 'host' | 'visitor' })}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Host Team</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="tossWonBy"
                value="visitor"
                checked={formData.tossWonBy === 'visitor'}
                onChange={(e) => setFormData({ ...formData, tossWonBy: e.target.value as 'host' | 'visitor' })}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Visitor Team</span>
            </label>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Opted to? <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="optedTo"
                value="bat"
                checked={formData.optedTo === 'bat'}
                onChange={(e) => setFormData({ ...formData, optedTo: e.target.value as 'bat' | 'bowl' })}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Bat</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="optedTo"
                value="bowl"
                checked={formData.optedTo === 'bowl'}
                onChange={(e) => setFormData({ ...formData, optedTo: e.target.value as 'bat' | 'bowl' })}
                className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Bowl</span>
            </label>
          </div>
        </div>

        <Input
          label="Overs?"
          type="number"
          value={formData.overs}
          onChange={(e) => setFormData({ ...formData, overs: parseInt(e.target.value) || 0 })}
          placeholder="Enter number of overs"
          required
          error={errors.overs}
          min={1}
          max={50}
        />

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={handleAdvancedSettings}
            variant="outline"
            size="lg"
            icon={Settings}
            className="flex-1"
            disabled={isLoading}
          >
            Advanced settings
          </Button>

          <Button
            onClick={handleStartMatch}
            variant="primary"
            size="lg"
            icon={Play}
            className="flex-1"
            loading={isLoading}
          >
            Start match
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TeamsPage;