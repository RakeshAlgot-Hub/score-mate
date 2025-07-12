import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createMatch } from '../services/matchService';
import { Match } from '../types';

const NewMatchPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    hostTeam: '',
    visitorTeam: '',
    overs: 20,
    tossWinner: '',
    decision: 'bat' as 'bat' | 'bowl'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const match = await createMatch(formData);
      navigate(`/score-entry/${match.id}`);
    } catch (error) {
      console.error('Error creating match:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-blue-600 text-white p-4 rounded-t-lg">
          <h1 className="text-xl font-bold">New Match</h1>
        </div>
        
        <div className="bg-white p-6 rounded-b-lg shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Host Team
              </label>
              <input
                type="text"
                value={formData.hostTeam}
                onChange={(e) => setFormData(prev => ({ ...prev, hostTeam: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Visitor Team
              </label>
              <input
                type="text"
                value={formData.visitorTeam}
                onChange={(e) => setFormData(prev => ({ ...prev, visitorTeam: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Overs
              </label>
              <select
                value={formData.overs}
                onChange={(e) => setFormData(prev => ({ ...prev, overs: parseInt(e.target.value) }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={5}>5 Overs</option>
                <option value={10}>10 Overs</option>
                <option value={20}>20 Overs</option>
                <option value={50}>50 Overs</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Toss Winner
              </label>
              <select
                value={formData.tossWinner}
                onChange={(e) => setFormData(prev => ({ ...prev, tossWinner: e.target.value }))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select team</option>
                <option value={formData.hostTeam}>{formData.hostTeam}</option>
                <option value={formData.visitorTeam}>{formData.visitorTeam}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decision
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bat"
                    checked={formData.decision === 'bat'}
                    onChange={(e) => setFormData(prev => ({ ...prev, decision: e.target.value as 'bat' | 'bowl' }))}
                    className="mr-2"
                  />
                  Bat First
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="bowl"
                    checked={formData.decision === 'bowl'}
                    onChange={(e) => setFormData(prev => ({ ...prev, decision: e.target.value as 'bat' | 'bowl' }))}
                    className="mr-2"
                  />
                  Bowl First
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Start Match
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewMatchPage;