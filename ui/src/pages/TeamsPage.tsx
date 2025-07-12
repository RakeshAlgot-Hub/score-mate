import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    hostTeam: '',
    visitorTeam: '',
    tossWonBy: 'host' as 'host' | 'visitor',
    optedTo: 'bat' as 'bat' | 'bowl',
    overs: 16,
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

  const handleAdvancedSettings = () => {
    if (validateForm()) {
      navigate('/advanced-settings');
    }
  };

  const handleStartMatch = () => {
    if (validateForm()) {
      navigate('/select-players');
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
            Toss won by?
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
            Opted to?
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
        />

        <div className="flex space-x-3 mt-6">
          <Button
            onClick={handleAdvancedSettings}
            variant="outline"
            size="lg"
            className="flex-1"
          >
            Advanced settings
          </Button>

          <Button
            onClick={handleStartMatch}
            variant="primary"
            size="lg"
            className="flex-1"
          >
            Start match
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TeamsPage;