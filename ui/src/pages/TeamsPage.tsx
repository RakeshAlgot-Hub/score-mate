import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPlayers } from '../services/playerService';
import { Player } from '../types';
import { Users, ArrowLeft, Search } from 'lucide-react';

const TeamsPage: React.FC = () => {
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<string>('all');

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        const playerData = await getAllPlayers();
        setPlayers(playerData);
      } catch (error) {
        console.error('Error loading players:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPlayers();
  }, []);

  const teams = ['all', ...Array.from(new Set(players.map(p => p.team)))];
  
  const filteredPlayers = players.filter(player => {
    const matchesSearch = player.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTeam = selectedTeam === 'all' || player.team === selectedTeam;
    return matchesSearch && matchesTeam;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/history')}
            className="p-2 hover:bg-blue-700 rounded"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Teams & Players</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="p-4">
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-4">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search players..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto">
            {teams.map((team) => (
              <button
                key={team}
                onClick={() => setSelectedTeam(team)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
                  selectedTeam === team
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {team === 'all' ? 'All Teams' : team}
              </button>
            ))}
          </div>
        </div>

        {/* Players List */}
        <div className="space-y-3">
          {filteredPlayers.map((player) => (
            <div
              key={player.id}
              onClick={() => navigate(`/player/${player.id}`)}
              className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{player.name}</h3>
                    <p className="text-sm text-gray-600">{player.team}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  {player.battingStats && (
                    <div className="text-sm">
                      <div className="font-semibold">{player.battingStats.runs} runs</div>
                      <div className="text-gray-500">SR: {player.battingStats.strikeRate.toFixed(1)}</div>
                    </div>
                  )}
                  {player.fieldingStats && (
                    <div className="text-sm">
                      <div className="font-semibold">{player.fieldingStats.runs} runs</div>
                      <div className="text-gray-500">Avg: {player.fieldingStats.average.toFixed(1)}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No players found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamsPage;