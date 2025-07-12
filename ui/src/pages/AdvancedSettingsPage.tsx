import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Toggle from '../components/ui/Toggle';
import Card from '../components/ui/Card';
import { useMatchStore } from '../store/matchStore';
import { updateMatchSettings } from '../services/api';
import { MatchSettings } from '../types';

const AdvancedSettingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { currentMatch, updateSettings, setLoading, setError } = useMatchStore();
  
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
      navigate('/select-players');
    } catch (error) {
      setError('Failed to save settings. Please try again.');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
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
        />
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-primary-600 mb-4">No Ball</h3>
        
        <div className="space-y-4">
          <Toggle
            label="Re-ball"
            checked={settings.noBall.reball}
            onChange={(checked) => setSettings({
              ...settings,
              noBall: { ...settings.noBall, reball: checked }
            })}
          />
          
          <Input
            label="No ball run"
            type="number"
            value={settings.noBall.runs}
            onChange={(e) => setSettings({
              ...settings,
              noBall: { ...settings.noBall, runs: parseInt(e.target.value) || 1 }
            })}
          />
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-primary-600 mb-4">Wide Ball</h3>
        
        <div className="space-y-4">
          <Toggle
            label="Re-ball"
            checked={settings.wideBall.reball}
            onChange={(checked) => setSettings({
              ...settings,
              wideBall: { ...settings.wideBall, reball: checked }
            })}
          />
          
          <Input
            label="Wide ball run"
            type="number"
            value={settings.wideBall.runs}
            onChange={(e) => setSettings({
              ...settings,
              wideBall: { ...settings.wideBall, runs: parseInt(e.target.value) || 1 }
            })}
          />
        </div>
      </Card>

      <Card>
        <Button
          onClick={handleSave}
          variant="primary"
          size="lg"
          icon={Save}
          className="w-full"
        >
          Save Settings
        </Button>
      </Card>
    </div>
  );
};

export default AdvancedSettingsPage;