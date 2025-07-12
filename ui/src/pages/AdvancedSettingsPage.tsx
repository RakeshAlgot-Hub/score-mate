import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';
import { useMatchStore, handleApiError } from '../store/matchStore';
import { updateMatchSettings } from '../services/matchService';
import { MatchSettings } from '../types';
import { ROUTES } from '../constants/appConstants';

const AdvancedSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch, updateSettings, setLoading, setError, isLoading } = useMatchStore();
  
  const [settings, setSettings] = useState<MatchSettings>({
    playersPerTeam: 11,
    noBall: { reball: true, runs: 1 },
    wideBall: { reball: true, runs: 1 },
  });

  useEffect(() => {
    if (currentMatch?.settings) {
      setSettings(currentMatch.settings);
    }
  }, [currentMatch]);

  const handleSave = async () => {
    if (!currentMatch) {
      setError('No active match found');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await updateMatchSettings(currentMatch.id, settings);
      updateSettings(settings);
      navigate(ROUTES.SELECT_PLAYERS);
    } catch (error) {
      setError(handleApiError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (section: 'noBall' | 'wideBall', field: 'reball') => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: !prev[section][field]
      }
    }));
  };

  return (
    <div className="p-4 max-w-md mx-auto space-y-4">
      <Card>
        <h2 className="text-xl font-bold text-gray-900 mb-6">Match Settings</h2>
        
        <Input
          label="Players per team?"
          type="number"
          value={settings.playersPerTeam}
          onChange={(e) => setSettings({
            ...settings,
            playersPerTeam: parseInt(e.target.value) || 11
          })}
          placeholder="Enter number of players"
          min={1}
          max={15}
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-primary-600 mb-4">No Ball</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Re-ball</span>
            <button
              type="button"
              onClick={() => handleToggle('noBall', 'reball')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.noBall.reball ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.noBall.reball ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <Input
            label="No ball run"
            type="number"
            value={settings.noBall.runs}
            onChange={(e) => setSettings({
              ...settings,
              noBall: { ...settings.noBall, runs: parseInt(e.target.value) || 1 }
            })}
            min={0}
            max={10}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-primary-600 mb-4">Wide Ball</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Re-ball</span>
            <button
              type="button"
              onClick={() => handleToggle('wideBall', 'reball')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.wideBall.reball ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.wideBall.reball ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
          
          <Input
            label="Wide ball run"
            type="number"
            value={settings.wideBall.runs}
            onChange={(e) => setSettings({
              ...settings,
              wideBall: { ...settings.wideBall, runs: parseInt(e.target.value) || 1 }
            })}
            min={0}
            max={10}
          />
        </div>
      </Card>

      <Card>
        <Button
          onClick={handleSave}
          variant="primary"
          size="lg"
          icon={Save}
          fullWidth
          loading={isLoading}
        >
          Save Settings
        </Button>
      </Card>
    </div>
  );
};

export default AdvancedSettingsPage;