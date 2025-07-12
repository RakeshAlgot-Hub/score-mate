import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Play } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useMatchStore } from '../store/matchStore';
import { createMatch } from '../services/matchService';
import { MatchConfig, Team } from '../types';

const NewMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const { setCurrentMatch, setLoading, setError } = useMatchStore();
  
  const [formData, setFormData] = useState({
    hostTeam: '',
    visitorTeam: '',
    tossWonBy: 'host' as 'host' | 'visitor',
    optedTo: 'bat' as 'bat' | 'bowl',
    overs: 20,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    const matchConfig: MatchConfig = {
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
    };

    try {
      const response = await createMatch(matchConfig);
      const matchId = response.result.id;
      
      setCurrentMatch({
        id: matchId,
        scoreboard: response.result.scoreboard,
        settings: matchConfig.settings,
      });
      
      navigate('/advanced-settings');
    } catch (error) {
      setError('Failed to create match. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Match Details</h2>
        
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Toss Won By <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tossWonBy: 'host' })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.tossWonBy === 'host'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-primary-300'
              }`}
            >
              Host Team
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, tossWonBy: 'visitor' })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.tossWonBy === 'visitor'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-primary-300'
              }`}
            >
              Visitor Team
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Opted To <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, optedTo: 'bat' })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.optedTo === 'bat'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-primary-300'
              }`}
            >
              Bat First
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, optedTo: 'bowl' })}
              className={`p-3 rounded-lg border-2 transition-colors ${
                formData.optedTo === 'bowl'
                  ? 'border-primary-600 bg-primary-50 text-primary-600'
                  : 'border-gray-300 text-gray-700 hover:border-primary-300'
              }`}
            >
              Bowl First
            </button>
          </div>
        </div>

        <Input
          label="Overs"
          type="number"
          value={formData.overs}
          onChange={(e) => setFormData({ ...formData, overs: parseInt(e.target.value) || 0 })}
          placeholder="Enter number of overs"
          required
          error={errors.overs}
        />

        <div className="space-y-3 mt-6">
          <Button
            onClick={() => navigate('/advanced-settings')}
            variant="outline"
            size="lg"
            icon={Settings}
            className="w-full"
          >
            Advanced Settings
          </Button>

          <Button
            onClick={handleSubmit}
            variant="primary"
            size="lg"
            icon={Play}
            className="w-full"
          >
            Start Match
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NewMatchPage;