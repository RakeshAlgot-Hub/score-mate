import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, History, Trophy } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { ROUTES } from '../constants/appConstants';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 max-w-md mx-auto pb-20">
      <div className="text-center mb-8">
        <div className="bg-primary-600 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <Trophy className="text-white" size={40} />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">ScoreMate</h1>
        <p className="text-gray-600">Professional Cricket Scoring</p>
      </div>

      <div className="space-y-4">
        <Card>
          <Button
            onClick={() => navigate(ROUTES.TEAMS)}
            variant="primary"
            size="lg"
            icon={Plus}
            fullWidth
          >
            Start New Match
          </Button>
        </Card>

        <Card>
          <Button
            onClick={() => navigate(ROUTES.HISTORY)}
            variant="outline"
            size="lg"
            icon={History}
            fullWidth
          >
            Match History
          </Button>
        </Card>
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm text-gray-500">
          Professional cricket scoring made simple
        </p>
      </div>
    </div>
  );
};

export default HomePage;